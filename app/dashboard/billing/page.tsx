import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, CreditCard, ExternalLink } from "lucide-react";

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get billing info
  const { data: billing } = await supabase
    .from("billing")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get usage stats
  const { data: membership } = await supabase
    .from("memberships")
    .select("household:households(*)")
    .eq("user_id", user.id)
    .single();

  const household = membership?.household;
  const currentYear = new Date().getFullYear();

  const { data: taxYear } = await supabase
    .from("tax_years")
    .select("*")
    .eq("household_id", household?.id)
    .eq("year", currentYear)
    .single();

  const { count: documentsCount } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("tax_year_id", taxYear?.id);

  const currentPlan = profile?.plan || "free";

  const plans = [
    {
      name: "Free",
      price: 0,
      features: [
        "1 household",
        "1 active tax year",
        "Up to 10 documents",
        "Manual upload only",
      ],
      limits: { households: 1, taxYears: 1, documents: 10 },
    },
    {
      name: "Basic",
      price: 9,
      features: [
        "2 active tax years",
        "Up to 100 documents",
        "Gmail & Drive ingest",
        "Weekly email nudges",
      ],
      limits: { households: 1, taxYears: 2, documents: 100 },
      priceId: process.env.STRIPE_PRICE_BASIC,
    },
    {
      name: "Pro",
      price: 19,
      features: [
        "Unlimited tax years",
        "Up to 1000 documents",
        "Priority AI parsing",
        "Export package for CPA",
      ],
      limits: { households: 999, taxYears: 999, documents: 1000 },
      priceId: process.env.STRIPE_PRICE_PRO,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription and usage</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>You are currently on the {currentPlan} plan</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {currentPlan.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Documents Used</p>
                <p className="text-2xl font-bold">
                  {documentsCount || 0} / {plans.find((p) => p.name.toLowerCase() === currentPlan)?.limits.documents}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Active Tax Years</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Storage</p>
                <p className="text-2xl font-bold">Unlimited</p>
              </div>
            </div>

            {billing && billing.stripe_customer_id && (
              <form action="/api/stripe/portal" method="POST">
                <Button type="submit" variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Subscription
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrentPlan = plan.name.toLowerCase() === currentPlan;
            const isFree = plan.name === "Free";

            return (
              <Card
                key={plan.name}
                className={isCurrentPlan ? "border-primary shadow-md" : ""}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {isCurrentPlan && <Badge>Current</Badge>}
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {!isCurrentPlan && !isFree && (
                    <form action="/api/stripe/create-checkout-session" method="POST" className="mt-6">
                      <input type="hidden" name="priceId" value={plan.priceId} />
                      <input type="hidden" name="plan" value={plan.name.toLowerCase()} />
                      <Button type="submit" className="w-full">
                        {currentPlan === "free" ? "Upgrade" : "Change Plan"}
                      </Button>
                    </form>
                  )}

                  {isCurrentPlan && !isFree && (
                    <Button className="mt-6 w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

