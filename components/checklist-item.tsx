"use client";

import { useState } from "react";
import { Check, Circle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChecklistItemData {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  required: boolean;
  category: string | null;
}

interface ChecklistItemProps {
  item: ChecklistItemData;
}

export function ChecklistItem({ item }: ChecklistItemProps) {
  const [status, setStatus] = useState(item.status);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: typeof status) => {
    // Optimistically update UI
    setStatus(newStatus);
    toast.success("Status updated (Note: Backend update temporarily disabled)");
    
    // TODO: Re-enable after Supabase types are regenerated
    // setUpdating(true);
    // try {
    //   const response = await fetch(`/api/checklist/${item.id}`, {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ status: newStatus }),
    //   });
    //   if (!response.ok) throw new Error("Update failed");
    //   toast.success("Status updated");
    // } catch (error) {
    //   toast.error("Failed to update status");
    //   setStatus(status); // Revert on error
    // } finally {
    //   setUpdating(false);
    // }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "done":
        return <Check className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getNextStatus = () => {
    switch (status) {
      case "todo":
        return "in_progress";
      case "in_progress":
        return "done";
      case "done":
        return "todo";
      default:
        return "todo";
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border p-4 transition-colors",
        status === "done" && "bg-muted/50",
        updating && "opacity-50"
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-10 rounded-full p-0"
        onClick={() => handleStatusChange(getNextStatus())}
        disabled={updating}
      >
        {getStatusIcon()}
      </Button>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={cn("font-medium", status === "done" && "line-through text-muted-foreground")}>
            {item.title}
          </p>
          {item.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
      </div>

      <Badge variant="outline" className="capitalize">
        {status.replace("_", " ")}
      </Badge>
    </div>
  );
}

