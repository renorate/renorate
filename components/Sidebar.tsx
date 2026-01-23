'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiFileText, FiList, FiSettings } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import Mascot from './Mascot'
import Logo from './Logo'

const navigation = [
  { name: 'Home', href: '/', icon: FiHome },
  { name: 'New Estimate', href: '/estimate/new', icon: FiFileText },
  { name: 'Saved Estimates', href: '/estimates', icon: FiList },
  { name: 'Settings', href: '/settings', icon: FiSettings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-shrink-0">
            <Mascot size="small" animated={false} variant="fullbody" pose="crossed" />
          </div>
          <div className="flex-1">
            <Logo size="small" showTagline={false} variant="dark" />
          </div>
        </div>
        <p className="text-xs text-gray-500 font-medium mt-2 pl-2">
          See the Rate Before You Renovate.
        </p>
      </div>
      
      <nav className="p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors',
                isActive
                  ? 'bg-teal-50 text-teal-700 font-semibold border-l-4 border-teal-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Professional footer with mascot */}
      <div className="absolute bottom-6 left-0 right-0 px-6">
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-3">
            <Mascot size="small" animated={false} />
            <div>
              <p className="text-xs font-semibold text-gray-700">RenoRhino</p>
              <p className="text-xs text-gray-500">Verified Projects</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
