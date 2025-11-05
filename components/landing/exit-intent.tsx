"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ExitIntentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExitIntentModal({ isOpen, onClose }: ExitIntentProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Checklist sent! 📋", {
      description: "Check your email for your free tax document checklist.",
    });
    
    setEmail("");
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-warning/10">
              <Gift className="h-6 w-6 text-warning" />
            </div>
          </div>
          <DialogTitle className="text-2xl">Wait! Don't leave empty-handed.</DialogTitle>
          <DialogDescription className="text-base">
            Get our free tax document checklist before you go. Used by 2,500+ families to stay organized.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="exit-email">Email address</Label>
            <Input
              id="exit-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button type="submit" size="lg" disabled={loading} className="w-full animate-press">
              {loading ? "Sending..." : "Send me the free checklist"}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose} className="w-full">
              No thanks, I'll figure it out myself
            </Button>
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <div className="flex gap-3 flex-wrap justify-center w-full">
              <span>✓ Instant download</span>
              <span>✓ No spam</span>
              <span>✓ Unsubscribe anytime</span>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Hook to detect exit intent
export function useExitIntent(onExitIntent: () => void) {
  useEffect(() => {
    let hasTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (hasTriggered) return;
      
      // Trigger when mouse moves to top of viewport (likely closing tab/browser)
      if (e.clientY <= 0) {
        hasTriggered = true;
        onExitIntent();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [onExitIntent]);
}

