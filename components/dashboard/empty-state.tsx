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
  title = "Upload Last Year's Return, Get This Year's Checklist",
  description = "Upload your 2024 tax return (PDF, Gmail, or Drive) and we'll analyze it with AI to create a personalized checklist of every document you'll need to gather for 2025. It takes 30 seconds.",
  actionLabel = "Upload 2024 Tax Return",
  actionHref = "/dashboard/documents",
}: EmptyStateProps) {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <UploadZoneIllustration className="h-48 w-48" />
        </div>
        <CardTitle className="text-3xl">{title}</CardTitle>
        <CardDescription className="text-base max-w-2xl mx-auto mt-3">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Link href={actionHref}>
          <Button size="lg" className="animate-lift text-base px-8">
            <Upload className="mr-2 h-5 w-5" />
            {actionLabel}
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground">
          No more guessing what you need • Just upload last year, we'll tell you exactly what to collect this year
        </p>
      </CardContent>
    </Card>
  );
}

