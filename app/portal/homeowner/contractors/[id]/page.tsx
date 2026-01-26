'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiStar, FiCheckCircle, FiMail, FiPhone, FiFileText } from 'react-icons/fi'
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
  yearsExperience: number | null
}

export default function ContractorProfilePage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<any>(null)
  const [contractor, setContractor] = useState<Contractor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/portal/homeowner/login')
      return
    }
    setUser(JSON.parse(userData))
    fetchContractor()
  }, [params.id])

  const fetchContractor = async () => {
    try {
      const response = await fetch(`/api/contractors/${params.id}`)
      const data = await response.json()
      if (data.success) {
        setContractor(data.contractor)
      }
    } catch (error) {
      console.error('Error fetching contractor:', error)
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

  if (!contractor || !user) return null

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Estimate Providers
        </button>
        <div className="flex items-center gap-6 mb-6">
          <Mascot size="medium" animated={false} />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {contractor.companyName || contractor.user.name}
            </h1>
            {contractor.isVerified && (
              <div className="flex items-center gap-2 text-teal-600">
                <FiCheckCircle className="w-5 h-5" />
                <span className="font-semibold">Estimate Provider</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 space-y-6">
        {contractor.rating > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Rating</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.round(contractor.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {contractor.rating.toFixed(1)} ({contractor.reviewCount} reviews)
              </span>
            </div>
          </div>
        )}

        {contractor.bio && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">About</h2>
            <p className="text-gray-700 leading-relaxed">{contractor.bio}</p>
          </div>
        )}

        {contractor.specialties && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {JSON.parse(contractor.specialties).map((specialty: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FiMail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{contractor.user.email}</span>
            </div>
            {contractor.user.phone && (
              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{contractor.user.phone}</span>
              </div>
            )}
            {contractor.licenseNumber && (
              <div className="flex items-center gap-3">
                <FiFileText className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">License: {contractor.licenseNumber}</span>
              </div>
            )}
            {contractor.yearsExperience && (
              <div className="text-gray-700">
                <strong>Experience:</strong> {contractor.yearsExperience} years
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <Link
            href={`/portal/homeowner/projects/new?contractorId=${contractor.user.id}`}
            className="block w-full bg-teal-600 hover:bg-teal-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Request Estimate
          </Link>
        </div>
      </div>
    </div>
  )
}
