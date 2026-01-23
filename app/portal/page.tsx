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
            Industry-leading platform connecting verified contractors with homeowners. 
            Comprehensive project management, transparent pricing, and secure communications.
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
                  Access verified contractors, receive detailed estimates, and manage your renovation projects with complete transparency.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Browse verified contractor network</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Receive multiple professional estimates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Track project progress and budgets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Secure project communication</span>
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
                  Manage project inquiries, create professional estimates, and track multiple projects with comprehensive tools.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Receive qualified project inquiries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Create detailed professional estimates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Track project timelines and milestones</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-600 font-semibold">•</span>
                    <span>Manage payments and invoices</span>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Quality Assurance Program</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Every project on RenoRate is monitored and verified by our RenoRhino quality assurance program. 
                We ensure all work meets industry standards, contractual obligations, and regulatory compliance.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Verified Professionals</p>
                  <p className="text-gray-500">Background checks and credential verification</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Project Monitoring</p>
                  <p className="text-gray-500">Ongoing quality oversight throughout project lifecycle</p>
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
                Register as a homeowner or contractor. Complete verification process to ensure platform security and quality.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-teal-600 text-white rounded-lg flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Project Connection</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Homeowners post projects and receive contractor proposals. Contractors review inquiries and submit detailed estimates.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-teal-600 text-white rounded-lg flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Project Management</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Collaborate on timelines, track budgets and payments, communicate securely, and monitor project milestones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
