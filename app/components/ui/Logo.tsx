export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="neuflowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Hexagon Extent Bounds */}
      <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="url(#neuflowGrad)" strokeWidth="4" strokeLinejoin="round" fill="none" opacity="0.3" />
      
      {/* Neural Pathways */}
      <path d="M50 25 L70 45 L50 65 L30 45 Z" stroke="url(#neuflowGrad)" strokeWidth="3" strokeLinejoin="round" fill="none" />
      <path d="M50 25 L50 65" stroke="url(#neuflowGrad)" strokeWidth="3" opacity="0.8" />
      <path d="M30 45 L70 45" stroke="url(#neuflowGrad)" strokeWidth="3" opacity="0.8" />
      
      {/* Outer synapses */}
      <path d="M10 50 L30 45 M90 50 L70 45 M50 95 L50 65 M50 5 L50 25" stroke="url(#neuflowGrad)" strokeWidth="2" opacity="0.5" />
      
      {/* Active Glowing Processing Nodes */}
      <circle cx="50" cy="25" r="5" fill="#8b5cf6" filter="url(#neonGlow)" />
      <circle cx="70" cy="45" r="5" fill="#06b6d4" filter="url(#neonGlow)" />
      <circle cx="50" cy="65" r="5" fill="#f472b6" filter="url(#neonGlow)" />
      <circle cx="30" cy="45" r="5" fill="#a78bfa" filter="url(#neonGlow)" />
      
      {/* Central Core */}
      <circle cx="50" cy="45" r="7" fill="#ffffff" filter="url(#neonGlow)" />
    </svg>
  );
}
