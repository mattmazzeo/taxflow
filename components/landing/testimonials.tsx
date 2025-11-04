"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "I used to dread tax season. Now? I actually feel confident knowing everything is organized and ready. TaxFlow took away all the stress.",
    author: "Sarah M.",
    role: "Small Business Owner",
    rating: 5,
  },
  {
    quote: "As a CPA, I love when clients use TaxFlow. Everything is organized, complete, and ready to go. Saves me hours and my clients money.",
    author: "Michael R., CPA",
    role: "Tax Professional",
    rating: 5,
  },
  {
    quote: "The peace of mind is worth every penny. No more wondering if I'm missing something. The checklist tells me exactly what I need.",
    author: "Jennifer K.",
    role: "Working Parent",
    rating: 5,
  },
];

export function Testimonials({ className = "" }: { className?: string }) {
  return (
    <div className={`grid gap-6 md:grid-cols-3 ${className}`}>
      {testimonials.map((testimonial, index) => (
        <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="mb-3 flex gap-1">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <blockquote className="mb-4 text-sm leading-relaxed text-foreground">
              "{testimonial.quote}"
            </blockquote>
            <div className="border-t pt-4">
              <p className="font-semibold text-sm">{testimonial.author}</p>
              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

