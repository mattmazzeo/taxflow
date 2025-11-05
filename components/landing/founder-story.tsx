"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Heart } from "lucide-react";

export function FounderStory({ className = "" }: { className?: string }) {
  return (
    <Card className={`shadow-premium overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="grid md:grid-cols-5 gap-0">
          {/* Image side */}
          <div className="relative md:col-span-2 h-80 md:h-auto">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=faces"
              alt="Alex Mazzeo, TaxFlow Founder"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background/95 via-background/40 to-transparent" />
          </div>

          {/* Story side */}
          <div className="md:col-span-3 p-8 lg:p-12 space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <Heart className="h-6 w-6" fill="currentColor" />
              <span className="text-sm font-semibold uppercase tracking-wide">Why I Built TaxFlow</span>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">I'll be honest—I used to dread tax season.</strong> Not because of the taxes themselves, but because of the chaos. Every January, I'd spend an entire weekend hunting through emails, downloading PDFs, and hoping I didn't miss anything important.
              </p>

              <p>
                One year, I spent 8 hours organizing documents. Then my CPA told me I was missing two 1099s. I had to start over. That's when I realized: <em>why doesn't software exist that just does this for me?</em>
              </p>

              <p>
                I built TaxFlow for my family first. My wife and I have a small business, rental properties, and two kids. We needed something that could automatically find our tax documents, tell us what was missing, and export everything our CPA needed—without spending our weekends on it.
              </p>

              <p>
                We saved 8 hours our first year using it. Then I showed it to friends. CPAs started reaching out, asking if their clients could use it. Now 2,500+ families use TaxFlow, and I get emails every tax season from people saying <strong className="text-foreground">"this saved my sanity."</strong>
              </p>

              <p>
                That's what TaxFlow is about: giving you your time back and your peace of mind. Tax season doesn't have to feel like tax season.
              </p>
            </div>

            <div className="pt-6 border-t">
              <p className="font-semibold text-foreground">— Alex Mazzeo</p>
              <p className="text-sm text-muted-foreground">Founder, TaxFlow</p>
              <p className="text-xs text-muted-foreground mt-1 italic">
                Dad, former tax procrastinator, now slightly less stressed
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

