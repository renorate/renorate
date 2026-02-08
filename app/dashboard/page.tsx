'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface EstimateSummary {
  id: string
  projectType: string
  totalAmount: number
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [estimates, setEstimates] = useState<EstimateSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/estimates')
      .then((res) => (res.ok ? res.json() : { estimates: [] }))
      .then((data) => {
        setEstimates(data.estimates || [])
      })
      .catch(() => setEstimates([]))
      .finally(() => setLoading(false))
  }, [status])

  if (status === 'loading' || status === 'unauthenticated') {
    if (status === 'unauthenticated') {
      return (
        <div className="max-w-xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-6">You must be signed in to view your dashboard.</p>
          <Link
            href="/portal"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-6 rounded-lg"
          >
            Go to portal
          </Link>
        </div>
      )
    }
    return (
      <div className="max-w-xl mx-auto p-8 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Your saved estimates and clients.</p>

      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/estimate"
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-5 rounded-lg"
        >
          Quick Estimate
        </Link>
        <Link
          href="/estimate/new"
          className="border border-teal-600 text-teal-700 hover:bg-teal-50 font-semibold py-2.5 px-5 rounded-lg"
        >
          New estimate (with client)
        </Link>
      </div>

      <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Saved estimates</h2>
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : estimates.length === 0 ? (
          <p className="text-gray-500">No saved estimates yet. Create one from Quick Estimate or New estimate.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {estimates.map((est) => (
              <li key={est.id} className="py-3 first:pt-0">
                <Link href={`/estimate/${est.id}`} className="flex justify-between items-center hover:bg-gray-50 rounded px-2 py-1 -mx-2">
                  <span className="font-medium text-gray-900">{est.projectType}</span>
                  <span className="text-gray-600">${est.totalAmount?.toFixed(2) ?? '0.00'}</span>
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(est.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Clients</h2>
        <p className="text-gray-500 mb-3">Manage clients and attach estimates.</p>
        <Link href="/portal/contractor/dashboard" className="text-teal-600 hover:underline font-medium">
          Open contractor portal →
        </Link>
      </section>

      <div className="mt-8">
        <Link href="/" className="text-teal-600 hover:underline">← Back to home</Link>
      </div>
    </div>
  )
}
