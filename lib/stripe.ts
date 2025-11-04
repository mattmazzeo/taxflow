import Stripe from "stripe";

// Lazy-load Stripe client to avoid build-time errors
let stripeClient: Stripe | null = null;
function getStripeClient(): Stripe | null {
  if (!stripeClient && process.env.STRIPE_SECRET_KEY) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-11-20.acacia",
      typescript: true,
    });
  }
  return stripeClient;
}

// Export stripe instance (may be null if not configured)
export const stripe = getStripeClient();

/**
 * Get or create a Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  const client = getStripeClient();
  if (!client) {
    throw new Error("Stripe is not configured");
  }

  const customer = await client.customers.create({
    email,
    name: name || undefined,
    metadata: {
      supabase_user_id: userId,
    },
  });

  return customer.id;
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const client = getStripeClient();
  if (!client) {
    throw new Error("Stripe is not configured");
  }

  const session = await client.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });

  return session;
}

/**
 * Create a billing portal session
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
) {
  const client = getStripeClient();
  if (!client) {
    throw new Error("Stripe is not configured");
  }

  const session = await client.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  const client = getStripeClient();
  if (!client) {
    throw new Error("Stripe is not configured");
  }

  return await client.subscriptions.retrieve(subscriptionId);
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  const client = getStripeClient();
  if (!client) {
    throw new Error("Stripe is not configured");
  }

  return await client.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}
