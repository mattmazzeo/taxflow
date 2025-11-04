import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Use service client to bypass RLS
  const supabase = await createServiceClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === "subscription" && session.subscription) {
          const userId = session.metadata?.user_id;
          const plan = session.metadata?.plan || "basic";

          if (!userId) {
            console.error("No user_id in session metadata");
            break;
          }

          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // Update billing record
          await supabase.from("billing").upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            plan: plan as "basic" | "pro",
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          });

          // Update profile plan
          await supabase
            .from("profiles")
            .update({ plan: plan as "basic" | "pro" })
            .eq("user_id", userId);

          console.log(`Subscription created for user ${userId}, plan: ${plan}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const { data: billing } = await supabase
          .from("billing")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!billing) {
          console.error("No billing record found for customer:", customerId);
          break;
        }

        // Determine plan from subscription
        let plan: "basic" | "pro" = "basic";
        if (subscription.items.data[0]?.price.id === process.env.STRIPE_PRICE_PRO) {
          plan = "pro";
        }

        // Update billing record
        await supabase
          .from("billing")
          .update({
            stripe_subscription_id: subscription.id,
            plan: plan,
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq("user_id", billing.user_id);

        // Update profile plan
        await supabase
          .from("profiles")
          .update({ plan })
          .eq("user_id", billing.user_id);

        console.log(
          `Subscription updated for user ${billing.user_id}, plan: ${plan}`
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const { data: billing } = await supabase
          .from("billing")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!billing) {
          console.error("No billing record found for customer:", customerId);
          break;
        }

        // Downgrade to free
        await supabase
          .from("billing")
          .update({
            stripe_subscription_id: null,
            plan: "free",
            current_period_end: null,
            cancel_at_period_end: false,
          })
          .eq("user_id", billing.user_id);

        // Update profile plan
        await supabase
          .from("profiles")
          .update({ plan: "free" })
          .eq("user_id", billing.user_id);

        console.log(`Subscription canceled for user ${billing.user_id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

