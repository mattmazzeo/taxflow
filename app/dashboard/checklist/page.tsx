import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChecklistItem } from "@/components/checklist-item";
import { ProgressRing } from "@/components/progress-ring";
import { CheckSquare, Plus, Info, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function ChecklistPage() {
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

  // Get checklist items
  const { data: checklistItems } = await supabase
    .from("checklist_items")
    .select("*")
    .eq("tax_year_id", taxYear?.id)
    .order("created_at", { ascending: true });

  // Group by category
  const groupedItems = checklistItems?.reduce(
    (acc, item) => {
      const category = item.category || "other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, typeof checklistItems>
  );

  const categories = [
    { 
      key: "income", 
      label: "Income Documents", 
      description: "W-2s, 1099s, and other income forms",
      icon: "💼"
    },
    { 
      key: "deductions", 
      label: "Deductions", 
      description: "Charitable donations, mortgage interest, etc.",
      icon: "🏠"
    },
    { 
      key: "credits", 
      label: "Tax Credits", 
      description: "Education, child care, energy credits",
      icon: "🎓"
    },
    { 
      key: "other", 
      label: "Other Items", 
      description: "Additional forms and documents",
      icon: "📋"
    },
  ];

  const totalItems = checklistItems?.length || 0;
  const completedItems = checklistItems?.filter((item) => item.status === "done").length || 0;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checklist ✓</h1>
          <p className="text-muted-foreground">
            Track your tax document collection for {currentYear}
          </p>
        </div>
        {totalItems > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold font-mono">{progress}%</div>
              <div className="text-xs text-muted-foreground">{completedItems} of {totalItems}</div>
            </div>
            <ProgressRing progress={progress} size={60} />
          </div>
        )}
      </div>

      {/* Summary Card */}
      {totalItems > 0 ? (
        <Card className={progress === 100 ? "border-success/30 bg-success/5" : "border-primary/20 bg-gradient-subtle"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {progress === 100 ? (
                    <>
                      <span className="text-2xl">🎉</span>
                      <CardTitle className="text-success">All Done!</CardTitle>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 text-primary" />
                      <CardTitle>Your Progress</CardTitle>
                    </>
                  )}
                </div>
                <CardDescription>
                  {progress === 100
                    ? "Amazing! You've completed everything on your checklist. Time to relax!"
                    : `You're ${progress}% of the way there! ${totalItems - completedItems} item${totalItems - completedItems === 1 ? '' : 's'} to go.`}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="animate-lift">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </CardHeader>
        </Card>
      ) : null}

      {/* Checklist by Category */}
      {totalItems > 0 ? (
        <div className="space-y-6">
          {categories.map((category) => {
            const items = groupedItems?.[category.key];
            if (!items || items.length === 0) return null;

            const categoryCompleted = items.filter((i) => i.status === "done").length;
            const categoryTotal = items.length;
            const categoryProgress = Math.round((categoryCompleted / categoryTotal) * 100);

            return (
              <Card key={category.key} className="animate-lift">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{category.icon}</div>
                      <div>
                        <CardTitle>{category.label}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={categoryProgress === 100 ? "default" : "secondary"} className="font-mono">
                        {categoryCompleted}/{categoryTotal}
                      </Badge>
                      {categoryProgress === 100 && (
                        <Badge className="bg-success text-success-foreground">
                          Complete ✓
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <ChecklistItem key={item.id} item={item} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-3">Get Your Personalized Checklist</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mb-2">
              <strong className="text-foreground">Here's how it works:</strong> Upload last year's tax return (your {currentYear - 1} return), 
              and we'll instantly generate a personalized checklist of every document and piece of information you'll need for {currentYear}.
            </p>
            <p className="text-muted-foreground max-w-xl mb-8">
              No more guessing what you need. We analyze what you filed last year and tell you exactly what to collect this year.
            </p>
            <div className="bg-muted/50 rounded-lg p-6 mb-8 max-w-lg">
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                    <span className="text-lg">📄</span>
                  </div>
                  <div>
                    <p className="font-medium">Upload your {currentYear - 1} tax return</p>
                    <p className="text-sm text-muted-foreground">PDF of your last filed return</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div>
                    <p className="font-medium">We analyze it with AI</p>
                    <p className="text-sm text-muted-foreground">Extracts W-2s, 1099s, deductions, etc.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                    <span className="text-lg">✅</span>
                  </div>
                  <div>
                    <p className="font-medium">Get your {currentYear} checklist</p>
                    <p className="text-sm text-muted-foreground">Personalized list of what you need</p>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/dashboard/documents">
              <Button size="lg" className="animate-lift text-base px-8">
                <Upload className="mr-2 h-5 w-5" />
                Upload {currentYear - 1} Tax Return
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-4">
              It only takes 30 seconds • We support PDFs, Gmail, and Google Drive
            </p>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      {totalItems > 0 && (
        <Card className="border-sage bg-sage/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-sage-foreground" />
              <CardTitle className="text-sage-foreground">About Your Personalized Checklist</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-sage-foreground space-y-2">
            <p>• <strong>Based on your {currentYear - 1} return.</strong> We analyzed last year's tax documents to identify every form, employer, bank, and deduction you'll need again for {currentYear}.</p>
            <p>• <strong>Personalized to your situation.</strong> If you had a W-2 from Acme Corp last year, we remind you to get it again. Same with 1099s, mortgage interest statements, and more.</p>
            <p>• <strong>Required vs. optional.</strong> Essential income documents are marked required. Deductions and credits are optional but can save you money.</p>
            <p>• <strong>New this year?</strong> Add custom items if you have new employers, freelance clients, or life changes (marriage, home purchase, etc.)</p>
            <p>• <strong>Weekly reminders.</strong> We'll send gentle nudges about outstanding items so nothing slips through the cracks (Basic/Pro plans).</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
