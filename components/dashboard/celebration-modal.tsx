"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CelebrationModal({ isOpen, onClose }: CelebrationModalProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {isOpen && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-success/10 p-6">
              <PartyPopper className="h-12 w-12 text-success" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">🎉 You're All Set!</DialogTitle>
          <DialogDescription className="text-center text-base">
            Congratulations! You've completed your tax document checklist. 
            Everything is organized and ready to go. Time to take a deep breath and relax!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button onClick={onClose} className="w-full">
            Awesome, thanks!
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            You can export everything for your CPA from the Documents page
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

