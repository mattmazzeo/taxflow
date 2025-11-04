"use client";

export function UploadZoneIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Upload zone boundary */}
      <rect
        x="20"
        y="40"
        width="160"
        height="120"
        rx="12"
        className="stroke-border stroke-dashed fill-muted/20"
        strokeWidth="3"
        strokeDasharray="8 8"
      />
      
      {/* Documents flying in */}
      <g className="animate-pulse" style={{ animationDuration: "2s" }}>
        <rect x="40" y="20" width="40" height="50" rx="4" className="fill-card stroke-primary" strokeWidth="2" />
        <line x1="48" y1="32" x2="72" y2="32" className="stroke-primary/40" strokeWidth="2" />
        <line x1="48" y1="40" x2="72" y2="40" className="stroke-primary/40" strokeWidth="2" />
        <line x1="48" y1="48" x2="60" y2="48" className="stroke-primary/40" strokeWidth="2" />
      </g>
      
      <g className="animate-pulse" style={{ animationDuration: "2.3s", animationDelay: "0.3s" }}>
        <rect x="120" y="25" width="40" height="50" rx="4" className="fill-card stroke-primary" strokeWidth="2" />
        <line x1="128" y1="37" x2="152" y2="37" className="stroke-primary/40" strokeWidth="2" />
        <line x1="128" y1="45" x2="152" y2="45" className="stroke-primary/40" strokeWidth="2" />
        <line x1="128" y1="53" x2="140" y2="53" className="stroke-primary/40" strokeWidth="2" />
      </g>
      
      {/* Central upload arrow */}
      <g transform="translate(100, 100)">
        <circle r="30" className="fill-primary/10" />
        <path
          d="M0 -12 L0 12 M-8 -4 L0 -12 L8 -4"
          className="stroke-primary"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      
      {/* Success indicator */}
      <circle cx="160" cy="150" r="12" className="fill-success" />
      <path d="M155 150 L158 153 L165 146" className="stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

