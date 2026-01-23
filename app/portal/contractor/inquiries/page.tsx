'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiFileText, FiUser, FiMapPin, FiDollarSign } from 'react-icons/fi'
import Mascot from '@/components/Mascot'

interface Project {
  id: string
  title: string
  description: string
  projectType: string
  address: string
  zipCode: string
  budget: number
  status: string
  homeowner: {
    id: string
    name: string
    email: string
  }
  createdAt: string
}

export default function ContractorInquiriesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [inquiries, setInquiries] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/portal/contractor/login')
      return
    }
    setUser(JSON.parse(userData))
    fetchInquiries()
  }, [router])

  const fetchInquiries = async () => {
    try {
      // Fetch all projects without a contractor assigned (available inquiries)
      const response = await fetch('/api/projects/inquiries')
      const data = await response.json()
      if (data.success) {
        setInquiries(data.projects)
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const acceptInquiry = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: user.id,
          status: 'ACTIVE',
        }),
      })

      const data = await response.json()
      if (data.success) {
        fetchInquiries() // Refresh list
        router.push(`/portal/contractor/projects/${projectId}`)
      }
    } catch (error) {
      console.error('Error accepting inquiry:', error)
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Inquiries</h1>
            <p className="text-gray-600">Review and accept new project opportunities</p>
          </div>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No inquiries available</h2>
          <p className="text-gray-600">Check back later for new project opportunities.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{inquiry.title}</h2>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                      {inquiry.status}
                    </span>
                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold">
                      {inquiry.projectType}
                    </span>
                  </div>
                  {inquiry.description && (
                    <p className="text-gray-600 mb-3">{inquiry.description}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMapPin className="w-4 h-4" />
                  <span>{inquiry.address}, {inquiry.zipCode}</span>
                </div>
                {inquiry.budget > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiDollarSign className="w-4 h-4" />
                    <span>Budget: ${inquiry.budget.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <FiUser className="w-4 h-4" />
                  <span>{inquiry.homeowner.name} ({inquiry.homeowner.email})</span>
                </div>
                <div className="text-sm text-gray-500">
                  Posted: {new Date(inquiry.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => acceptInquiry(inquiry.id)}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Accept Project
                </button>
                <Link
                  href={`/portal/contractor/inquiries/${inquiry.id}`}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
