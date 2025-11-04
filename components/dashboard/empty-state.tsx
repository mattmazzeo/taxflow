"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadZoneIllustration } from "@/components/illustrations/upload-zone";
import Link from "next/link";
import { Upload } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title = "Let's get started!",
  description = "Upload a few documents from last year and we'll build your personalized checklist in seconds.",
  actionLabel = "Upload Documents",
  actionHref = "/dashboard/documents",
}: EmptyStateProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <UploadZoneIllustration className="h-48 w-48" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Link href={actionHref}>
          <Button size="lg" className="animate-lift">
            <Upload className="mr-2 h-5 w-5" />
            {actionLabel}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

