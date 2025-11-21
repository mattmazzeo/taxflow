"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Stop the paper chase",
    description: "Upload documents, connect Gmail, or forward emails. We find your tax forms automatically.",
    benefit: "Most people are done uploading in under 10 minutes.",
    image: "/step-1-upload.png",
    alt: "TaxFlow automatically organizing uploaded documents and emails",
  },
  {
    number: "02",
    title: "Know exactly what you need",
    description: "Based on last year, we create your personal checklist. No guessing what's missing.",
    benefit: "AI that learns your specific tax situation.",
    image: "/step-2-checklist.png",
    alt: "Smart checklist showing completed tax items",
  },
  {
    number: "03",
    title: "Stay on track without the stress",
    description: "Gentle weekly reminders. We nudge, we don't nag.",
    benefit: "92% of users feel more confident about tax season.",
    image: "/step-3-calendar.png",
    alt: "Gentle calendar reminders for tax deadlines",
  },
  {
    number: "04",
    title: "Hand it off with confidence",
    description: "Export everything your CPA needs in one click. Organized, complete, ready.",
    benefit: "CPAs love us. You'll love their reaction.",
    image: "/step-4-handoff.png",
    alt: "Organized tax package ready for CPA handoff",
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
          <div className="flex-1 w-full">
            <Card className="overflow-hidden border-none shadow-soft hover:shadow-premium transition-all duration-500 bg-transparent">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                <Image 
                  src={step.image} 
                  alt={step.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </Card>
          </div>
          <div className="flex-1 space-y-4">
            <div className="text-6xl font-bold text-primary/10">{step.number}</div>
            <h3 className="text-3xl font-bold">{step.title}</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
            <div className="rounded-lg bg-sage/30 p-4 inline-block">
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
