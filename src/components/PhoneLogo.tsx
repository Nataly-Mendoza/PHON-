import React from 'react';

interface PhoneLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSlogan?: boolean;
  className?: string;
  isHighContrast?: boolean;
}

export const PhoneLogo: React.FC<PhoneLogoProps> = ({
  size = 'md',
  showText = true,
  showSlogan = false,
  className = '',
  isHighContrast = false,
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-20 h-20 rounded-3xl',
  }[size];

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }[size];

  const sloganSize = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Square icon with minimalist sound waves forming the 'P' of PHONÉ */}
      <div
        className={`${iconDimensions} flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 ${
          isHighContrast
            ? 'bg-black border-2 border-[#FFE500]'
            : 'bg-[#042C71] border border-blue-600/30'
        }`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5"
        >
          {/* Subtle acoustic sound wave arcs forming the letter P */}
          {/* Vertical stem of the P */}
          <rect
            x="11"
            y="9"
            width="6"
            height="30"
            rx="3"
            fill={isHighContrast ? '#FFE500' : '#FFFFFF'}
          />
          {/* Loop of P composed of 3 curved acoustic frequency waves */}
          <path
            d="M17 12H26C31.5228 12 36 16.0294 36 21C36 25.9706 31.5228 30 26 30H17"
            stroke={isHighContrast ? '#00E5FF' : '#38BDF8'}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M17 18H24C26.7614 18 29 19.3431 29 21C29 22.6569 26.7614 24 24 24H17"
            stroke={isHighContrast ? '#FFE500' : '#FFFFFF'}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Radiating soundwave pulse outside the P */}
          <path
            d="M38 15C40.5 17 41.5 19 41.5 21C41.5 23 40.5 25 38 27"
            stroke={isHighContrast ? '#FFE500' : '#60A5FA'}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-black tracking-tight ${textSize} ${
                isHighContrast ? 'text-[#FFE500]' : 'text-[#042C71]'
              }`}
            >
              PHONÉ
            </span>
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                isHighContrast
                  ? 'bg-neutral-800 text-[#00E5FF] border border-[#00E5FF]'
                  : 'bg-blue-100 text-[#042C71]'
              }`}
            >
              CAA
            </span>
          </div>
          {showSlogan && (
            <span
              className={`${sloganSize} font-bold tracking-normal ${
                isHighContrast ? 'text-white' : 'text-slate-900'
              }`}
            >
              «Tu voz, a tu manera»
            </span>
          )}
        </div>
      )}
    </div>
  );
};
