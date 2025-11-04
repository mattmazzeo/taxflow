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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <CheckSquare className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No checklist items yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Upload documents from last year and we'll create a personalized checklist 
              based on your tax situation. It only takes a minute!
            </p>
            <Link href="/dashboard/documents">
              <Button size="lg" className="animate-lift">
                Upload Documents
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      {totalItems > 0 && (
        <Card className="border-sage bg-sage/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-sage-foreground" />
              <CardTitle className="text-sage-foreground">Understanding your checklist</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-sage-foreground space-y-2">
            <p>• <strong>Generated from your history.</strong> This checklist is based on documents you've had in the past.</p>
            <p>• <strong>Required items</strong> are marked as essential for your tax filing.</p>
            <p>• <strong>Add custom items</strong> if you have new income sources or deductions this year.</p>
            <p>• <strong>We'll remind you.</strong> Get gentle weekly nudges about what's still missing (if you're on Basic or Pro).</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
