"use client";

export function OrganizedDocsIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 280 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Transformation from messy paper pile to organized digital documents"
    >
      <defs>
        <linearGradient id="docOrganizedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
          <stop offset="100%" stopColor="hsl(0, 0%, 97%)" />
        </linearGradient>
        <filter id="organizedShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="4" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.18" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="transformGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(38, 92%, 50%)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="hsl(38, 92%, 50%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background elements */}
      <circle cx="140" cy="120" r="100" fill="url(#transformGlow)" />
      <circle cx="50" cy="50" r="60" fill="hsl(12, 76%, 61%)" opacity="0.08" />
      <circle cx="230" cy="190" r="50" fill="hsl(142, 71%, 45%)" opacity="0.1" />
      
      {/* BEFORE: Messy pile (left side) */}
      <g opacity="0.35">
        <text x="50" y="30" fill="hsl(20, 10%, 15%)" fontSize="12" fontWeight="600" opacity="0.6">Before</text>
        
        {/* Chaotic documents */}
        <g filter="url(#organizedShadow)">
          <rect x="15" y="60" width="45" height="58" rx="4" 
                transform="rotate(-18 37.5 89)" 
                fill="hsl(0, 0%, 98%)" 
                stroke="hsl(12, 76%, 61%)" 
                strokeWidth="2" />
          <line x1="22" y1="75" x2="52" y2="70" stroke="hsl(20, 10%, 15%)" strokeWidth="1.5" opacity="0.2" />
          <line x1="20" y1="83" x2="48" y2="78" stroke="hsl(20, 10%, 15%)" strokeWidth="1.5" opacity="0.2" />
          <text x="30" y="95" fill="hsl(12, 76%, 61%)" fontSize="10" opacity="0.6" transform="rotate(-18 30 95)">?</text>
        </g>
        
        <g filter="url(#organizedShadow)">
          <rect x="30" y="90" width="45" height="58" rx="4" 
                transform="rotate(12 52.5 119)" 
                fill="hsl(0, 0%, 98%)" 
                stroke="hsl(38, 92%, 50%)" 
                strokeWidth="2" 
                opacity="0.8" />
          <line x1="40" y1="105" x2="65" y2="108" stroke="hsl(20, 10%, 15%)" strokeWidth="1.5" opacity="0.2" />
          <line x1="39" y1="113" x2="62" y2="116" stroke="hsl(20, 10%, 15%)" strokeWidth="1.5" opacity="0.2" />
        </g>
        
        <g filter="url(#organizedShadow)">
          <rect x="20" y="130" width="45" height="58" rx="4" 
                transform="rotate(-25 42.5 159)" 
                fill="hsl(0, 0%, 98%)" 
                stroke="hsl(12, 76%, 61%)" 
                strokeWidth="2" 
                opacity="0.9" />
          <line x1="28" y1="145" x2="55" y2="138" stroke="hsl(20, 10%, 15%)" strokeWidth="1.5" opacity="0.2" />
          <text x="35" y="165" fill="hsl(12, 76%, 61%)" fontSize="10" opacity="0.6" transform="rotate(-25 35 165)">?</text>
        </g>
        
        {/* Stress indicators */}
        <circle cx="45" cy="50" r="3" fill="hsl(12, 76%, 61%)" opacity="0.5" />
        <circle cx="60" cy="180" r="2.5" fill="hsl(12, 76%, 61%)" opacity="0.4" />
      </g>
      
      {/* TRANSFORMATION ARROW */}
      <g transform="translate(100, 120)">
        <circle cx="20" cy="0" r="24" fill="hsl(38, 92%, 50%)" opacity="0.15" />
        <circle cx="20" cy="0" r="20" fill="hsl(38, 92%, 50%)" opacity="0.1" />
        <path d="M0 0 L35 0 M28 -6 L35 0 L28 6" 
              stroke="hsl(38, 92%, 50%)" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              opacity="0.8" />
        {/* Sparkle on arrow */}
        <text x="20" y="-12" textAnchor="middle" fill="hsl(38, 92%, 50%)" fontSize="14" opacity="0.6" className="animate-pulse">✨</text>
      </g>
      
      {/* AFTER: Organized stack (right side) */}
      <g>
        <text x="205" y="30" fill="hsl(20, 10%, 15%)" fontSize="12" fontWeight="600" opacity="0.8">After</text>
        
        {/* Perfectly stacked documents with 3D effect */}
        <g filter="url(#organizedShadow)">
          {/* Bottom shadow layer */}
          <rect x="168" y="118" width="60" height="75" rx="6" fill="hsl(40, 15%, 88%)" opacity="0.4" />
          
          {/* Document 3 (back) */}
          <rect x="165" y="105" width="60" height="75" rx="6" 
                fill="url(#docOrganizedGradient)" 
                stroke="hsl(142, 71%, 45%)" 
                strokeWidth="2" 
                opacity="0.85" />
          <rect x="167" y="107" width="56" height="71" rx="5" fill="hsl(142, 71%, 45%)" opacity="0.03" />
          <line x1="173" y1="120" x2="217" y2="120" stroke="hsl(20, 10%, 15%)" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" />
          <line x1="173" y1="128" x2="210" y2="128" stroke="hsl(20, 10%, 15%)" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" />
          <circle cx="195" cy="150" r="10" fill="hsl(142, 71%, 45%)" opacity="0.12" />
          <path d="M189 150 L193 154 L201 146" stroke="hsl(142, 71%, 45%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
          
          {/* Document 2 (middle) */}
          <rect x="172" y="95" width="60" height="75" rx="6" 
                fill="url(#docOrganizedGradient)" 
                stroke="hsl(142, 71%, 45%)" 
                strokeWidth="2.5" 
                opacity="0.92" />
          <rect x="174" y="97" width="56" height="71" rx="5" fill="hsl(142, 71%, 45%)" opacity="0.05" />
          {/* Document lines */}
          <line x1="180" y1="110" x2="224" y2="110" stroke="hsl(20, 10%, 15%)" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
          <line x1="180" y1="118" x2="217" y2="118" stroke="hsl(20, 10%, 15%)" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
          <line x1="180" y1="130" x2="224" y2="130" stroke="hsl(20, 10%, 15%)" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" />
          <line x1="180" y1="138" x2="210" y2="138" stroke="hsl(20, 10%, 15%)" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" />
          {/* Checkmark */}
          <circle cx="202" cy="150" r="11" fill="hsl(142, 71%, 45%)" opacity="0.15" />
          <path d="M196 150 L200 154 L208 146" stroke="hsl(142, 71%, 45%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Label */}
          <rect x="178" y="103" width="22" height="8" rx="2" fill="hsl(142, 71%, 45%)" opacity="0.2" />
          <text x="189" y="109" textAnchor="middle" fill="hsl(20, 10%, 15%)" fontSize="6" fontWeight="600" opacity="0.7">W-2</text>
          
          {/* Document 1 (front) - most prominent */}
          <rect x="179" y="85" width="60" height="75" rx="6" 
                fill="url(#docOrganizedGradient)" 
                stroke="hsl(142, 71%, 45%)" 
                strokeWidth="3" />
          <rect x="181" y="87" width="56" height="71" rx="5" fill="hsl(142, 71%, 45%)" opacity="0.06" />
          {/* Document fold corner */}
          <path d="M234 85 L234 96 L223 96 Z" fill="hsl(142, 71%, 45%)" opacity="0.2" />
          {/* Document lines */}
          <line x1="187" y1="100" x2="231" y2="100" stroke="hsl(20, 10%, 15%)" strokeWidth="2" opacity="0.25" strokeLinecap="round" />
          <line x1="187" y1="108" x2="224" y2="108" stroke="hsl(20, 10%, 15%)" strokeWidth="2" opacity="0.25" strokeLinecap="round" />
          <line x1="187" y1="120" x2="231" y2="120" stroke="hsl(20, 10%, 15%)" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
          <line x1="187" y1="128" x2="217" y2="128" stroke="hsl(20, 10%, 15%)" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
          <line x1="187" y1="136" x2="231" y2="136" stroke="hsl(20, 10%, 15%)" strokeWidth="2" opacity="0.15" strokeLinecap="round" />
          <line x1="187" y1="144" x2="220" y2="144" stroke="hsl(20, 10%, 15%)" strokeWidth="2" opacity="0.15" strokeLinecap="round" />
          {/* Big checkmark */}
          <circle cx="209" cy="140" r="13" fill="hsl(142, 71%, 45%)" opacity="0.18" />
          <path d="M202 140 L207 145 L216 136" stroke="hsl(142, 71%, 45%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Label */}
          <rect x="185" y="93" width="26" height="9" rx="2" fill="hsl(142, 71%, 45%)" opacity="0.25" />
          <text x="198" y="100" textAnchor="middle" fill="hsl(20, 10%, 15%)" fontSize="7" fontWeight="600" opacity="0.8">1099</text>
        </g>
      </g>
      
      {/* Floating success sparkles around organized docs */}
      <g className="animate-float" style={{ animationDuration: "3s", animationDelay: "0s" }}>
        <circle cx="250" cy="70" r="3" fill="hsl(142, 71%, 45%)" opacity="0.6" />
        <circle cx="252" cy="68" r="2" fill="hsl(142, 71%, 45%)" opacity="0.4" />
      </g>
      <g className="animate-float" style={{ animationDuration: "3.5s", animationDelay: "0.4s" }}>
        <circle cx="265" cy="110" r="2.5" fill="hsl(38, 92%, 50%)" opacity="0.6" />
        <circle cx="267" cy="108" r="1.5" fill="hsl(38, 92%, 50%)" opacity="0.4" />
      </g>
      <g className="animate-float" style={{ animationDuration: "2.8s", animationDelay: "0.8s" }}>
        <circle cx="255" cy="180" r="3" fill="hsl(142, 71%, 45%)" opacity="0.5" />
        <circle cx="257" cy="178" r="2" fill="hsl(142, 71%, 45%)" opacity="0.3" />
      </g>
      <g className="animate-pulse" style={{ animationDuration: "2s" }}>
        <text x="165" y="75" textAnchor="middle" fill="hsl(38, 92%, 50%)" fontSize="16" opacity="0.5">✨</text>
      </g>
    </svg>
  );
}
