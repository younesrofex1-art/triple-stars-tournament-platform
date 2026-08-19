import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  linkTo?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  linkTo = '/',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size];

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  const subtitleSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[11px]',
    xl: 'text-xs',
  }[size];

  const logoContent = (
    <div className={`flex items-center space-x-2.5 sm:space-x-3 group select-none ${className}`}>
      {/* Precision Geometric Esports Tri-Star Crest */}
      <div className={`${iconDimensions} relative flex-shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(255,85,0,0.35)] transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Ember Metallic Gradient */}
            <linearGradient id="tsStarGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7A00" />
              <stop offset="60%" stopColor="#FF4500" />
              <stop offset="100%" stopColor="#D82B00" />
            </linearGradient>

            <linearGradient id="tsStarGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFB800" />
              <stop offset="100%" stopColor="#FF5500" />
            </linearGradient>

            <linearGradient id="tsFrameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2A2B32" />
              <stop offset="100%" stopColor="#121318" />
            </linearGradient>

            {/* Neon Glow Filter */}
            <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Hexagonal Shield Background */}
          <polygon
            points="50,4 92,25 92,75 50,96 8,75 8,25"
            fill="url(#tsFrameGradient)"
            stroke="#FF5500"
            strokeWidth="2.5"
            strokeOpacity="0.4"
          />

          {/* Inner Sharp Tech Border */}
          <polygon
            points="50,12 84,29 84,71 50,88 16,71 16,29"
            fill="#0F1015"
            stroke="#2E303B"
            strokeWidth="1.5"
          />

          {/* Star 1: Left Wing Star */}
          <polygon
            points="32,48 37,36 49,42 41,52 44,65 33,56 22,65 26,51 16,42 29,36"
            fill="url(#tsStarGradient2)"
            opacity="0.85"
          />

          {/* Star 2: Right Wing Star */}
          <polygon
            points="68,48 73,36 85,42 77,52 80,65 69,56 58,65 62,51 52,42 65,36"
            fill="url(#tsStarGradient2)"
            opacity="0.85"
          />

          {/* Star 3: Apex Dominant Star */}
          <polygon
            points="50,18 57,34 74,34 60,45 65,62 50,51 35,62 40,45 26,34 43,34"
            fill="url(#tsStarGradient1)"
            stroke="#FFF"
            strokeWidth="1.2"
            strokeOpacity="0.8"
            filter="url(#starGlow)"
          />

          {/* Futuristic Center Apex Star Diamond Core */}
          <polygon points="50,28 54,39 50,50 46,39" fill="#FFF" opacity="0.9" />

          {/* Circuit Tech Accent Ticks */}
          <line x1="50" y1="4" x2="50" y2="12" stroke="#FF5500" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="88" x2="50" y2="96" stroke="#FF5500" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div>
        <div className="flex items-center space-x-1.5 leading-none">
          <span
            className={`font-display font-black tracking-wider text-white uppercase group-hover:text-brand-orange transition-colors ${titleSizes}`}
          >
            TRIPLE STARS
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand-dark/40 text-brand-orange border border-brand-orange/40 font-black">
            PRO
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-gray-400 font-mono tracking-widest block uppercase font-bold mt-0.5 ${subtitleSizes}`}
          >
            Esports Tournament Circuit
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{logoContent}</Link>;
  }

  return logoContent;
};
