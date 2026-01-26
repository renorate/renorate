'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiStar, FiCheckCircle, FiMail, FiPhone } from 'react-icons/fi'
import Mascot from '@/components/Mascot'

interface Contractor {
  id: string
  user: {
    id: string
    name: string
    email: string
    phone: string | null
  }
  companyName: string | null
  licenseNumber: string | null
  isVerified: boolean
  rating: number
  reviewCount: number
  bio: string | null
  specialties: string | null
}

export default function ContractorsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/portal/homeowner/login')
      return
    }
    setUser(JSON.parse(userData))
    fetchContractors()
  }, [router])

  const fetchContractors = async () => {
    try {
      const response = await fetch('/api/contractors')
      const data = await response.json()
      if (data.success) {
        setContractors(data.contractors)
      }
    } catch (error) {
      console.error('Error fetching contractors:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-6 mb-6">
          <Mascot size="medium" animated={false} />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Estimate Providers</h1>
            <p className="text-gray-600">Contractors who can provide standardized estimates</p>
          </div>
        </div>
      </div>

      {contractors.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No estimate providers available</h2>
          <p className="text-gray-600">Check back later for contractors who can provide estimates.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contractors.map((contractor) => (
            <div
              key={contractor.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {contractor.companyName || contractor.user.name}
                    </h3>
                    {contractor.isVerified && (
                      <FiCheckCircle className="w-5 h-5 text-teal-600" title="Verified" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{contractor.user.name}</p>
                </div>
              </div>

              {contractor.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(contractor.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {contractor.rating.toFixed(1)} ({contractor.reviewCount} reviews)
                  </span>
                </div>
              )}

              {contractor.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{contractor.bio}</p>
              )}

              {contractor.specialties && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(contractor.specialties).slice(0, 3).map((specialty: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-4">
                {contractor.user.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMail className="w-4 h-4" />
                    <span>{contractor.user.email}</span>
                  </div>
                )}
                {contractor.user.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiPhone className="w-4 h-4" />
                    <span>{contractor.user.phone}</span>
                  </div>
                )}
                {contractor.licenseNumber && (
                  <div className="text-xs text-gray-500">
                    License: {contractor.licenseNumber}
                  </div>
                )}
              </div>

              <Link
                href={`/portal/homeowner/contractors/${contractor.id}`}
                className="block w-full bg-teal-600 hover:bg-teal-700 text-white text-center px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
