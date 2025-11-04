"use client";

import { Card, CardContent } from "@/components/ui/card";
import { OrganizedDocsIllustration } from "@/components/illustrations/organized-docs";
import { ChecklistCompleteIllustration } from "@/components/illustrations/checklist-complete";
import { UploadZoneIllustration } from "@/components/illustrations/upload-zone";
import { FileCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Stop the paper chase",
    description: "Upload documents, connect Gmail, or forward emails. We find your tax forms automatically.",
    benefit: "Most people are done uploading in under 10 minutes.",
    illustration: <UploadZoneIllustration className="h-48 w-full" />,
  },
  {
    number: "02",
    title: "Know exactly what you need",
    description: "Based on last year, we create your personal checklist. No guessing what's missing.",
    benefit: "AI that learns your specific tax situation.",
    illustration: <ChecklistCompleteIllustration className="h-48 w-full" />,
  },
  {
    number: "03",
    title: "Stay on track without the stress",
    description: "Gentle weekly reminders. We nudge, we don't nag.",
    benefit: "92% of users feel more confident about tax season.",
    illustration: <OrganizedDocsIllustration className="h-48 w-full" />,
  },
  {
    number: "04",
    title: "Hand it off with confidence",
    description: "Export everything your CPA needs in one click. Organized, complete, ready.",
    benefit: "CPAs love us. You'll love their reaction.",
    illustration: (
      <div className="flex h-48 w-full items-center justify-center">
        <FileCheck className="h-32 w-32 text-success" strokeWidth={1.5} />
      </div>
    ),
  },
];

export function HowItWorks({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-16 ${className}`}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex flex-col items-center gap-8 lg:flex-row ${
            index % 2 === 1 ? "lg:flex-row-reverse" : ""
          }`}
        >
          <div className="flex-1">
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                {step.illustration}
              </CardContent>
            </Card>
          </div>
          <div className="flex-1 space-y-4">
            <div className="text-6xl font-bold text-primary/10">{step.number}</div>
            <h3 className="text-3xl font-bold">{step.title}</h3>
            <p className="text-lg text-muted-foreground">{step.description}</p>
            <div className="rounded-lg bg-sage/30 p-4">
              <p className="text-sm font-medium text-sage-foreground">
                ✨ {step.benefit}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

