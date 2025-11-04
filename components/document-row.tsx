"use client";

import { useState } from "react";
import { FileText, Eye, Download, Trash2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EntityViewer } from "@/components/entity-viewer";
import { toast } from "sonner";
import { format } from "date-fns";

interface Document {
  id: string;
  filename: string;
  mime_type: string | null;
  parsed: boolean;
  parse_error: string | null;
  source: string;
  created_at: string;
  file_size: number | null;
}

interface DocumentRowProps {
  document: Document;
}

export function DocumentRow({ document }: DocumentRowProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [parsing, setParsing] = useState(false);

  const handleParse = async () => {
    setParsing(true);
    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: document.id }),
      });

      if (!response.ok) throw new Error("Parse failed");

      toast.success("Document parsed successfully!");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to parse document");
    } finally {
      setParsing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      toast.success("Document deleted");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-medium">{document.filename}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{format(new Date(document.created_at), "MMM d, yyyy")}</span>
              {document.file_size && (
                <>
                  <span>•</span>
                  <span>{(document.file_size / 1024).toFixed(0)} KB</span>
                </>
              )}
              <span>•</span>
              <Badge variant="outline" className="capitalize">
                {document.source}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {document.parsed ? (
            <Badge variant="default">Parsed</Badge>
          ) : document.parse_error ? (
            <Badge variant="destructive">Error</Badge>
          ) : (
            <Badge variant="secondary">Not Parsed</Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(true)}
            disabled={!document.parsed}
          >
            <Eye className="h-4 w-4" />
          </Button>

          {!document.parsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleParse}
              disabled={parsing}
            >
              <RefreshCw className={`h-4 w-4 ${parsing ? "animate-spin" : ""}`} />
            </Button>
          )}

          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{document.filename}</DialogTitle>
            <DialogDescription>Extracted information from this document</DialogDescription>
          </DialogHeader>
          <EntityViewer documentId={document.id} />
        </DialogContent>
      </Dialog>
    </>
  );
}

