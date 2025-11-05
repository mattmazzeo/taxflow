"use client";

export function HeroRelaxedIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 500 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Person relaxing with organized tax documents on laptop, celebrating peace of mind"
    >
      <defs>
        {/* Gradients for depth */}
        <linearGradient id="deskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(40, 15%, 92%)" />
          <stop offset="100%" stopColor="hsl(40, 15%, 85%)" />
        </linearGradient>
        <linearGradient id="laptopGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(0, 0%, 98%)" />
          <stop offset="100%" stopColor="hsl(0, 0%, 92%)" />
        </linearGradient>
        <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(149, 70%, 25%)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(149, 70%, 20%)" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity="0" />
        </radialGradient>
        {/* Shadow filter */}
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dx="0" dy="4" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background ambient elements */}
      <circle cx="400" cy="80" r="120" fill="hsl(120, 25%, 85%)" opacity="0.3" />
      <circle cx="100" cy="320" r="100" fill="hsl(38, 92%, 50%)" opacity="0.15" />

      {/* Main scene */}
      <g filter="url(#softShadow)">
        {/* Desk with depth */}
        <ellipse cx="250" cy="340" rx="200" ry="8" fill="hsl(40, 15%, 88%)" opacity="0.6" />
        <rect x="80" y="260" width="340" height="12" rx="6" fill="url(#deskGradient)" />
        <rect x="80" y="268" width="340" height="4" rx="2" fill="hsl(40, 15%, 80%)" opacity="0.5" />
        
        {/* Organized documents stack with detail */}
        <g className="animate-float" style={{ animationDuration: "4s", animationDelay: "0s" }}>
          {/* Bottom document */}
          <rect x="100" y="210" width="70" height="50" rx="4" fill="hsl(0, 0%, 100%)" stroke="hsl(40, 15%, 88%)" strokeWidth="2" />
          {/* Middle document */}
          <rect x="95" y="200" width="70" height="50" rx="4" fill="hsl(0, 0%, 100%)" stroke="hsl(142, 71%, 45%)" strokeWidth="2.5" />
          <rect x="97" y="202" width="66" height="46" rx="3" fill="hsl(142, 71%, 45%)" opacity="0.05" />
          {/* Checkmark on document */}
          <circle cx="130" cy="225" r="12" fill="hsl(142, 71%, 45%)" opacity="0.15" />
          <path d="M122 225 L128 231 L138 221" stroke="hsl(142, 71%, 45%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Document lines */}
          <line x1="105" y1="215" x2="155" y2="215" stroke="hsl(20, 10%, 15%)" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
          <line x1="105" y1="222" x2="145" y2="222" stroke="hsl(20, 10%, 15%)" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
          <line x1="105" y1="235" x2="155" y2="235" stroke="hsl(20, 10%, 15%)" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" />
          <line x1="105" y1="242" x2="140" y2="242" stroke="hsl(20, 10%, 15%)" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" />
        </g>
        
        {/* Laptop with detailed screen */}
        <g>
          {/* Laptop base/keyboard */}
          <path d="M190 260 L190 230 Q190 225 195 225 L305 225 Q310 225 310 230 L310 260 Z" fill="url(#laptopGradient)" />
          <rect x="190" y="260" width="120" height="10" rx="2" fill="hsl(0, 0%, 85%)" />
          {/* Keyboard detail */}
          <rect x="200" y="248" width="100" height="8" rx="1" fill="hsl(0, 0%, 75%)" opacity="0.3" />
          
          {/* Screen */}
          <rect x="195" y="170" width="110" height="65" rx="3" fill="url(#laptopGradient)" stroke="hsl(40, 15%, 80%)" strokeWidth="2" />
          <rect x="200" y="175" width="100" height="55" rx="2" fill="url(#screenGradient)" />
          
          {/* TaxFlow dashboard on screen */}
          <g opacity="0.8">
            {/* Header bar */}
            <rect x="202" y="177" width="96" height="6" rx="1" fill="hsl(149, 70%, 20%)" opacity="0.6" />
            {/* Progress bar */}
            <rect x="205" y="188" width="90" height="4" rx="2" fill="hsl(40, 15%, 88%)" opacity="0.4" />
            <rect x="205" y="188" width="65" height="4" rx="2" fill="hsl(142, 71%, 45%)" opacity="0.8" />
            {/* Document icons */}
            <circle cx="215" cy="205" r="4" fill="hsl(142, 71%, 45%)" opacity="0.6" />
            <circle cx="230" cy="205" r="4" fill="hsl(142, 71%, 45%)" opacity="0.6" />
            <circle cx="245" cy="205" r="4" fill="hsl(38, 92%, 50%)" opacity="0.5" />
            {/* Checkmarks */}
            <path d="M212 205 L214 207 L218 203" stroke="hsl(0, 0%, 100%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M227 205 L229 207 L233 203" stroke="hsl(0, 0%, 100%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        
        {/* Coffee mug - relaxation detail */}
        <g transform="translate(335, 230)">
          <ellipse cx="15" cy="30" rx="12" ry="3" fill="hsl(40, 15%, 80%)" opacity="0.5" />
          <rect x="5" y="10" width="20" height="20" rx="2" fill="url(#laptopGradient)" stroke="hsl(38, 92%, 50%)" strokeWidth="2" />
          <path d="M25 15 Q32 15 32 20 Q32 25 25 25" stroke="hsl(38, 92%, 50%)" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Steam lines */}
          <path d="M10 8 Q12 4 10 0" stroke="hsl(38, 92%, 50%)" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" fill="none" className="animate-float" />
          <path d="M15 8 Q17 4 15 0" stroke="hsl(38, 92%, 50%)" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" fill="none" className="animate-float" style={{ animationDelay: "0.5s" }} />
        </g>
        
        {/* Person with detailed expression */}
        <g transform="translate(320, 160)">
          {/* Neck/shoulders */}
          <ellipse cx="30" cy="60" rx="25" ry="12" fill="hsl(149, 70%, 20%)" opacity="0.15" />
          
          {/* Body with texture */}
          <path d="M15 50 Q10 45 10 55 L10 75 Q10 80 15 80 L45 80 Q50 80 50 75 L50 55 Q50 45 45 50 Z" fill="hsl(149, 70%, 20%)" opacity="0.2" />
          <rect x="15" y="50" width="30" height="30" rx="6" fill="hsl(149, 70%, 20%)" opacity="0.15" stroke="hsl(149, 70%, 20%)" strokeWidth="2" />
          
          {/* Head with gradient */}
          <ellipse cx="30" cy="32" rx="22" ry="24" fill="hsl(38, 92%, 50%)" opacity="0.25" />
          <circle cx="30" cy="30" r="20" fill="hsl(38, 92%, 50%)" opacity="0.35" stroke="hsl(38, 92%, 50%)" strokeWidth="2.5" />
          
          {/* Hair */}
          <path d="M12 24 Q10 18 15 15 Q20 12 25 12 Q30 11 35 12 Q40 13 44 16 Q48 20 46 25" stroke="hsl(20, 10%, 15%)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
          
          {/* Smiling eyes */}
          <path d="M20 26 Q22 28 24 26" stroke="hsl(20, 10%, 15%)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M36 26 Q38 28 40 26" stroke="hsl(20, 10%, 15%)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          
          {/* Big genuine smile */}
          <path d="M18 36 Q30 44 42 36" stroke="hsl(20, 10%, 15%)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M20 36 Q30 42 40 36" fill="hsl(0, 0%, 100%)" opacity="0.6" />
          
          {/* Rosy cheeks */}
          <circle cx="16" cy="32" r="4" fill="hsl(12, 76%, 61%)" opacity="0.4" />
          <circle cx="44" cy="32" r="4" fill="hsl(12, 76%, 61%)" opacity="0.4" />
          
          {/* Arm raised celebrating */}
          <path d="M15 52 Q10 48 8 42 Q6 36 4 30" stroke="hsl(149, 70%, 20%)" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
          {/* Hand */}
          <circle cx="3" cy="28" r="5" fill="hsl(38, 92%, 50%)" opacity="0.3" stroke="hsl(38, 92%, 50%)" strokeWidth="2" />
        </g>
      </g>
      
      {/* Floating success indicators */}
      <g className="animate-float" style={{ animationDuration: "3s", animationDelay: "0s" }}>
        <circle cx="120" cy="100" r="25" fill="url(#glowGradient)" />
        <circle cx="120" cy="100" r="22" fill="hsl(142, 71%, 45%)" opacity="0.12" />
        <path d="M108 100 L116 108 L134 90" stroke="hsl(142, 71%, 45%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      </g>
      
      <g className="animate-float" style={{ animationDuration: "3.5s", animationDelay: "0.7s" }}>
        <circle cx="420" cy="150" r="20" fill="url(#glowGradient)" />
        <circle cx="420" cy="150" r="18" fill="hsl(142, 71%, 45%)" opacity="0.12" />
        <path d="M411 150 L417 156 L430 143" stroke="hsl(142, 71%, 45%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      </g>
      
      <g className="animate-float" style={{ animationDuration: "4s", animationDelay: "1.2s" }}>
        <circle cx="450" cy="280" r="16" fill="hsl(38, 92%, 50%)" opacity="0.15" />
        <text x="450" y="286" textAnchor="middle" fill="hsl(38, 92%, 50%)" fontSize="20" opacity="0.6">✨</text>
      </g>
    </svg>
  );
}

