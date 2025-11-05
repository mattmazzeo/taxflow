import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { searchGmailForTaxDocs } from "@/lib/mcp";
import { z } from "zod";

const RequestSchema = z.object({
  taxYearId: z.string().uuid(),
  year: z.number().optional(),
  query: z.string().optional(),
});

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

    // Check plan (Gmail ingest requires Basic or Pro)
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    if (profile?.plan === "free") {
      return NextResponse.json(
        { error: "Gmail ingest requires Basic or Pro plan" },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await request.json();
    const { taxYearId, year, query } = RequestSchema.parse(body);

    // Search Gmail for tax documents (using real Gmail API)
    const messages = await searchGmailForTaxDocs(query, year);

    return NextResponse.json({
      success: true,
      messages,
      count: messages.length,
    });
  } catch (error) {
    console.error("Gmail ingest error:", error);

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

