"use client";

export function HeroRelaxedIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Person relaxed with laptop */}
      <g>
        {/* Desk */}
        <rect x="50" y="200" width="300" height="8" rx="4" className="fill-muted" />
        
        {/* Organized documents stack (left side) */}
        <g className="animate-pulse" style={{ animationDuration: "3s" }}>
          <rect x="70" y="160" width="60" height="40" rx="4" className="fill-success/20 stroke-success" strokeWidth="2" />
          <path d="M80 170 L90 180 L115 165" className="stroke-success" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        
        {/* Laptop */}
        <rect x="160" y="170" width="80" height="50" rx="4" className="fill-card stroke-border" strokeWidth="2" />
        <rect x="165" y="175" width="70" height="35" rx="2" className="fill-primary/10" />
        <circle cx="200" cy="192" r="3" className="fill-success" />
        
        {/* Person (simplified, friendly) */}
        <g transform="translate(260, 140)">
          {/* Head */}
          <circle cx="20" cy="20" r="18" className="fill-warning/30 stroke-warning" strokeWidth="2" />
          {/* Happy face */}
          <circle cx="15" cy="18" r="2" className="fill-primary" />
          <circle cx="25" cy="18" r="2" className="fill-primary" />
          <path d="M14 24 Q20 28 26 24" className="stroke-primary" strokeWidth="2" strokeLinecap="round" fill="none" />
          
          {/* Body */}
          <rect x="8" y="38" width="24" height="30" rx="4" className="fill-primary/20 stroke-primary" strokeWidth="2" />
          
          {/* Arm raised (celebrating) */}
          <path d="M10 45 L5 35" className="stroke-primary" strokeWidth="3" strokeLinecap="round" />
        </g>
        
        {/* Floating checkmarks (ambient) */}
        <g className="animate-pulse" style={{ animationDuration: "2s", animationDelay: "0.5s" }}>
          <circle cx="100" cy="80" r="20" className="fill-success/10" />
          <path d="M90 80 L97 87 L110 74" className="stroke-success" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        
        <g className="animate-pulse" style={{ animationDuration: "2.5s" }}>
          <circle cx="320" cy="100" r="16" className="fill-success/10" />
          <path d="M312 100 L318 106 L328 96" className="stroke-success" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}

