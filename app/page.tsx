import Link from 'next/link'
import Image from 'next/image'
import { FiFileText, FiList, FiZap, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import Mascot from '@/components/Mascot'
import Logo from '@/components/Logo'

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Under Construction / Beta Notice */}
      <div className="mb-8">
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 md:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-amber-600 text-xl flex-shrink-0">🚧</span>
              <p className="text-amber-800 text-sm md:text-base font-medium leading-relaxed">
                RenoRate is currently under construction. We're actively building and rolling out features—check back soon as more tools go live.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 sm:ml-4">
              <a
                href="mailto:contact@renorate.net"
                className="text-amber-700 hover:text-amber-900 text-sm font-semibold underline underline-offset-2 transition-colors whitespace-nowrap"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Professional Layout */}
      <div className="mb-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left side - Text */}
            <div className="flex-1">
              <div className="mb-8">
                <Logo size="large" showTagline={true} variant="dark" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Transparent Renovation Pricing
              </h1>
              <p className="text-xl text-gray-600 mb-6 font-medium">
                The industry standard for transparent renovation pricing, standardized estimates, and clear project scope—so decisions are made before construction begins.
              </p>
              <p className="text-lg text-gray-500 mb-8">
                Built for serious professionals who demand accuracy, accountability, and results.
              </p>
              <Link
                href="/portal"
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold shadow-sm transition-colors"
              >
                Access Portal <FiArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            {/* Right side - Professional Mascot */}
            <div className="flex-shrink-0">
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <Mascot size="large" animated={false} />
                <div className="mt-6 text-center">
                  <p className="text-sm font-semibold text-gray-700 mb-1">RenoRhino</p>
                  <p className="text-xs text-gray-500">Pricing Transparency</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="mb-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Left side - Text */}
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Most homeowners sign renovation contracts worth tens of thousands of dollars with less pricing context than they get when buying a used car—and with no independent risk check. RenoRate helps stop bad deals before they happen by providing a neutral pricing benchmark, without reviews, rankings, or contractor bashing.
              </p>
            </div>
            
            {/* Right side - Mascot Image */}
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                <Image
                  src="/brand/mascot.png"
                  alt="RenoRhino Mascot"
                  width={400}
                  height={400}
                  className="w-full h-full object-contain"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portal Access */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Link
          href="/portal/homeowner/login"
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-8 group"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
              <FiFileText className="w-6 h-6 text-teal-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Homeowner Portal</h2>
              <p className="text-gray-600 leading-relaxed">
                Get standardized pricing estimates, understand project scope, and make informed decisions with transparent cost breakdowns before you commit.
              </p>
            </div>
          </div>
          <div className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700">
            Login or Register <FiArrowRight className="ml-2 w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/portal/contractor/login"
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-8 group"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
              <FiList className="w-6 h-6 text-teal-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contractor Portal</h2>
              <p className="text-gray-600 leading-relaxed">
                Manage project inquiries, create professional estimates, track timelines and budgets, and communicate securely with clients.
              </p>
            </div>
          </div>
          <div className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700">
            Login or Register <FiArrowRight className="ml-2 w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-teal-50 rounded-lg">
            <FiZap className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            Enterprise-Grade Features
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors">
            <div className="p-2 bg-teal-600 rounded-lg flex-shrink-0">
              <FiCheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Standardized Pricing Benchmarks</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Compare estimates against industry-standard pricing data. Know what's fair before you sign any contract.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors">
            <div className="p-2 bg-teal-600 rounded-lg flex-shrink-0">
              <FiCheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Detailed Cost Breakdowns</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Comprehensive estimates with line-item details for labor, materials, permits, and disposal costs.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors">
            <div className="p-2 bg-teal-600 rounded-lg flex-shrink-0">
              <FiCheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Clear Project Documentation</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Detailed project scope and estimate documentation. Track changes and maintain clear records throughout your renovation.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors">
            <div className="p-2 bg-teal-600 rounded-lg flex-shrink-0">
              <FiCheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Financial Transparency</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Real-time tracking of deposits, payments, and remaining balances. Full audit trail for all transactions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Trust Section */}
      <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <Mascot size="medium" animated={false} />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Pricing Clarity by RenoRhino</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              RenoRate provides independent pricing benchmarks and standardized estimates. 
              RenoRhino helps you understand fair market pricing before you commit to any renovation contract.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div>
                <p className="font-semibold text-gray-700">Pricing Benchmarks</p>
                <p>Industry-Standard Data</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Transparent Estimates</p>
                <p>Clear Cost Breakdowns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
