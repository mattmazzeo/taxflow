import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChecklistItem } from "@/components/checklist-item";
import { CheckSquare, Plus } from "lucide-react";

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
    { key: "income", label: "Income Documents", description: "W-2s, 1099s, and other income forms" },
    { key: "deductions", label: "Deductions", description: "Charitable donations, mortgage interest, etc." },
    { key: "credits", label: "Tax Credits", description: "Education, child care, energy credits" },
    { key: "other", label: "Other Items", description: "Additional forms and documents" },
  ];

  const totalItems = checklistItems?.length || 0;
  const completedItems = checklistItems?.filter((item) => item.status === "done").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checklist</h1>
          <p className="text-muted-foreground">
            Track your tax document collection for {currentYear}
          </p>
        </div>
        <div className="text-sm font-medium">
          {completedItems} / {totalItems} completed
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>
                {totalItems > 0
                  ? `You've completed ${Math.round((completedItems / totalItems) * 100)}% of your checklist`
                  : "Generate a checklist by uploading last year's documents"}
              </CardDescription>
            </div>
            {totalItems > 0 && (
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Item
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Checklist by Category */}
      {totalItems > 0 ? (
        <div className="space-y-6">
          {categories.map((category) => {
            const items = groupedItems?.[category.key];
            if (!items || items.length === 0) return null;

            return (
              <Card key={category.key}>
                <CardHeader>
                  <CardTitle>{category.label}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
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
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CheckSquare className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium">No checklist items yet</p>
            <p className="mb-4 text-xs text-muted-foreground">
              Upload documents from last year to generate a personalized checklist
            </p>
            <Button onClick={() => (window.location.href = "/dashboard/documents")}>
              Go to Documents
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

