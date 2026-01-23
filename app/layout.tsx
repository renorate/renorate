import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RenoRate - See the Rate Before You Renovate',
  description: 'Professional contractor renovation estimating tool. Connect verified contractors with homeowners for transparent project management.',
  metadataBase: new URL('https://renorate.net'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'RenoRate - See the Rate Before You Renovate',
    description: 'The industry standard for connecting verified contractors with homeowners. Transparent project management and secure communications.',
    url: 'https://renorate.net',
    siteName: 'RenoRate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RenoRate - See the Rate Before You Renovate',
    description: 'Professional renovation estimating platform connecting verified contractors with homeowners.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}
