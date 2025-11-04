import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProgressHero } from "@/components/dashboard/progress-hero";
import { EmptyState } from "@/components/dashboard/empty-state";
import Link from "next/link";
import { Upload, CheckSquare, TrendingUp, AlertCircle, Sparkles, FileCheck, Info } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get user's household
  const { data: membership } = await supabase
    .from("memberships")
    .select("household:households(*)")
    .eq("user_id", user.id)
    .single();

  const household = membership?.household;

  // Get current tax year
  const currentYear = new Date().getFullYear();
  const { data: taxYear } = await supabase
    .from("tax_years")
    .select("*")
    .eq("household_id", household?.id)
    .eq("year", currentYear)
    .single();

  // Get documents count
  const { count: documentsCount } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("tax_year_id", taxYear?.id);

  // Get checklist items
  const { data: checklistItems } = await supabase
    .from("checklist_items")
    .select("*")
    .eq("tax_year_id", taxYear?.id);

  const totalItems = checklistItems?.length || 0;
  const completedItems = checklistItems?.filter((item) => item.status === "done").length || 0;
  const requiredMissing = checklistItems?.filter(
    (item) => item.required && item.status !== "done"
  );

  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Get user profile for plan
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Extract first name from email or user metadata
  const firstName = user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0];

  // No checklist yet - show friendly empty state
  if (!checklistItems || checklistItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {firstName}! 👋</h1>
            <p className="text-muted-foreground">Let's get your tax documents organized.</p>
          </div>
          <Badge variant="secondary" className="h-fit">
            {profile?.plan.toUpperCase() || "FREE"}
          </Badge>
        </div>

        <EmptyState />

        {/* Quick start tips */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Quick Start Tips</CardTitle>
            </div>
            <CardDescription>Here's how to get the most out of TaxFlow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <p className="font-medium">Upload last year's documents</p>
                <p className="text-sm text-muted-foreground">
                  This helps us create a personalized checklist based on your tax situation.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <p className="font-medium">Review your checklist</p>
                <p className="text-sm text-muted-foreground">
                  We'll show you exactly what you need for this year. No guessing!
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <p className="font-medium">Relax and let us remind you</p>
                <p className="text-sm text-muted-foreground">
                  We'll send gentle weekly reminders as tax season approaches. No stress!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Plan Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hey {firstName}! 👋</h1>
          <p className="text-muted-foreground">Here's where you stand for {currentYear} taxes</p>
        </div>
        <Badge variant="secondary" className="h-fit text-sm px-3 py-1">
          {profile?.plan.toUpperCase() || "FREE"} PLAN
        </Badge>
      </div>

      {/* Progress Hero - Confidence Building */}
      <ProgressHero
        name={firstName}
        progress={progress}
        completedItems={completedItems}
        totalItems={totalItems}
        year={currentYear}
      />

      {/* Missing Items - Softer Presentation */}
      {requiredMissing && requiredMissing.length > 0 ? (
        <Card className="border-warning/30 bg-warning/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-warning" />
              <CardTitle>Still Need These</CardTitle>
            </div>
            <CardDescription>
              {requiredMissing.length} {requiredMissing.length === 1 ? "item" : "items"} to complete your checklist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requiredMissing.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-3 rounded-lg border border-warning/20 bg-background/60 p-4 transition-all hover:shadow-md hover:border-warning/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning group-hover:bg-warning/20 transition-colors">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {item.category || "other"}
                    </Badge>
                    <Link href="/dashboard/documents">
                      <Button size="sm" variant="outline" className="animate-lift">
                        Upload
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              {requiredMissing.length > 5 && (
                <Link href="/dashboard/checklist">
                  <Button variant="link" className="w-full">
                    View {requiredMissing.length - 5} more items →
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-success/10 p-6 mb-4">
                <CheckSquare className="h-12 w-12 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-success mb-2">You're all set! 🎉</h3>
              <p className="text-muted-foreground max-w-md">
                All required items are complete. Take a deep breath and relax - you're ready for tax season!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions - Enhanced */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/dashboard/documents">
            <Card className="cursor-pointer transition-all hover:shadow-lg animate-lift group">
              <CardHeader>
                <div className="rounded-lg bg-primary/10 w-fit p-3 mb-2 group-hover:bg-primary/20 transition-colors">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>
                  Drag and drop PDFs or connect Gmail/Drive
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/checklist">
            <Card className="cursor-pointer transition-all hover:shadow-lg animate-lift group">
              <CardHeader>
                <div className="rounded-lg bg-primary/10 w-fit p-3 mb-2 group-hover:bg-primary/20 transition-colors">
                  <CheckSquare className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>View Checklist</CardTitle>
                <CardDescription>
                  See all items for Tax Year {currentYear}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {documentsCount && documentsCount > 0 ? (
            <Link href="/dashboard/documents">
              <Card className="cursor-pointer transition-all hover:shadow-lg animate-lift group">
                <CardHeader>
                  <div className="rounded-lg bg-success/10 w-fit p-3 mb-2 group-hover:bg-success/20 transition-colors">
                    <FileCheck className="h-8 w-8 text-success" />
                  </div>
                  <CardTitle>Export for CPA</CardTitle>
                  <CardDescription>
                    Download everything in one organized package
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ) : (
            <Link href="/dashboard/billing">
              <Card className="cursor-pointer transition-all hover:shadow-lg animate-lift group">
                <CardHeader>
                  <div className="rounded-lg bg-warning/10 w-fit p-3 mb-2 group-hover:bg-warning/20 transition-colors">
                    <TrendingUp className="h-8 w-8 text-warning" />
                  </div>
                  <CardTitle>Upgrade Plan</CardTitle>
                  <CardDescription>
                    Unlock more features and peace of mind
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Documents</CardDescription>
            <CardTitle className="text-3xl font-mono">{documentsCount || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {documentsCount === 0 ? "Upload your first document to get started" : "Organized and ready"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Checklist Progress</CardDescription>
            <CardTitle className="text-3xl font-mono">{progress}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {completedItems} of {totalItems} items complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Your Plan</CardDescription>
            <CardTitle className="text-2xl">{profile?.plan.toUpperCase() || "FREE"}</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.plan === "free" ? (
              <Link href="/dashboard/billing">
                <Button variant="link" className="h-auto p-0 text-sm">
                  Upgrade for more features →
                </Button>
              </Link>
            ) : (
              <p className="text-sm text-success font-medium">✓ All features unlocked</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Prompt for Free Users */}
      {profile?.plan === "free" && (
        <Alert className="border-primary/30 bg-gradient-subtle">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertDescription>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium mb-1">Want even more peace of mind?</p>
                <p className="text-sm text-muted-foreground">
                  Upgrade to unlock automatic Gmail/Drive imports, weekly reminders, and priority support.
                  Most users upgrade after seeing how easy TaxFlow makes their life.
                </p>
              </div>
              <Link href="/dashboard/billing">
                <Button size="sm" className="shrink-0 animate-lift">
                  View Plans
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
