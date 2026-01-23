import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const PROJECT_TYPES = [
  'Roofing',
  'Bathroom',
  'Kitchen',
  'Flooring',
  'Paint',
  'Drywall',
  'Deck',
  'Windows',
  'Siding',
  'HVAC',
  'Electrical',
  'Plumbing',
] as const

export type ProjectType = typeof PROJECT_TYPES[number]

export const UNITS = ['sqft', 'linear ft', 'each'] as const

export type Unit = typeof UNITS[number]
