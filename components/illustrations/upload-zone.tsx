"use client";

export function UploadZoneIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Documents being uploaded into TaxFlow with cloud storage"
    >
      <defs>
        <linearGradient id="uploadDocGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
          <stop offset="100%" stopColor="hsl(0, 0%, 96%)" />
        </linearGradient>
        <linearGradient id="uploadCircleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(149, 70%, 25%)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(149, 70%, 20%)" stopOpacity="0.08" />
        </linearGradient>
        <filter id="docShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="3" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.15" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="glowUpload" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background ambient glow */}
      <circle cx="120" cy="120" r="100" fill="url(#glowUpload)" />
      <circle cx="40" cy="40" r="60" fill="hsl(38, 92%, 50%)" opacity="0.08" />
      <circle cx="200" cy="180" r="50" fill="hsl(149, 70%, 20%)" opacity="0.05" />
      
      {/* Upload zone boundary with depth */}
      <rect
        x="30"
        y="60"
        width="180"
        height="140"
        rx="16"
        fill="hsl(120, 25%, 85%)"
        opacity="0.15"
      />
      <rect
        x="30"
        y="60"
        width="180"
        height="140"
        rx="16"
        className="stroke-primary"
        strokeWidth="3"
        strokeDasharray="12 8"
        opacity="0.4"
      />
      
      {/* Documents flying in with 3D effect */}
      <g className="animate-float" style={{ animationDuration: "2.5s", animationDelay: "0s" }} filter="url(#docShadow)">
        <rect x="50" y="30" width="50" height="65" rx="6" fill="url(#uploadDocGradient)" stroke="hsl(149, 70%, 20%)" strokeWidth="2.5" />
        <rect x="52" y="32" width="46" height="61" rx="5" fill="hsl(149, 70%, 20%)" opacity="0.03" />
        {/* Document fold corner */}
        <path d="M95 30 L95 40 L85 40 Z" fill="hsl(149, 70%, 20%)" opacity="0.15" />
        {/* Document lines */}
        <line x1="58" y1="48" x2="92" y2="48" stroke="hsl(20, 10%, 15%)" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
        <line x1="58" y1="58" x2="88" y2="58" stroke="hsl(20, 10%, 15%)" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
        <line x1="58" y1="68" x2="92" y2="68" stroke="hsl(20, 10%, 15%)" strokeWidth="2" opacity="0.15" strokeLinecap="round" />
        <line x1="58" y1="78" x2="80" y2="78" stroke="hsl(20, 10%, 15%)" strokeWidth="2" opacity="0.15" strokeLinecap="round" />
        {/* W-2 label */}
        <rect x="56" y="38" width="20" height="8" rx="2" fill="hsl(38, 92%, 50%)" opacity="0.3" />
        <text x="66" y="44" textAnchor="middle" fill="hsl(20, 10%, 15%)" fontSize="6" fontWeight="600" opacity="0.6">W-2</text>
      </g>
      
      <g className="animate-float" style={{ animationDuration: "3s", animationDelay: "0.4s" }} filter="url(#docShadow)">
        <rect x="140" y="35" width="50" height="65" rx="6" fill="url(#uploadDocGradient)" stroke="hsl(149, 70%, 20%)" strokeWidth="2.5" />
        <rect x="142" y="37" width="46" height="61" rx="5" fill="hsl(149, 70%, 20%)" opacity="0.03" />
        {/* Document fold corner */}
        <path d="M185 35 L185 45 L175 45 Z" fill="hsl(149, 70%, 20%)" opacity="0.15" />
        {/* Document lines */}
        <line x1="148" y1="53" x2="182" y2="53" stroke="hsl(20, 10%, 15%)" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
        <line x1="148" y1="63" x2="178" y2="63" stroke="hsl(20, 10%, 15%)" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
        <line x1="148" y1="73" x2="182" y2="73" stroke="hsl(20, 10%, 15%)" strokeWidth="2" opacity="0.15" strokeLinecap="round" />
        <line x1="148" y1="83" x2="170" y2="83" stroke="hsl(20, 10%, 15%)" strokeWidth="2" opacity="0.15" strokeLinecap="round" />
        {/* 1099 label */}
        <rect x="146" y="43" width="28" height="8" rx="2" fill="hsl(38, 92%, 50%)" opacity="0.3" />
        <text x="160" y="49" textAnchor="middle" fill="hsl(20, 10%, 15%)" fontSize="6" fontWeight="600" opacity="0.6">1099</text>
      </g>
      
      {/* Central upload icon with depth */}
      <g transform="translate(120, 130)">
        <circle r="38" fill="url(#uploadCircleGradient)" />
        <circle r="36" fill="hsl(149, 70%, 20%)" opacity="0.1" />
        {/* Upload arrow */}
        <g className="animate-float" style={{ animationDuration: "2s" }}>
          <path
            d="M0 -15 L0 15 M-10 -6 L0 -15 L10 -6"
            stroke="hsl(149, 70%, 20%)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
        </g>
        {/* Cloud shape bottom */}
        <path d="M-18 18 Q-24 18 -24 12 Q-24 8 -20 6 Q-20 2 -16 2 Q-14 -2 -8 -2 Q-4 -2 -2 2 Q4 2 6 2 Q10 2 12 6 Q16 8 16 12 Q16 18 10 18 Z" fill="hsl(149, 70%, 20%)" opacity="0.15" />
      </g>
      
      {/* Success checkmarks */}
      <g className="animate-float" style={{ animationDuration: "2.5s", animationDelay: "0.8s" }}>
        <circle cx="190" cy="170" r="16" fill="hsl(142, 71%, 45%)" opacity="0.15" />
        <circle cx="190" cy="170" r="14" fill="hsl(142, 71%, 45%)" opacity="0.1" />
        <path d="M183 170 L188 175 L197 166" stroke="hsl(142, 71%, 45%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      
      <g className="animate-float" style={{ animationDuration: "2.8s", animationDelay: "1.2s" }}>
        <circle cx="50" cy="180" r="14" fill="hsl(142, 71%, 45%)" opacity="0.12" />
        <path d="M44 180 L48 184 L56 176" stroke="hsl(142, 71%, 45%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      </g>
      
      {/* Sparkle effects */}
      <g className="animate-pulse" style={{ animationDuration: "2s" }}>
        <text x="180" y="60" textAnchor="middle" fill="hsl(38, 92%, 50%)" fontSize="18" opacity="0.5">✨</text>
      </g>
      <g className="animate-pulse" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}>
        <text x="60" y="200" textAnchor="middle" fill="hsl(38, 92%, 50%)" fontSize="14" opacity="0.4">✨</text>
      </g>
    </svg>
  );
}
