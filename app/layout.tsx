import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import SessionProvider from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RenoRate - See the Rate Before You Renovate',
  description: 'The industry standard for transparent renovation pricing, standardized estimates, and clear project scope—so decisions are made before construction begins.',
  metadataBase: new URL('https://renorate.net'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'RenoRate - See the Rate Before You Renovate',
    description: 'The industry standard for transparent renovation pricing, standardized estimates, and clear project scope—so decisions are made before construction begins.',
    url: 'https://renorate.net',
    siteName: 'RenoRate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RenoRate - See the Rate Before You Renovate',
    description: 'The industry standard for transparent renovation pricing, standardized estimates, and clear project scope.',
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
        <SessionProvider>
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
