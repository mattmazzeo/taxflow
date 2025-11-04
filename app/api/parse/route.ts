import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseDocument } from "@/lib/ai";
import { z } from "zod";

const RequestSchema = z.object({
  documentId: z.string().uuid(),
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

    // Validate request body
    const body = await request.json();
    const { documentId } = RequestSchema.parse(body);

    // Get document
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (fetchError || !document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Check if already parsed
    if (document.parsed) {
      return NextResponse.json(
        { error: "Document already parsed" },
        { status: 400 }
      );
    }

    // Download file from storage
    if (!document.storage_path) {
      return NextResponse.json(
        { error: "Document has no storage path" },
        { status: 400 }
      );
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("docs")
      .download(document.storage_path);

    if (downloadError || !fileData) {
      console.error("Download error:", downloadError);
      return NextResponse.json(
        { error: "Failed to download document from storage" },
        { status: 500 }
      );
    }

    // Convert Blob to Buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse document with AI
    let analysis;
    try {
      analysis = await parseDocument(
        buffer,
        document.filename,
        document.mime_type || "application/pdf"
      );
    } catch (parseError) {
      console.error("Parse error:", parseError);
      
      // Update document with error
      await supabase
        .from("documents")
        .update({
          parsed: false,
          parse_error: parseError instanceof Error ? parseError.message : "Unknown error",
        })
        .eq("id", documentId);

      return NextResponse.json(
        { error: "Failed to parse document" },
        { status: 500 }
      );
    }

    // Store extracted entities
    const entities = analysis.fields.map((field) => ({
      document_id: documentId,
      entity_type: analysis.entityType,
      key: field.key,
      value: field.value,
      confidence: field.confidence,
    }));

    const { error: entitiesError } = await supabase
      .from("document_entities")
      .insert(entities);

    if (entitiesError) {
      console.error("Entities insert error:", entitiesError);
      return NextResponse.json(
        { error: "Failed to store extracted entities" },
        { status: 500 }
      );
    }

    // Update document as parsed
    const { error: updateError } = await supabase
      .from("documents")
      .update({
        parsed: true,
        parse_error: null,
      })
      .eq("id", documentId);

    if (updateError) {
      console.error("Update error:", updateError);
    }

    return NextResponse.json({
      success: true,
      analysis,
      entitiesCount: entities.length,
    });
  } catch (error) {
    console.error("Parse API error:", error);
    
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

