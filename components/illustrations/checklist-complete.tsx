"use client";

export function ChecklistCompleteIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Clipboard/checklist background */}
      <rect x="40" y="20" width="120" height="160" rx="8" className="fill-card stroke-border" strokeWidth="2" />
      <rect x="70" y="15" width="60" height="15" rx="4" className="fill-muted" />
      
      {/* Checklist items */}
      <g>
        {/* Item 1 - Complete */}
        <rect x="60" y="50" width="20" height="20" rx="4" className="fill-success/20 stroke-success" strokeWidth="2" />
        <path d="M65 60 L70 65 L75 55" className="stroke-success" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="90" y1="60" x2="130" y2="60" className="stroke-muted-foreground" strokeWidth="2" strokeLinecap="round" />
        
        {/* Item 2 - Complete */}
        <rect x="60" y="85" width="20" height="20" rx="4" className="fill-success/20 stroke-success" strokeWidth="2" />
        <path d="M65 95 L70 100 L75 90" className="stroke-success" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="90" y1="95" x2="130" y2="95" className="stroke-muted-foreground" strokeWidth="2" strokeLinecap="round" />
        
        {/* Item 3 - Complete */}
        <rect x="60" y="120" width="20" height="20" rx="4" className="fill-success/20 stroke-success" strokeWidth="2" />
        <path d="M65 130 L70 135 L75 125" className="stroke-success" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="90" y1="130" x2="130" y2="130" className="stroke-muted-foreground" strokeWidth="2" strokeLinecap="round" />
        
        {/* Item 4 - Complete with animation */}
        <g className="animate-pulse">
          <rect x="60" y="155" width="20" height="20" rx="4" className="fill-success/20 stroke-success" strokeWidth="2" />
          <path d="M65 165 L70 170 L75 160" className="stroke-success" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="90" y1="165" x2="130" y2="165" className="stroke-muted-foreground" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
      
      {/* Success badge */}
      <circle cx="150" cy="40" r="25" className="fill-success" />
      <path d="M140 40 L147 47 L160 34" className="stroke-white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

