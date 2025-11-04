"use client";

export function StatsTicker({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-8 text-center ${className}`}>
      <div>
        <div className="text-3xl font-bold text-primary">2,500+</div>
        <div className="text-sm text-muted-foreground">Families trust us</div>
      </div>
      <div className="h-12 w-px bg-border" />
      <div>
        <div className="text-3xl font-bold text-primary">150+</div>
        <div className="text-sm text-muted-foreground">CPAs recommend us</div>
      </div>
      <div className="h-12 w-px bg-border" />
      <div>
        <div className="text-3xl font-bold text-primary">92%</div>
        <div className="text-sm text-muted-foreground">Feel more confident</div>
      </div>
    </div>
  );
}

