"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Entity {
  id: string;
  entity_type: string;
  key: string;
  value: string | null;
  confidence: number | null;
}

interface EntityViewerProps {
  documentId: string;
}

export function EntityViewer({ documentId }: EntityViewerProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntities() {
      try {
        const response = await fetch(`/api/documents/${documentId}/entities`);
        if (response.ok) {
          const data = await response.json();
          setEntities(data.entities || []);
        }
      } catch (error) {
        console.error("Failed to fetch entities:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEntities();
  }, [documentId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        ))}
      </div>
    );
  }

  if (entities.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No entities extracted yet. Try re-parsing the document.
      </div>
    );
  }

  // Group entities by type
  const groupedEntities = entities.reduce(
    (acc, entity) => {
      if (!acc[entity.entity_type]) {
        acc[entity.entity_type] = [];
      }
      acc[entity.entity_type].push(entity);
      return acc;
    },
    {} as Record<string, Entity[]>
  );

  return (
    <div className="space-y-6">
      {Object.entries(groupedEntities).map(([type, typeEntities]) => (
        <div key={type} className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{type}</Badge>
            <span className="text-xs text-muted-foreground">
              {typeEntities.length} field{typeEntities.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-2">
            {typeEntities.map((entity) => (
              <div
                key={entity.id}
                className="flex items-start justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium capitalize">
                    {entity.key.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-muted-foreground">{entity.value || "—"}</p>
                </div>
                {entity.confidence && (
                  <Badge variant="secondary" className="text-xs">
                    {entity.confidence.toFixed(0)}%
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

