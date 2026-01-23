'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FiArrowLeft, FiUser, FiMapPin, FiDollarSign, FiMail, FiPhone } from 'react-icons/fi'
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
    phone: string | null
  }
  createdAt: string
}

export default function InquiryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<any>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/portal/contractor/login')
      return
    }
    setUser(JSON.parse(userData))
    fetchProject()
  }, [params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      const data = await response.json()
      if (data.success) {
        setProject(data.project)
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const acceptInquiry = async () => {
    if (!project || !user) return

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: user.id,
          status: 'ACTIVE',
        }),
      })

      const data = await response.json()
      if (data.success) {
        router.push(`/portal/contractor/projects/${project.id}`)
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

  if (!project || !user) return null

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Inquiries
        </button>
        <div className="flex items-center gap-6 mb-6">
          <Mascot size="medium" animated={false} />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.title}</h1>
            <p className="text-gray-600">{project.address}, {project.zipCode}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Project Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Project Type</p>
              <p className="font-semibold text-gray-900">{project.projectType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-gray-900">{project.status}</p>
            </div>
            {project.budget > 0 && (
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="font-semibold text-gray-900">${project.budget.toLocaleString()}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Posted</p>
              <p className="font-semibold text-gray-900">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {project.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Description</p>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Client Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FiUser className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 font-semibold">{project.homeowner.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <FiMail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{project.homeowner.email}</span>
            </div>
            {project.homeowner.phone && (
              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{project.homeowner.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <FiMapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{project.address}, {project.zipCode}</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={acceptInquiry}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Accept This Project
          </button>
        </div>
      </div>
    </div>
  )
}
