import Link from 'next/link'
import { FiHome, FiTool } from 'react-icons/fi'
import Logo from '@/components/Logo'
import Mascot from '@/components/Mascot'

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <Logo size="large" showTagline={true} variant="dark" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            RenoRate Professional Platform
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto">
            The industry standard for transparent renovation pricing, standardized estimates, and clear project scope—so decisions are made before construction begins.
          </p>
        </div>

        {/* Portal Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Homeowner Portal */}
          <Link
            href="/portal/homeowner/login"
            className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-10"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                <FiHome className="w-8 h-8 text-teal-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Homeowner Portal
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Get standardized pricing estimates, understand project scope, and make informed decisions with transparent cost breakdowns.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Compare estimates against pricing benchmarks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Receive detailed, standardized estimates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Track project scope and cost breakdowns</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Document project details and estimates</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-teal-600 font-semibold">Login or Register</span>
                <span className="text-gray-400 group-hover:text-teal-600 transition-colors">→</span>
              </div>
            </div>
          </Link>

          {/* Contractor Portal */}
          <Link
            href="/portal/contractor/login"
            className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-10"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                <FiTool className="w-8 h-8 text-teal-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Contractor Portal
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Create standardized professional estimates, track project documentation, and maintain clear cost breakdowns for your clients.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Create detailed, standardized estimates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Generate professional PDF estimates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Track project scope and documentation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Maintain estimate history and records</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-teal-600 font-semibold">Login or Register</span>
                <span className="text-gray-400 group-hover:text-teal-600 transition-colors">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Professional Trust Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <Mascot size="medium" animated={false} />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Pricing Transparency Program</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                RenoRate provides independent pricing benchmarks and standardized estimate formats. 
                RenoRhino ensures you have clear, comparable pricing data before making renovation decisions.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Pricing Benchmarks</p>
                  <p className="text-gray-500">Industry-standard pricing data and comparisons</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Standardized Estimates</p>
                  <p className="text-gray-500">Consistent format for easy comparison and evaluation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Platform Overview
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-teal-600 text-white rounded-lg flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Account Setup</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Register as a homeowner or contractor. Access tools for creating and comparing standardized renovation estimates.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-teal-600 text-white rounded-lg flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Estimate Creation</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Contractors create standardized estimates with detailed cost breakdowns. Homeowners receive clear, comparable pricing information.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-teal-600 text-white rounded-lg flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Estimate Documentation</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Track estimate details, maintain project scope documentation, and keep clear records of pricing and project information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
