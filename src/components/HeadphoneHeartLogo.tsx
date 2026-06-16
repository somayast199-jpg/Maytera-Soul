import React from "react";

interface HeadphoneHeartLogoProps {
  className?: string;
  size?: number;
}

export default function HeadphoneHeartLogo({ className = "", size = 48 }: HeadphoneHeartLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`relative select-none filter drop-shadow-[0_0_10px_rgba(239,68,68,0.25)] ${className}`}
    >
      {/* Background soft glow gradient definition */}
      <defs>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
        </radialGradient>
        
        <linearGradient id="headphoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#CBD5E1" />
          <stop offset="70%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#B91C1C" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>

        <linearGradient id="cyberNeonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00F2FE" />
          <stop offset="100%" stopColor="#F355DA" />
        </linearGradient>
      </defs>

      {/* Cyber ambient glow backdrop */}
      <circle cx="256" cy="256" r="220" fill="url(#glowGrad)" />

      {/* ANATOMICAL HEART GROUP */}
      <g id="anatomical-heart" transform="translate(16, 25)">
        {/* Superior Vena Cava (Top Left tube) */}
        <path
          d="M200 120 C195 80, 225 80, 230 115 L225 150 L195 145 Z"
          fill="#991B1B"
          stroke="#000000"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* Aorta Arch (Top big central curved tube) */}
        <path
          d="M225 130 C220 60, 290 50, 310 110 L300 155 L245 145 Z"
          fill="#DC2626"
          stroke="#000000"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        {/* Three branch arteries on top of aorta */}
        <rect x="238" y="52" width="12" height="25" rx="4" fill="#B91C1C" stroke="#000000" strokeWidth="5" transform="rotate(-15, 238, 52)" />
        <rect x="263" y="44" width="14" height="28" rx="4" fill="#B91C1C" stroke="#000000" strokeWidth="5" />
        <rect x="290" y="49" width="12" height="25" rx="4" fill="#B91C1C" stroke="#000000" strokeWidth="5" transform="rotate(15, 290, 49)" />

        {/* Pulmonary Artery branch (Right curved tube branching behind) */}
        <path
          d="M285 135 C305 100, 345 110, 340 145 L320 160 Z"
          fill="#3B82F6"
          stroke="#000000"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Main muscular heart body silhouette */}
        <path
          d="M256 140 
             C120 145, 110 260, 155 330 
             C185 375, 230 420, 256 440 
             C282 420, 327 375, 357 330 
             C402 260, 392 145, 256 140 Z"
          fill="url(#heartGrad)"
          stroke="#000000"
          strokeWidth="8"
          strokeLinejoin="round"
        />

        {/* Left Atrium & Right Atrium muscle bulges details */}
        <path
          d="M165 190 C155 170, 205 155, 215 180"
          stroke="#000000"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M295 175 C310 155, 345 165, 335 190"
          stroke="#000000"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Anatomical shading/depth grooves (Left & Right Ventricle separations) */}
        <path
          d="M255 185 C240 230, 220 320, 260 415"
          stroke="#450A0A"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M255 185 C240 230, 220 320, 260 415"
          stroke="#1E1B4B"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="4 8"
          fill="none"
          opacity="0.4"
        />

        {/* Cyber veins flowing with glowing digital lines */}
        <path
          d="M175 240 Q210 260, 225 310"
          stroke="#00F2FE"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
          className="animate-pulse"
        />
        <path
          d="M175 240 Q210 260, 225 310"
          stroke="#22D3EE"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M335 230 Q290 270, 280 340"
          stroke="#F355DA"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          className="animate-pulse"
        />
        <path
          d="M335 230 Q290 270, 280 340"
          stroke="#F472B6"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M210 330 Q235 340, 240 380"
          stroke="#00F2FE"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* HEADPHONES SECTION (Layered over the background, hugging the heart sides) */}
      <g id="headphones" className="filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
        
        {/* Headphone arch/band (Top curved bar) */}
        <path
          d="M106 280 C95 105, 417 105, 406 280"
          stroke="#1E293B"
          strokeWidth="24"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M106 280 C95 105, 417 105, 406 280"
          stroke="url(#headphoneGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M140 180 C135 150, 377 150, 372 180"
          stroke="#0F172A"
          strokeWidth="5"
          fill="none"
          opacity="0.3"
        />

        {/* Headphone slider metallic adjusters */}
        <rect x="94" y="240" width="16" height="40" rx="3" fill="#94A3B8" stroke="#0F172A" strokeWidth="5" />
        <rect x="402" y="240" width="16" height="40" rx="3" fill="#94A3B8" stroke="#0F172A" strokeWidth="5" />

        {/* Left Ear Cup cushion (Dark grey/black back layer) */}
        <rect x="66" y="270" width="44" height="100" rx="22" fill="#0F172A" stroke="#000000" strokeWidth="6" />
        {/* Left Ear cup outer shell (Silver polished) */}
        <rect x="52" y="276" width="30" height="88" rx="15" fill="url(#headphoneGrad)" stroke="#0F172A" strokeWidth="4" />
        <rect x="60" y="295" width="8" height="50" rx="4" fill="#1E293B" opacity="0.5" />
        
        {/* Left Accent indicator (Glowing cyber blue/cyan bar) */}
        <rect x="44" y="305" width="5" height="30" rx="2" fill="#00F2FE" className="animate-pulse" />

        {/* Right Ear Cup cushion (Dark grey/black back layer) */}
        <rect x="402" y="270" width="44" height="100" rx="22" fill="#0F172A" stroke="#000000" strokeWidth="6" />
        {/* Right Ear cup outer shell (Silver polished) */}
        <rect x="430" y="276" width="30" height="88" rx="15" fill="url(#headphoneGrad)" stroke="#0F172A" strokeWidth="4" />
        <rect x="444" y="295" width="8" height="50" rx="4" fill="#1E293B" opacity="0.5" />

        {/* Right Accent indicator (Glowing hot magenta/pink bar) */}
        <rect x="463" y="305" width="5" height="30" rx="2" fill="#F355DA" className="animate-pulse" />

      </g>

      {/* Futuristic design grid overlays & ambient dots representing digital soul */}
      <circle cx="256" cy="190" r="3" fill="#00F2FE" />
      <circle cx="220" cy="220" r="2" fill="#F355DA" />
      <circle cx="290" cy="210" r="2" fill="#00F2FE" />
      <circle cx="256" cy="454" r="4" fill="#F355DA" />

    </svg>
  );
}
