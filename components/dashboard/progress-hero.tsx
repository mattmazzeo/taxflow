"use client";

import { motion } from "framer-motion";
import { ProgressRing } from "@/components/progress-ring";
import { Sparkles, PartyPopper } from "lucide-react";

interface ProgressHeroProps {
  name?: string;
  progress: number;
  completedItems: number;
  totalItems: number;
  year: number;
}

export function ProgressHero({ name, progress, completedItems, totalItems, year }: ProgressHeroProps) {
  const getEncouragement = () => {
    if (progress === 100) {
      return {
        emoji: "🎉",
        title: `You did it${name ? `, ${name}` : ""}!`,
        message: "Time to relax. Everything's ready for tax season!",
        color: "text-success",
      };
    } else if (progress >= 75) {
      return {
        emoji: "🚀",
        title: `Almost there${name ? `, ${name}` : ""}!`,
        message: "You're crushing it! Just a few more items to go.",
        color: "text-success",
      };
    } else if (progress >= 50) {
      return {
        emoji: "💪",
        title: `Great progress${name ? `, ${name}` : ""}!`,
        message: "You're over the hump! Keep going, you've got this.",
        color: "text-primary",
      };
    } else if (progress >= 25) {
      return {
        emoji: "✨",
        title: `Nice work${name ? `, ${name}` : ""}!`,
        message: "Great start! You're already ahead of most people.",
        color: "text-primary",
      };
    } else {
      return {
        emoji: "👋",
        title: `Hey${name ? ` ${name}` : ""}! Let's get started`,
        message: "No stress - let's knock out a few items this week.",
        color: "text-primary",
      };
    }
  };

  const encouragement = getEncouragement();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-subtle border-2 border-primary/10 p-8"
    >
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-10">
        {progress === 100 ? (
          <PartyPopper className="h-24 w-24 text-success" />
        ) : (
          <Sparkles className="h-24 w-24 text-primary" />
        )}
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        {/* Progress Ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ProgressRing progress={progress} size={160} />
        </motion.div>

        {/* Content */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-4xl">{encouragement.emoji}</span>
              <h2 className={`text-3xl font-bold ${encouragement.color}`}>
                {encouragement.title}
              </h2>
            </div>
            <p className="text-lg text-muted-foreground mb-4">
              {encouragement.message}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center md:justify-start text-sm"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-background/60 rounded-full border">
              <span className="font-mono font-bold text-primary">{completedItems}/{totalItems}</span>
              <span className="text-muted-foreground">items complete</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background/60 rounded-full border">
              <span className="font-mono font-bold text-primary">{year}</span>
              <span className="text-muted-foreground">tax year</span>
            </div>
          </motion.div>

          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium mt-2"
            >
              <PartyPopper className="h-4 w-4" />
              <span>Ready for your CPA!</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

