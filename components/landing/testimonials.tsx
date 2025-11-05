"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Linkedin } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const testimonials = [
  {
    quote: "I used to spend entire weekends hunting for tax documents. TaxFlow found everything in my Gmail automatically and organized it perfectly. Saved me at least 6 hours this year.",
    author: "Sarah Martinez",
    role: "Small Business Owner",
    outcome: "Saved 6 hours",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces",
    linkedin: true,
  },
  {
    quote: "As a CPA, I love when clients use TaxFlow. Everything is labeled, sorted by year, and complete. What used to take 2 hours of back-and-forth now takes 15 minutes. My clients save money and I save my sanity.",
    author: "Michael Roberts, CPA",
    role: "Tax Professional at Roberts & Associates",
    outcome: "Saves 2 hours per client",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces",
    linkedin: true,
  },
  {
    quote: "The peace of mind is worth every penny. The smart checklist told me I was missing a 1098 form I didn't even know existed. That deduction saved me $800. TaxFlow paid for itself 80 times over.",
    author: "Jennifer Kim",
    role: "Working Parent & First-Time Homebuyer",
    outcome: "Found $800 in deductions",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces",
    linkedin: false,
  },
  {
    quote: "I'm a freelancer with 15 different 1099s. Used to be a nightmare keeping track. TaxFlow's AI pulled everything from my Gmail and labeled it correctly. My accountant was actually impressed.",
    author: "David Chen",
    role: "Freelance Designer",
    outcome: "Organized 15 1099s effortlessly",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces",
    linkedin: true,
  },
  {
    quote: "We have rental properties, investments, and two kids. Tax season used to mean stress and fights. TaxFlow's checklist kept us on track all year. We actually filed early this year for the first time ever!",
    author: "Amanda & James Wilson",
    role: "Parents & Real Estate Investors",
    outcome: "Filed 2 weeks early",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces",
    linkedin: false,
  },
  {
    quote: "I thought I'd just use a Google Drive folder. Then I saw TaxFlow's AI extraction - it pulls out income amounts, employer info, everything. Literally saved me from manually typing numbers from 20+ documents.",
    author: "Marcus Thompson",
    role: "Software Engineer",
    outcome: "Eliminated manual data entry",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
    linkedin: true,
  },
];

export function Testimonials({ className = "" }: { className?: string }) {
  const [showAll, setShowAll] = useState(false);
  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 3);

  return (
    <div className={`space-y-8 ${className}`}>
      <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3`}>
        {displayedTestimonials.map((testimonial, index) => (
          <Card 
            key={index} 
            className="border-2 hover:shadow-premium transition-all duration-300 animate-lift"
          >
            <CardContent className="p-6 space-y-4">
              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-sm leading-relaxed text-foreground">
                "{testimonial.quote}"
              </blockquote>

              {/* Outcome Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20">
                <span className="text-xs font-semibold text-success">✓ {testimonial.outcome}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t">
                <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-border">
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.author} photo`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm truncate">{testimonial.author}</p>
                    {testimonial.linkedin && (
                      <Linkedin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* See More/Less Button */}
      {testimonials.length > 3 && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="animate-press"
          >
            {showAll ? "Show less testimonials" : `See all ${testimonials.length} testimonials`}
          </Button>
        </div>
      )}
    </div>
  );
}
