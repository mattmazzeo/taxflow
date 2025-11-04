import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadDropzone } from "@/components/upload-dropzone";
import { DocumentRow } from "@/components/document-row";
import { Upload, Mail, HardDrive } from "lucide-react";

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Upload and manage your tax documents for {currentYear}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {usage} / {limit} documents
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload W-2s, 1099s, receipts, and other tax documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadDropzone taxYearId={taxYear?.id} householdId={household?.id} />
        </CardContent>
      </Card>

      {/* Import Options */}
      {profile?.plan !== "free" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Mail className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Import from Gmail</CardTitle>
              <CardDescription>
                Automatically find tax documents in your email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Connect Gmail
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <HardDrive className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Import from Google Drive</CardTitle>
              <CardDescription>
                Scan your Drive folders for tax documents
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
      )}

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>
            {documents && documents.length > 0
              ? `${documents.length} document${documents.length > 1 ? "s" : ""} uploaded`
              : "No documents yet"}
          </CardDescription>
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
              <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-sm font-medium">No documents uploaded yet</p>
              <p className="text-xs text-muted-foreground">
                Upload your first document to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

