"use client";

import { useEffect, useState, useRef } from "react";
import { Sparkles } from "lucide-react";

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

function StatItem({ value, label, suffix = "", prefix = "" }: StatItemProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setCount(Math.floor(increment * currentStep));
      } else {
        setCount(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="text-center space-y-2">
      <div className="relative inline-block">
        <div className="text-4xl sm:text-5xl font-bold text-primary animate-in fade-in-50 duration-700">
          {prefix}{count.toLocaleString()}{suffix}
        </div>
        {isVisible && (
          <Sparkles 
            className="absolute -top-2 -right-6 h-5 w-5 text-warning animate-pulse" 
            fill="currentColor"
          />
        )}
      </div>
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  );
}

export function StatsTicker({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-8 sm:gap-12 ${className}`}>
      <StatItem 
        value={2500} 
        suffix="+" 
        label="families filed stress-free in 2024" 
      />
      
      <div className="hidden sm:block h-16 w-px bg-border" />
      
      <StatItem 
        value={150} 
        suffix="+" 
        label="CPAs recommend us" 
      />
      
      <div className="hidden sm:block h-16 w-px bg-border" />
      
      <StatItem 
        value={92} 
        suffix="%" 
        label="feel more confident about taxes" 
      />
    </div>
  );
}
