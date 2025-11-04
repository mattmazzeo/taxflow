import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadDropzone } from "@/components/upload-dropzone";
import { DocumentRow } from "@/components/document-row";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Upload, Mail, HardDrive, Download, Sparkles, Info } from "lucide-react";
import Link from "next/link";

export default async function DocumentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get user's household and current tax year
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

  // Get documents
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("tax_year_id", taxYear?.id)
    .order("created_at", { ascending: false });

  // Get user profile for plan limits
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const planLimits: Record<string, number> = {
    free: 10,
    basic: 100,
    pro: 1000,
  };

  const limit = planLimits[profile?.plan || "free"];
  const usage = documents?.length || 0;
  const percentUsed = (usage / limit) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents 📄</h1>
          <p className="text-muted-foreground">
            Upload and manage your tax documents for {currentYear}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={percentUsed > 80 ? "destructive" : "secondary"} className="text-sm font-mono">
            {usage} / {limit}
          </Badge>
          {usage > 0 && (
            <Button variant="outline" size="sm" className="animate-lift">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          )}
        </div>
      </div>

      {/* Usage Warning */}
      {percentUsed > 80 && (
        <Alert className="border-warning/30 bg-warning/5">
          <Info className="h-4 w-4 text-warning" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              You're using {usage} of {limit} documents ({Math.round(percentUsed)}%).
              {percentUsed >= 100 ? " You've reached your limit." : " Consider upgrading for more storage."}
            </span>
            {profile?.plan === "free" && (
              <Link href="/dashboard/billing">
                <Button size="sm" variant="outline">
                  Upgrade Plan
                </Button>
              </Link>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Section */}
      <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            <CardTitle>Upload Documents</CardTitle>
          </div>
          <CardDescription>
            Drag and drop W-2s, 1099s, receipts, and other tax documents. We'll automatically extract the important information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadDropzone taxYearId={taxYear?.id} householdId={household?.id} />
        </CardContent>
      </Card>

      {/* Import Options */}
      {profile?.plan !== "free" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="transition-all hover:shadow-md animate-lift">
            <CardHeader>
              <div className="rounded-lg bg-primary/10 w-fit p-3 mb-2">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Import from Gmail</CardTitle>
              <CardDescription>
                Automatically find tax documents in your email. We scan for W-2s, 1099s, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Connect Gmail
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md animate-lift">
            <CardHeader>
              <div className="rounded-lg bg-primary/10 w-fit p-3 mb-2">
                <HardDrive className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Import from Google Drive</CardTitle>
              <CardDescription>
                Scan your Drive folders for tax documents. Set it once and forget it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <HardDrive className="mr-2 h-4 w-4" />
                Connect Drive
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Alert className="border-primary/30 bg-gradient-subtle">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertDescription>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium mb-1">Want automatic imports?</p>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Basic or Pro to automatically import documents from Gmail and Google Drive.
                  No more manual uploads!
                </p>
              </div>
              <Link href="/dashboard/billing">
                <Button size="sm" className="shrink-0 animate-lift">
                  Upgrade
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Documents List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Documents</CardTitle>
            <CardDescription>
              {documents && documents.length > 0
                ? `${documents.length} document${documents.length > 1 ? "s" : ""} organized and ready`
                : "No documents yet - upload your first one above!"}
            </CardDescription>
          </div>
          {documents && documents.length > 0 && (
            <Badge variant="outline" className="text-sm">
              {documents.filter((d) => d.status === "extracted").length} processed
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {documents && documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((doc) => (
                <DocumentRow key={doc.id} document={doc} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Upload className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No documents uploaded yet</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Upload your first document above to get started. It only takes a few seconds!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="border-sage bg-sage/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-sage-foreground" />
            <CardTitle className="text-sage-foreground">Tips for uploading</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-sage-foreground space-y-2">
          <p>• <strong>PDFs work best.</strong> Our AI can read most tax forms automatically.</p>
          <p>• <strong>Photos are fine too.</strong> Just make sure text is clear and readable.</p>
          <p>• <strong>Multiple pages?</strong> Upload as one PDF or separate pages - we'll figure it out.</p>
          <p>• <strong>Not sure what you need?</strong> Check your <Link href="/dashboard/checklist" className="underline font-medium">checklist</Link> for guidance.</p>
        </CardContent>
      </Card>
    </div>
  );
}
