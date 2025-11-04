import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Note: PATCH endpoint temporarily disabled due to Supabase type generation issues
// The checklist status can be updated via the generate API which recreates items
// This will be fixed after initial deployment with proper type generation

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServiceClient();

    const params = await context.params;
    const itemId = params.id;

    // Delete checklist item
    const { error: deleteError } = await supabase
      .from("checklist_items")
      .delete()
      .eq("id", itemId);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete checklist item" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE checklist item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
