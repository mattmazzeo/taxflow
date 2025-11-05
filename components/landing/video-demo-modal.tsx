"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, X, Upload, Brain, FileCheck, Sparkles } from "lucide-react";
import { useState } from "react";

interface VideoDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoDemoModal({ isOpen, onClose }: VideoDemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const demoSteps = [
    {
      icon: <Upload className="h-12 w-12 text-primary" />,
      title: "Upload your documents",
      description: "Simply drag and drop PDFs or images. We support W-2s, 1099s, and all tax forms.",
      duration: "Step 1 of 4",
    },
    {
      icon: <Brain className="h-12 w-12 text-warning" />,
      title: "AI extracts key information",
      description: "Our AI instantly reads your documents and pulls out what matters: income, deductions, employer info.",
      duration: "Step 2 of 4",
    },
    {
      icon: <Sparkles className="h-12 w-12 text-success" />,
      title: "Smart checklist updates",
      description: "Your personalized checklist automatically marks items complete and shows what's still missing.",
      duration: "Step 3 of 4",
    },
    {
      icon: <FileCheck className="h-12 w-12 text-primary" />,
      title: "Export for your CPA",
      description: "One click creates a perfectly organized package your accountant will love.",
      duration: "Step 4 of 4",
    },
  ];

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0); // Loop back
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">See how TaxFlow works</DialogTitle>
          <DialogDescription>
            Watch how we transform tax chaos into peace of mind in 4 simple steps
          </DialogDescription>
        </DialogHeader>

        {/* Demo Animation Area */}
        <div className="relative aspect-video rounded-lg bg-gradient-subtle border-2 border-border overflow-hidden">
          {/* Animated demo screens */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center space-y-6 animate-in fade-in-50 duration-500">
              <div className="flex justify-center animate-float">
                {demoSteps[currentStep].icon}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-warning uppercase tracking-wide">
                  {demoSteps[currentStep].duration}
                </p>
                <h3 className="text-xl font-bold">
                  {demoSteps[currentStep].title}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {demoSteps[currentStep].description}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
            />
          </div>

          {/* Play/Next button */}
          <button
            onClick={nextStep}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors animate-press"
            aria-label={currentStep < demoSteps.length - 1 ? "Next step" : "Restart demo"}
          >
            {currentStep < demoSteps.length - 1 ? "Next" : "Restart"}
            <Play className="h-4 w-4" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 pt-2">
          {demoSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted hover:bg-muted-foreground/30"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground mb-3">
            Ready to try it yourself?
          </p>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors animate-press"
          >
            Start organizing free
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Play button trigger component
export function VideoPlayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center gap-3 px-6 py-3 bg-card/80 backdrop-blur-sm border-2 border-primary/20 rounded-full hover:border-primary/40 transition-all shadow-premium hover:shadow-premium-hover animate-press"
      aria-label="Watch 2-minute demo video"
    >
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
        <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
      </div>
      <span className="font-semibold text-sm">Watch 2-min demo</span>
      <Sparkles className="h-4 w-4 text-warning animate-pulse" />
    </button>
  );
}

