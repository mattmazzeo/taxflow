"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const caseStudies = [
  {
    name: "Sarah's Story",
    role: "Freelancer with 15 1099s",
    problem: "Spent 8+ hours every tax season hunting through emails and folders for income documents",
    solution: "Connected Gmail to TaxFlow, which automatically found and organized all 15 1099s within minutes",
    outcome: "Saved 8 hours and found 2 missing 1099s she didn't know existed",
    metrics: [
      { label: "Time saved", value: "8 hours" },
      { label: "Documents found", value: "15 1099s" },
      { label: "Hidden forms discovered", value: "2 forms" },
    ],
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
    quote: "I thought I had everything. TaxFlow found two 1099s I completely forgot about. That's income I would have missed reporting!",
  },
  {
    name: "The Martinez Family",
    role: "First-time homebuyers",
    problem: "Overwhelmed with new tax forms (mortgage interest, property tax, PMI) and didn't know what they needed",
    solution: "TaxFlow's smart checklist identified they were homeowners and automatically generated a personalized list",
    outcome: "Found $2,400 in deductions they didn't know qualified, filed 2 weeks early",
    metrics: [
      { label: "Deductions found", value: "$2,400" },
      { label: "Filed early by", value: "2 weeks" },
      { label: "Stress level", value: "Near zero" },
    ],
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300",
    quote: "We went from panicking about our first homeowner taxes to being the first in our friend group to file. TaxFlow made us look like we had it together!",
  },
  {
    name: "CPA Mike's Practice",
    role: "Tax professional",
    problem: "Clients arrived unprepared, with documents scattered across emails, taking 2+ hours just to organize before starting actual work",
    solution: "Started recommending TaxFlow to clients. Now 40% of his clients use it and arrive completely organized",
    outcome: "Saves 90 minutes per TaxFlow client, can serve more clients, clients save on billable hours",
    metrics: [
      { label: "Time saved per client", value: "90 min" },
      { label: "Client satisfaction", value: "+45%" },
      { label: "Can serve more clients", value: "8 more/year" },
    ],
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
    quote: "I recommend TaxFlow to every client now. It's not just about saving me time—their organized documents mean they save on my billable hours too. Everyone wins.",
  },
];

export function CaseStudies({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-12 ${className}`}>
      {caseStudies.map((study, index) => (
        <Card 
          key={index}
          className="overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500 animate-lift"
        >
          <div className="grid md:grid-cols-5 gap-0">
            {/* Image side */}
            <div className="relative md:col-span-2 h-64 md:h-auto">
              <Image
                src={study.image}
                alt={`${study.name} case study`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background/95 via-background/50 to-transparent" />
              
              {/* Name overlay on image */}
              <div className="absolute bottom-6 left-6 md:hidden">
                <h3 className="text-2xl font-bold mb-1">{study.name}</h3>
                <p className="text-sm text-muted-foreground">{study.role}</p>
              </div>
            </div>

            {/* Content side */}
            <CardContent className="md:col-span-3 p-6 lg:p-8 space-y-6">
              {/* Header (desktop) */}
              <div className="hidden md:block">
                <h3 className="text-2xl lg:text-3xl font-bold mb-2">{study.name}</h3>
                <p className="text-muted-foreground">{study.role}</p>
              </div>

              {/* Problem → Solution → Outcome */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-destructive/70 uppercase tracking-wide mb-1">
                    The Problem
                  </p>
                  <p className="text-sm text-muted-foreground">{study.problem}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                    The Solution
                  </p>
                  <p className="text-sm text-foreground">{study.solution}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-success uppercase tracking-wide mb-1">
                    The Outcome
                  </p>
                  <p className="text-sm font-medium text-foreground">{study.outcome}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y">
                {study.metrics.map((metric, i) => (
                  <div key={i} className="text-center">
                    <div className="text-lg lg:text-2xl font-bold text-primary">
                      {metric.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="relative border-l-4 border-primary pl-4 py-2 italic text-sm text-muted-foreground">
                "{study.quote}"
              </blockquote>

              {/* CTA - commented out as we don't have individual story pages yet
              <Button variant="outline" className="group">
                Read full story
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              */}
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}

