import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listDriveFiles } from "@/lib/mcp";
import { z } from "zod";

const RequestSchema = z.object({
  taxYearId: z.string().uuid(),
  folderId: z.string().optional(),
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

    // Check plan (Drive ingest requires Basic or Pro)
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    if (profile?.plan === "free") {
      return NextResponse.json(
        { error: "Google Drive ingest requires Basic or Pro plan" },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await request.json();
    const { taxYearId, folderId, query } = RequestSchema.parse(body);

    // List Drive files (using stub)
    const files = await listDriveFiles(folderId, query);

    return NextResponse.json({
      success: true,
      files,
      isStub: true,
      note: "This is using mock data. Connect real Google Drive OAuth to see actual files.",
    });
  } catch (error) {
    console.error("Drive ingest error:", error);

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

