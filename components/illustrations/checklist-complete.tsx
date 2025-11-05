"use client";

export function ChecklistCompleteIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Completed tax checklist with all items checked off"
    >
      <defs>
        <linearGradient id="clipboardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
          <stop offset="100%" stopColor="hsl(0, 0%, 95%)" />
        </linearGradient>
        <linearGradient id="clipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(40, 15%, 88%)" />
          <stop offset="100%" stopColor="hsl(40, 15%, 75%)" />
        </linearGradient>
        <filter id="boardShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dx="0" dy="6" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="successGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background celebration */}
      <circle cx="120" cy="140" r="120" fill="url(#successGlow)" />
      <circle cx="40" cy="60" r="50" fill="hsl(38, 92%, 50%)" opacity="0.1" />
      <circle cx="200" cy="220" r="60" fill="hsl(142, 71%, 45%)" opacity="0.08" />
      
      {/* Clipboard with depth */}
      <g filter="url(#boardShadow)">
        {/* Board backing with subtle edge highlight */}
        <rect x="48" y="32" width="144" height="216" rx="12" fill="hsl(40, 15%, 85%)" />
        <rect x="50" y="30" width="140" height="212" rx="10" fill="url(#clipboardGradient)" stroke="hsl(40, 15%, 80%)" strokeWidth="2" />
        
        {/* Inner paper effect */}
        <rect x="58" y="55" width="124" height="175" rx="4" fill="hsl(0, 0%, 100%)" opacity="0.6" />
        
        {/* Clip at top with 3D effect */}
        <rect x="88" y="20" width="64" height="26" rx="6" fill="url(#clipGradient)" />
        <rect x="90" y="22" width="60" height="22" rx="5" fill="hsl(40, 15%, 82%)" stroke="hsl(40, 15%, 70%)" strokeWidth="1.5" />
        <circle cx="105" cy="33" r="3" fill="hsl(40, 15%, 70%)" />
        <circle cx="135" cy="33" r="3" fill="hsl(40, 15%, 70%)" />
      </g>
      
      {/* Checklist items with progressive completion */}
      <g>
        {/* Title */}
        <text x="120" y="75" textAnchor="middle" fill="hsl(20, 10%, 15%)" fontSize="14" fontWeight="600" opacity="0.8">Tax Document Checklist</text>
        <line x1="70" y1="82" x2="170" y2="82" stroke="hsl(149, 70%, 20%)" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
        
        {/* Item 1 - W-2 Forms */}
        <g className="animate-float" style={{ animationDuration: "3s", animationDelay: "0s" }}>
          <rect x="68" y="100" width="28" height="28" rx="6" fill="hsl(142, 71%, 45%)" opacity="0.15" stroke="hsl(142, 71%, 45%)" strokeWidth="2.5" />
          <path d="M74 114 L80 120 L90 110" stroke="hsl(142, 71%, 45%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="106" y="118" fill="hsl(20, 10%, 15%)" fontSize="12" opacity="0.7">W-2 Forms</text>
          <circle cx="170" cy="114" r="4" fill="hsl(142, 71%, 45%)" opacity="0.6" />
        </g>
        
        {/* Item 2 - 1099 Forms */}
        <g className="animate-float" style={{ animationDuration: "3.2s", animationDelay: "0.2s" }}>
          <rect x="68" y="140" width="28" height="28" rx="6" fill="hsl(142, 71%, 45%)" opacity="0.15" stroke="hsl(142, 71%, 45%)" strokeWidth="2.5" />
          <path d="M74 154 L80 160 L90 150" stroke="hsl(142, 71%, 45%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="106" y="158" fill="hsl(20, 10%, 15%)" fontSize="12" opacity="0.7">1099 Forms</text>
          <circle cx="170" cy="154" r="4" fill="hsl(142, 71%, 45%)" opacity="0.6" />
        </g>
        
        {/* Item 3 - Mortgage Interest */}
        <g className="animate-float" style={{ animationDuration: "3.4s", animationDelay: "0.4s" }}>
          <rect x="68" y="180" width="28" height="28" rx="6" fill="hsl(142, 71%, 45%)" opacity="0.15" stroke="hsl(142, 71%, 45%)" strokeWidth="2.5" />
          <path d="M74 194 L80 200 L90 190" stroke="hsl(142, 71%, 45%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="106" y="198" fill="hsl(20, 10%, 15%)" fontSize="12" opacity="0.7">Mortgage Interest</text>
          <circle cx="170" cy="194" r="4" fill="hsl(142, 71%, 45%)" opacity="0.6" />
        </g>
        
        {/* Item 4 - Complete with celebration animation */}
        <g className="animate-pulse" style={{ animationDuration: "2s" }}>
          <rect x="68" y="220" width="28" height="28" rx="6" fill="hsl(142, 71%, 45%)" opacity="0.2" stroke="hsl(142, 71%, 45%)" strokeWidth="2.5" />
          <path d="M74 234 L80 240 L90 230" stroke="hsl(142, 71%, 45%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="106" y="238" fill="hsl(20, 10%, 15%)" fontSize="12" opacity="0.7">Charitable Donations</text>
          <circle cx="170" cy="234" r="4" fill="hsl(142, 71%, 45%)" opacity="0.6" />
        </g>
      </g>
      
      {/* Success badge with glow */}
      <g transform="translate(175, 50)">
        <circle r="32" fill="url(#successGlow)" />
        <circle r="28" fill="hsl(142, 71%, 45%)" className="animate-pulse" />
        <circle r="26" fill="hsl(142, 71%, 40%)" />
        <path d="M-8 0 L-2 6 L10 -8" stroke="hsl(0, 0%, 100%)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {/* Badge ribbon */}
        <path d="M0 22 L-6 35 L0 32 L6 35 Z" fill="hsl(142, 71%, 40%)" />
      </g>
      
      {/* Floating celebration elements */}
      <g className="animate-float" style={{ animationDuration: "3s", animationDelay: "0s" }}>
        <text x="30" y="120" textAnchor="middle" fill="hsl(38, 92%, 50%)" fontSize="20" opacity="0.6">✨</text>
      </g>
      <g className="animate-float" style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}>
        <text x="210" y="180" textAnchor="middle" fill="hsl(38, 92%, 50%)" fontSize="18" opacity="0.5">✨</text>
      </g>
      <g className="animate-float" style={{ animationDuration: "2.8s", animationDelay: "0.8s" }}>
        <text x="35" y="240" textAnchor="middle" fill="hsl(142, 71%, 45%)" fontSize="16" opacity="0.5">✓</text>
      </g>
    </svg>
  );
}
