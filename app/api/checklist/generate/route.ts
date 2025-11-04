import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const RequestSchema = z.object({
  taxYearId: z.string().uuid(),
});

interface EntityGroup {
  type: string;
  entities: Array<{ key: string; value: string | null }>;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request body
    const body = await request.json();
    const { taxYearId } = RequestSchema.parse(body);

    // Get tax year info
    const { data: taxYear, error: taxYearError } = await supabase
      .from("tax_years")
      .select("*, household:households(*)")
      .eq("id", taxYearId)
      .single();

    if (taxYearError || !taxYear) {
      return NextResponse.json({ error: "Tax year not found" }, { status: 404 });
    }

    // Type assertion for Supabase data
    const year = (taxYear as any).year as number;
    const householdId = (taxYear as any).household_id as string;

    // Delete existing checklist items for this tax year
    await supabase
      .from("checklist_items")
      .delete()
      .eq("tax_year_id", taxYearId);

    // Get all documents for previous year to analyze
    const previousYear = year - 1;
    const { data: previousTaxYear } = await supabase
      .from("tax_years")
      .select("id")
      .eq("household_id", householdId)
      .eq("year", previousYear)
      .single();

    if (!previousTaxYear) {
      // No previous year data, generate standard checklist
      const standardItems = generateStandardChecklist(year);
      
      const { error: insertError } = await supabase
        .from("checklist_items")
        .insert(
          standardItems.map((item) => ({
            ...item,
            tax_year_id: taxYearId,
          }))
        );

      if (insertError) {
        console.error("Insert error:", insertError);
        return NextResponse.json(
          { error: "Failed to create checklist items" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        itemsCreated: standardItems.length,
        message: "Generated standard checklist",
      });
    }

    // Get documents from previous year
    const { data: previousDocs } = await supabase
      .from("documents")
      .select("id, parsed")
      .eq("tax_year_id", previousTaxYear.id)
      .eq("parsed", true);

    if (!previousDocs || previousDocs.length === 0) {
      // No parsed documents from previous year, use standard checklist
      const standardItems = generateStandardChecklist(taxYear.year);
      
      const { error: insertError } = await supabase
        .from("checklist_items")
        .insert(
          standardItems.map((item) => ({
            ...item,
            tax_year_id: taxYearId,
          }))
        );

      if (insertError) {
        console.error("Insert error:", insertError);
      }

      return NextResponse.json({
        success: true,
        itemsCreated: standardItems.length,
        message: "Generated standard checklist (no previous data)",
      });
    }

    // Get all entities from previous year documents
    const { data: entities } = await supabase
      .from("document_entities")
      .select("*")
      .in(
        "document_id",
        previousDocs.map((d) => d.id)
      );

    if (!entities || entities.length === 0) {
      const standardItems = generateStandardChecklist(taxYear.year);
      
      const { error: insertError } = await supabase
        .from("checklist_items")
        .insert(
          standardItems.map((item) => ({
            ...item,
            tax_year_id: taxYearId,
          }))
        );

      if (insertError) {
        console.error("Insert error:", insertError);
      }

      return NextResponse.json({
        success: true,
        itemsCreated: standardItems.length,
        message: "Generated standard checklist (no entities found)",
      });
    }

    // Group entities by type
    const groupedEntities = groupEntitiesByType(entities);

    // Generate personalized checklist items
    const checklistItems = generatePersonalizedChecklist(
      groupedEntities,
      year
    );

    // Insert checklist items
    const { error: insertError } = await supabase
      .from("checklist_items")
      .insert(
        checklistItems.map((item) => ({
          ...item,
          tax_year_id: taxYearId,
        }))
      );

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create checklist items" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      itemsCreated: checklistItems.length,
      message: "Generated personalized checklist",
    });
  } catch (error) {
    console.error("Generate checklist error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function groupEntitiesByType(entities: any[]): EntityGroup[] {
  const grouped = entities.reduce(
    (acc, entity) => {
      if (!acc[entity.entity_type]) {
        acc[entity.entity_type] = [];
      }
      acc[entity.entity_type].push({
        key: entity.key,
        value: entity.value,
      });
      return acc;
    },
    {} as Record<string, Array<{ key: string; value: string | null }>>
  );

  return Object.entries(grouped).map(([type, entities]) => ({
    type,
    entities,
  }));
}

function generatePersonalizedChecklist(
  groupedEntities: EntityGroup[],
  currentYear: number
) {
  const items: Array<{
    title: string;
    description: string | null;
    status: "todo" | "in_progress" | "done";
    required: boolean;
    category: string;
  }> = [];

  groupedEntities.forEach((group) => {
    switch (group.type) {
      case "W2": {
        // Extract employer names
        const employers = group.entities
          .filter((e) => e.key === "employer_name" && e.value)
          .map((e) => e.value);

        const uniqueEmployers = [...new Set(employers)];
        uniqueEmployers.forEach((employer) => {
          items.push({
            title: `Request W-2 from ${employer}`,
            description: `Contact HR or payroll to receive your W-2 form by January 31st`,
            status: "todo",
            required: true,
            category: "income",
          });
        });
        break;
      }

      case "1099-NEC":
      case "1099-MISC": {
        const payers = group.entities
          .filter((e) => e.key === "payer_name" && e.value)
          .map((e) => e.value);

        const uniquePayers = [...new Set(payers)];
        uniquePayers.forEach((payer) => {
          items.push({
            title: `Collect 1099 from ${payer}`,
            description: `Download from platform dashboard or wait for mailed copy by January 31st`,
            status: "todo",
            required: true,
            category: "income",
          });
        });
        break;
      }

      case "1099-INT": {
        const payers = group.entities
          .filter((e) => e.key === "payer_name" && e.value)
          .map((e) => e.value);

        const uniquePayers = [...new Set(payers)];
        uniquePayers.forEach((payer) => {
          items.push({
            title: `Obtain 1099-INT from ${payer}`,
            description: `Interest income statement for ${currentYear}`,
            status: "todo",
            required: true,
            category: "income",
          });
        });
        break;
      }

      case "1099-DIV": {
        const payers = group.entities
          .filter((e) => e.key === "payer_name" && e.value)
          .map((e) => e.value);

        const uniquePayers = [...new Set(payers)];
        uniquePayers.forEach((payer) => {
          items.push({
            title: `Obtain 1099-DIV from ${payer}`,
            description: `Dividend and distributions statement for ${currentYear}`,
            status: "todo",
            required: true,
            category: "income",
          });
        });
        break;
      }

      case "1098": {
        const lenders = group.entities
          .filter((e) => e.key === "lender_name" && e.value)
          .map((e) => e.value);

        const uniqueLenders = [...new Set(lenders)];
        uniqueLenders.forEach((lender) => {
          items.push({
            title: `Obtain 1098 from ${lender}`,
            description: `Mortgage interest statement - typically mailed by January 31st`,
            status: "todo",
            required: false,
            category: "deductions",
          });
        });
        break;
      }

      case "K1": {
        const entities = group.entities
          .filter((e) => e.key === "entity_name" && e.value)
          .map((e) => e.value);

        const uniqueEntities = [...new Set(entities)];
        uniqueEntities.forEach((entity) => {
          items.push({
            title: `Request K-1 from ${entity}`,
            description: `Partnership or S-Corp K-1 - may arrive as late as March`,
            status: "todo",
            required: true,
            category: "income",
          });
        });
        break;
      }

      case "RECEIPT": {
        items.push({
          title: "Gather business expense receipts",
          description: `Collect all receipts for business expenses incurred in ${currentYear}`,
          status: "todo",
          required: false,
          category: "deductions",
        });
        break;
      }
    }
  });

  // Add standard items that everyone should have
  items.push(...generateStandardChecklist(currentYear));

  // Dedupe by title
  const uniqueItems = items.reduce(
    (acc, item) => {
      if (!acc.find((i) => i.title === item.title)) {
        acc.push(item);
      }
      return acc;
    },
    [] as typeof items
  );

  return uniqueItems;
}

function generateStandardChecklist(currentYear: number) {
  return [
    {
      title: "Charitable donation receipts",
      description: `Collect all receipts from charitable contributions made during ${currentYear}`,
      status: "todo" as const,
      required: false,
      category: "deductions",
    },
    {
      title: "HSA contribution statements",
      description: `Request from your HSA provider if you made contributions in ${currentYear}`,
      status: "todo" as const,
      required: false,
      category: "deductions",
    },
    {
      title: "Childcare provider information",
      description: "Name, address, and EIN/SSN of childcare providers if claiming credit",
      status: "todo" as const,
      required: false,
      category: "credits",
    },
    {
      title: "Student loan interest statement (1098-E)",
      description: "Lenders typically mail these by January 31st",
      status: "todo" as const,
      required: false,
      category: "deductions",
    },
    {
      title: "Estimated tax payment records",
      description: `Gather receipts for any quarterly estimated tax payments made in ${currentYear}`,
      status: "todo" as const,
      required: false,
      category: "other",
    },
    {
      title: "Health insurance forms (1095-A, B, or C)",
      description: "Proof of health insurance coverage for the year",
      status: "todo" as const,
      required: false,
      category: "other",
    },
  ];
}

