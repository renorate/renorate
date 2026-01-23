'use client'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  showTagline?: boolean
  variant?: 'dark' | 'light'
  className?: string
}

export default function Logo({ size = 'medium', showTagline = true, variant = 'dark', className = '' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-teal-800'
  const taglineColor = variant === 'light' ? 'text-teal-100' : 'text-teal-700'
  // Dark teal/blue for house outline and text
  const iconStrokeColor = variant === 'light' ? '#ECFEFF' : '#0F766E'
  // Bright teal/turquoise for checkmark
  const checkmarkColor = variant === 'light' ? '#67E8F9' : '#14B8A6'
  
  const sizeClasses = {
    small: 'h-12',
    medium: 'h-16',
    large: 'h-24',
  }

  const textSizes = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-4xl',
  }

  const taglineSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-lg',
  }

  const iconSizes = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Logo Icon - House with checkmark */}
      <div className={`${iconSizes[size]} flex-shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* House outline - dark teal/blue (abstract, document-like with pointed roof) */}
          <path
            d="M 20 25 L 20 70 L 50 85 L 80 70 L 80 25 L 50 10 Z"
            stroke={iconStrokeColor}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Three horizontal lines inside LEFT wall (document/list) - stacked vertically */}
          <line x1="25" y1="40" x2="35" y2="40" stroke={iconStrokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="25" y1="48" x2="35" y2="48" stroke={iconStrokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="25" y1="56" x2="35" y2="56" stroke={iconStrokeColor} strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Checkmark - bright teal/turquoise, starting from lower-left, extending up and right, beyond roof */}
          <path
            d="M 28 62 L 42 72 L 78 28"
            stroke={checkmarkColor}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Name and Tagline */}
      <div className="flex flex-col">
        <h1 className={`${textSizes[size]} font-black ${textColor} leading-tight tracking-tight`}>
          RenoRate
        </h1>
        {showTagline && (
          <p className={`${taglineSizes[size]} font-medium ${taglineColor} mt-1 leading-tight`}>
            See the Rate Before You Renovate.
          </p>
        )}
      </div>
    </div>
  )
}
