"use client";

export function OrganizedDocsIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Chaos to order transformation */}
      <g>
        {/* Messy side (before) */}
        <g opacity="0.3">
          <rect x="10" y="50" width="35" height="45" rx="3" transform="rotate(-15 27 72)" className="fill-destructive/20 stroke-destructive" strokeWidth="1.5" />
          <rect x="20" y="80" width="35" height="45" rx="3" transform="rotate(10 37 102)" className="fill-warning/20 stroke-warning" strokeWidth="1.5" />
          <rect x="15" y="110" width="35" height="45" rx="3" transform="rotate(-20 32 132)" className="fill-destructive/20 stroke-destructive" strokeWidth="1.5" />
        </g>
        
        {/* Arrow transition */}
        <g transform="translate(70, 100)">
          <path d="M0 0 L30 0" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
          <path d="M25 -5 L30 0 L25 5" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        
        {/* Organized side (after) */}
        <g>
          {/* Neat stack */}
          <rect x="110" y="60" width="40" height="50" rx="4" className="fill-success/20 stroke-success" strokeWidth="2" />
          <path d="M118 75 L125 82 L142 70" className="stroke-success" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="118" y1="90" x2="142" y2="90" className="stroke-success/40" strokeWidth="1.5" />
          <line x1="118" y1="96" x2="135" y2="96" className="stroke-success/40" strokeWidth="1.5" />
          
          <rect x="115" y="65" width="40" height="50" rx="4" className="fill-success/20 stroke-success" strokeWidth="2" />
          <path d="M123 80 L130 87 L147 75" className="stroke-success" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="123" y1="95" x2="147" y2="95" className="stroke-success/40" strokeWidth="1.5" />
          <line x1="123" y1="101" x2="140" y2="101" className="stroke-success/40" strokeWidth="1.5" />
          
          <rect x="120" y="70" width="40" height="50" rx="4" className="fill-success/30 stroke-success" strokeWidth="2" />
          <path d="M128 85 L135 92 L152 80" className="stroke-success" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="128" y1="100" x2="152" y2="100" className="stroke-success/40" strokeWidth="1.5" />
          <line x1="128" y1="106" x2="145" y2="106" className="stroke-success/40" strokeWidth="1.5" />
        </g>
        
        {/* Sparkles around organized docs */}
        <g className="animate-pulse">
          <circle cx="170" cy="60" r="2" className="fill-warning" />
          <circle cx="180" cy="80" r="1.5" className="fill-warning" />
          <circle cx="175" cy="120" r="2" className="fill-warning" />
        </g>
      </g>
    </svg>
  );
}

