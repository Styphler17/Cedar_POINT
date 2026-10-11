import React from 'react';
import { ArrowRight } from '@phosphor-icons/react';

export interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'dribbble' | 'dark' | 'secondary' | 'outline' | 'accent' | 'cart';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'right' | 'left';
  rotateIconOnHover?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * BrandButton - Micro-interaction inspired by Dribbble:
 * https://cdn.dribbble.com/userupload/48867638/file/aa7d290f6217f4698a227eee73459860.mp4
 * 
 * Features:
 * - Rounded pill silhouette with dedicated tactile accent circle/badge
 * - On hover: accent circle rapidly expands across the pill from right to left,
 *   flooding the button background with vibrant color
 * - Text color flips cleanly with high contrast
 * - Icon rotates (e.g. 0° -> -45° or 45°) with an elastic micro-glide
 * - Satisfying tactile click press (active:scale-[0.98])
 */
export const BrandButton: React.FC<BrandButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  rotateIconOnHover = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  // Sizing definitions with perfectly aligned padding and circle coordinates
  const sizeConfig = {
    sm: {
      button: iconPosition === 'right' ? 'h-9 pl-3.5 pr-1.5 text-xs' : 'h-9 pr-3.5 pl-1.5 text-xs',
      circle: 'w-6 h-6',
      iconPositionClass: iconPosition === 'right' ? 'right-1.5' : 'left-1.5',
      iconSize: 'w-3.5 h-3.5',
      gap: 'gap-2',
    },
    md: {
      button: iconPosition === 'right' ? 'h-11 sm:h-12 pl-5 pr-1.5 sm:pl-6 sm:pr-2 text-xs sm:text-sm' : 'h-11 sm:h-12 pr-5 pl-1.5 sm:pr-6 sm:pl-2 text-xs sm:text-sm',
      circle: 'w-8 h-8 sm:w-9 sm:h-9',
      iconPositionClass: iconPosition === 'right' ? 'right-1.5 sm:right-2' : 'left-1.5 sm:left-2',
      iconSize: 'w-4 h-4',
      gap: 'gap-3',
    },
    lg: {
      button: iconPosition === 'right' ? 'h-13 sm:h-14 pl-6 pr-2 sm:pl-7 sm:pr-2.5 text-sm sm:text-base' : 'h-13 sm:h-14 pr-6 pl-2 sm:pr-7 sm:pl-2.5 text-sm sm:text-base',
      circle: 'w-9 h-9 sm:w-10 sm:h-10',
      iconPositionClass: iconPosition === 'right' ? 'right-2 sm:right-2.5' : 'left-2 sm:left-2.5',
      iconSize: 'w-4 h-4 sm:w-5 sm:h-5',
      gap: 'gap-3.5',
    },
  }[size];

  // Variant color definitions
  // Matches Cedar Point Chemist emerald branding with Dribbble-style expanding pill
  const variantStyles = {
    // Primary: Cedar Emerald (#007A33) pill with Botanical Mint / Sunlight accent expanding
    primary: {
      base: 'bg-[#007A33] text-white border border-[#006028] shadow-sm hover:shadow-md',
      bubble: 'bg-[#E6F4EA]',
      icon: 'text-[#007A33] group-hover:text-[#004D21] group-focus-visible:text-[#004D21]',
      hoverText: 'group-hover:text-[#004D21] group-focus-visible:text-[#004D21]',
    },
    // Dribbble: Exact 1:1 match to the reference video (Charcoal pill + sunny yellow #F9E65B expanding fill)
    dribbble: {
      base: 'bg-[#14181B] text-white border border-gray-900 shadow-sm hover:shadow-md',
      bubble: 'bg-[#F9E65B]',
      icon: 'text-[#14181B] group-hover:text-[#14181B] group-focus-visible:text-[#14181B]',
      hoverText: 'group-hover:text-[#14181B] group-focus-visible:text-[#14181B]',
    },
    // Dark: Sleek Charcoal/Black pill with Sunny Gold (#F9E65B) accent from the Dribbble video
    dark: {
      base: 'bg-[#14181B] text-white border border-gray-800 shadow-sm hover:shadow-md',
      bubble: 'bg-[#F9E65B]',
      icon: 'text-[#14181B] group-hover:text-[#14181B] group-focus-visible:text-[#14181B]',
      hoverText: 'group-hover:text-[#14181B] group-focus-visible:text-[#14181B]',
    },
    // Accent: Botanical Light Pill with Deep Emerald flooding
    accent: {
      base: 'bg-[#E6F4EA] text-[#007A33] border border-emerald-200 shadow-xs hover:shadow-sm',
      bubble: 'bg-[#007A33]',
      icon: 'text-white group-hover:text-white group-focus-visible:text-white',
      hoverText: 'group-hover:text-white group-focus-visible:text-white',
    },
    // Outline: Clean White Pill with Emerald flooding
    outline: {
      base: 'bg-white text-gray-800 border border-gray-200 hover:border-emerald-600 shadow-xs',
      bubble: 'bg-emerald-50 border border-emerald-100',
      icon: 'text-[#007A33] group-hover:text-emerald-950 group-focus-visible:text-emerald-950',
      hoverText: 'group-hover:text-emerald-950 group-focus-visible:text-emerald-950',
    },
    // Secondary: Soft Slate Pill with Emerald accent
    secondary: {
      base: 'bg-gray-100 text-gray-800 border border-gray-200 hover:border-gray-300',
      bubble: 'bg-white shadow-xs',
      icon: 'text-gray-800 group-hover:text-gray-900 group-focus-visible:text-gray-900',
      hoverText: 'group-hover:text-gray-900 group-focus-visible:text-gray-900',
    },
    // Cart: Vibrant dispensary action
    cart: {
      base: 'bg-[#007A33] text-white border border-emerald-700 shadow-sm hover:shadow-md',
      bubble: 'bg-white',
      icon: 'text-[#007A33] group-hover:text-[#004D21] group-focus-visible:text-[#004D21]',
      hoverText: 'group-hover:text-[#004D21] group-focus-visible:text-[#004D21]',
    },
  }[variant];

  const defaultIcon = <ArrowRight className={sizeConfig.iconSize} aria-hidden="true" />;
  const resolvedIcon = icon || defaultIcon;

  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        group relative inline-flex items-center justify-between
        rounded-full font-bold select-none overflow-hidden
        transition-all duration-300 ease-out cursor-pointer
        active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${sizeConfig.button}
        ${sizeConfig.gap}
        ${variantStyles.base}
        ${disabled ? 'opacity-50 cursor-not-allowed active:scale-100' : ''}
        ${className}
      `}
    >
      {/* 
        THE SINGLE DEDICATED ACCENT CIRCLE & EXPANDING BUBBLE:
        In resting state, this is the ONE and ONLY circle visible behind the icon.
        On hover/focus, it scales out radially from its center to flood the entire button!
      */}
      <span
        aria-hidden="true"
        className={`
          absolute pointer-events-none rounded-full top-1/2 -translate-y-1/2
          transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${sizeConfig.iconPositionClass}
          ${sizeConfig.circle}
          ${variantStyles.bubble}
          ${disabled ? '' : 'group-hover:scale-[38] sm:group-hover:scale-[44] group-focus-visible:scale-[44]'}
          z-0
        `}
      />

      {/* Optional Leading Icon (Transparent container directly over the single circle) */}
      {iconPosition === 'left' && (
        <span
          className={`
            relative z-10 flex items-center justify-center shrink-0 bg-transparent
            transition-all duration-300 ease-out
            ${sizeConfig.circle}
            ${variantStyles.icon}
            ${rotateIconOnHover ? 'group-hover:-rotate-45' : 'group-hover:-translate-x-1'}
          `}
        >
          {resolvedIcon}
        </span>
      )}

      {/* Button Text Label */}
      <span
        className={`
          relative z-10 transition-colors duration-300 ease-out tracking-normal truncate
          ${variantStyles.hoverText}
        `}
      >
        {children}
      </span>

      {/* Trailing Icon (Transparent container directly over the single circle) */}
      {iconPosition === 'right' && (
        <span
          className={`
            relative z-10 flex items-center justify-center shrink-0 bg-transparent
            transition-all duration-300 ease-out
            ${sizeConfig.circle}
            ${variantStyles.icon}
            ${rotateIconOnHover ? 'group-hover:-rotate-45 group-hover:translate-x-1' : 'group-hover:translate-x-1 sm:group-hover:translate-x-1.5'}
          `}
        >
          {resolvedIcon}
        </span>
      )}
    </button>
  );
};
