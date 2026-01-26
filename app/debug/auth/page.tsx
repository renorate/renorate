'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function DebugAuthPage() {
  const { data: session, status } = useSession()
  const [envVars, setEnvVars] = useState<string[]>([])
  const [hostname, setHostname] = useState<string>('')

  useEffect(() => {
    setHostname(window.location.hostname)
    
    // Check for required env vars (names only, never values)
    const requiredVars = [
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'DATABASE_URL',
    ]
    
    // In production, we can't access env vars from client
    // This is just for development debugging
    if (process.env.NODE_ENV === 'development') {
      setEnvVars(requiredVars)
    }
  }, [])

  // Only show in development or if authenticated
  if (process.env.NODE_ENV === 'production' && status !== 'authenticated') {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 border-2 border-red-400 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Access Denied</h1>
          <p className="text-red-700">This debug page is only available to authenticated users in production.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Auth Debug Page</h1>
        
        <div className="space-y-6">
          {/* Session Status */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Session Status</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-semibold">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status === 'authenticated' 
                    ? 'bg-green-100 text-green-800' 
                    : status === 'loading'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {status}
                </span>
              </div>
              {session?.user && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">User ID:</span>
                    <span className="text-gray-700">{session.user.id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">Email:</span>
                    <span className="text-gray-700">{session.user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">Name:</span>
                    <span className="text-gray-700">{session.user.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">Role:</span>
                    <span className="text-gray-700">{session.user.role}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Environment Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Environment Info</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-semibold">Hostname:</span>
                <span className="text-gray-700">{hostname}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">Protocol:</span>
                <span className="text-gray-700">{typeof window !== 'undefined' ? window.location.protocol : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">NODE_ENV:</span>
                <span className="text-gray-700">{process.env.NODE_ENV}</span>
              </div>
            </div>
          </div>

          {/* Required Environment Variables */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Required Environment Variables</h2>
            <p className="text-sm text-gray-600 mb-3">
              These environment variables should be set in your production environment:
            </p>
            <ul className="list-disc list-inside space-y-1">
              {envVars.map((varName) => (
                <li key={varName} className="text-gray-700 font-mono text-sm">
                  {varName}
                </li>
              ))}
            </ul>
            {envVars.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                Environment variable names are only shown in development mode.
              </p>
            )}
          </div>

          {/* Cookie Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cookie Information</h2>
            <p className="text-sm text-gray-600 mb-2">
              Check your browser's developer tools (Application → Cookies) to verify:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Session cookie is set</li>
              <li>Cookie domain matches your site domain</li>
              <li>Secure flag is set (in production)</li>
              <li>SameSite attribute is configured correctly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
