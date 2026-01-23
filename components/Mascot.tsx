'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface MascotProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  animated?: boolean
  variant?: 'fullbody' | 'bust'
  pose?: 'crossed' | 'thumbsup'
  className?: string
}

export default function Mascot({ 
  size = 'medium', 
  animated = false,
  variant = 'bust',
  pose = 'crossed',
  className = '' 
}: MascotProps) {
  const mascotRef = useRef<HTMLDivElement>(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (!animated || !mascotRef.current) return

    const interval = setInterval(() => {
      if (mascotRef.current) {
        mascotRef.current.style.animation = 'none'
        setTimeout(() => {
          if (mascotRef.current) {
            mascotRef.current.style.animation = 'pulse 2s ease-in-out infinite'
          }
        }, 10)
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [animated])

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
    xlarge: 'w-64 h-64',
  }

  const animationClass = animated ? 'animate-pulse-slow' : ''

  // Use the actual mascot PNG image - try standard path first, then fallback
  const mascotImagePath = imageError 
    ? '/mascot.png/CE02BF07-404E-4C4D-B7C9-ECDAD1D2DF14.png'
    : '/mascot-image.png'

  return (
    <div
      ref={mascotRef}
      className={`${sizeClasses[size]} ${animationClass} ${className} relative flex items-center justify-center`}
    >
      <Image
        src={mascotImagePath}
        alt="RenoRhino Mascot - Inspector Rhino"
        width={400}
        height={500}
        className="w-full h-full object-contain"
        priority={size === 'large' || size === 'xlarge'}
        unoptimized
        onError={() => {
          if (!imageError) {
            setImageError(true)
          }
        }}
      />
    </div>
  )
}
