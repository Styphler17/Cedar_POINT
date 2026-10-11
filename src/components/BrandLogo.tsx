import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  inverted?: boolean;
  mobileCompact?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  inverted = false,
  mobileCompact = false,
}) => {
  // Height mappings
  const heightClass =
    size === 'sm'
      ? 'h-7 sm:h-8'
      : size === 'md'
      ? 'h-[2.125rem] sm:h-11'
      : size === 'lg'
      ? 'h-10 sm:h-14'
      : 'h-14 sm:h-20';

  // Colors based on inverted state
  const cArcColor = inverted ? '#CBD5E1' : '#737981';
  const pointTextColor = inverted ? '#FFFFFF' : '#18181B';
  const greenDotColor = '#00A859';
  const mainTextColor = inverted ? '#FFFFFF' : '#111827';
  const subtitleColor = inverted ? '#E2E8F0' : '#111827';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* 
        Official Cedar Point Chemist Ltd Vector Logo
        Faithfully replicating the emblem:
        - Outer circular C arc in slate gray
        - "POINT" inside in heavy bold with vivid green core inside 'O'
        - "Cedar Point" and "Chemist Ltd" on two stacked lines
      */}
      <svg
        viewBox={showText && !mobileCompact ? '0 0 280 72' : '0 0 72 72'}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heightClass} w-auto transition-transform`}
        aria-label="Cedar Point Chemist Ltd"
        role="img"
      >
        {/* Emblem Group: Center at (36, 36) */}
        <g id="emblem">
          {/* Circular C Arc: Outer R=32, Inner R=22, Open gap on right side from -35deg to +35deg */}
          <path
            d="M 61.2 17.6 A 32 32 0 1 0 61.2 54.4 L 53.0 48.6 A 22 22 0 1 1 53.0 23.4 Z"
            fill={cArcColor}
          />

          {/* Letter P */}
          <path
            d="M 17 29 H 22.8 C 25.2 29 26.8 30.2 26.8 32.2 C 26.8 34.2 25.2 35.4 22.8 35.4 H 19.5 V 43 H 17 V 29 Z M 19.5 31.2 V 33.2 H 22.4 C 23.6 33.2 24.3 32.7 24.3 32.2 C 24.3 31.7 23.6 31.2 22.4 31.2 H 19.5 Z"
            fill={pointTextColor}
          />

          {/* Letter O Outer Ring */}
          <path
            d="M 33 28.5 C 37.2 28.5 40.2 31.6 40.2 36 C 40.2 40.4 37.2 43.5 33 43.5 C 28.8 43.5 25.8 40.4 25.8 36 C 25.8 31.6 28.8 28.5 33 28.5 Z M 33 31 C 30.5 31 28.5 33.1 28.5 36 C 28.5 38.9 30.5 41 33 41 C 35.5 41 37.5 38.9 37.5 36 C 37.5 33.1 35.5 31 33 31 Z"
            fill={pointTextColor}
          />

          {/* Green Solid Circle inside 'O' */}
          <circle cx="33" cy="36" r="3.7" fill={greenDotColor} />

          {/* Letter I */}
          <rect x="41.5" y="29" width="2.4" height="14" rx="0.5" fill={pointTextColor} />

          {/* Letter N */}
          <path
            d="M 45.5 29 H 47.8 L 51.7 39.5 V 29 H 53.8 V 43 H 51.6 L 47.7 32.5 V 43 H 45.5 V 29 Z"
            fill={pointTextColor}
          />

          {/* Letter T */}
          <path
            d="M 54.5 29 H 61.5 V 31.2 H 59.2 V 43 H 56.8 V 31.2 H 54.5 V 29 Z"
            fill={pointTextColor}
          />
        </g>

        {/* Text Group: Cedar Point / Chemist Ltd (Shown on Desktop/Full Mode) */}
        {showText && !mobileCompact && (
          <g id="brand-text">
            {/* Cedar Point */}
            <text
              x="78"
              y="33"
              fontFamily="'Manrope', 'DM Sans', system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="24"
              letterSpacing="-0.5"
              fill={mainTextColor}
            >
              Cedar Point
            </text>

            {/* Chemist Ltd */}
            <text
              x="78"
              y="58"
              fontFamily="'Manrope', 'DM Sans', system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="24"
              letterSpacing="-0.5"
              fill={subtitleColor}
            >
              Chemist Ltd
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
