import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProgressRing } from "@/components/progress-ring";
import Link from "next/link";
import { FileText, Upload, CheckSquare, AlertCircle, TrendingUp } from "lucide-react";

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's your tax year progress.</p>
        </div>
        <Badge variant="secondary" className="h-fit">
          {profile?.plan.toUpperCase() || "FREE"}
        </Badge>
      </div>

      {/* Progress and Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Tax Year {currentYear}</CardTitle>
            <CardDescription>Collection progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <ProgressRing progress={progress} size={120} />
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">
                  {completedItems} / {totalItems}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Documents</span>
                <span className="font-medium">{documentsCount || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Missing This Week</CardTitle>
            <CardDescription>
              {requiredMissing && requiredMissing.length > 0
                ? "Required documents you still need to collect"
                : "All caught up! Great work."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requiredMissing && requiredMissing.length > 0 ? (
              <div className="space-y-2">
                {requiredMissing.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                  >
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {item.category || "other"}
                    </Badge>
                  </div>
                ))}
                {requiredMissing.length > 5 && (
                  <Link href="/dashboard/checklist">
                    <Button variant="link" className="h-auto p-0 text-xs">
                      +{requiredMissing.length - 5} more items
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckSquare className="mb-3 h-12 w-12 text-green-500" />
                <p className="text-sm font-medium">You're all set!</p>
                <p className="text-xs text-muted-foreground">
                  All required items are complete.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/documents">
          <Card className="cursor-pointer transition-all hover:shadow-md">
            <CardHeader>
              <Upload className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Drag and drop PDFs or connect Gmail/Drive
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/checklist">
          <Card className="cursor-pointer transition-all hover:shadow-md">
            <CardHeader>
              <CheckSquare className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>View Checklist</CardTitle>
              <CardDescription>
                See all items for Tax Year {currentYear}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/billing">
          <Card className="cursor-pointer transition-all hover:shadow-md">
            <CardHeader>
              <TrendingUp className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Upgrade Plan</CardTitle>
              <CardDescription>
                Unlock more features and storage
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Tips and Alerts */}
      {profile?.plan === "free" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You're on the Free plan. Upgrade to Basic or Pro to unlock Gmail/Drive imports,
            email nudges, and more storage.{" "}
            <Link href="/dashboard/billing" className="font-medium underline">
              View plans
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {!checklistItems || checklistItems.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Checklist Yet</CardTitle>
            <CardDescription>
              Upload documents from last year to generate a personalized checklist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/documents">
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Upload Documents
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

