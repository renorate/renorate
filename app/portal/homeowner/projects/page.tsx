'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiPlus, FiFileText, FiMessageSquare, FiDollarSign, FiCalendar } from 'react-icons/fi'
import { useAuth } from '@/lib/use-auth'

interface Project {
  id: string
  title: string
  projectType: string
  status: string
  budget: number
  address: string
  contractor: any
  estimate: any
  _count: {
    messages: number
    milestones: number
  }
}

export default function HomeownerProjectsPage() {
  const { user, isLoading } = useAuth('HOMEOWNER')
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    if (user) {
      fetchProjects()
    }
  }, [user])

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/projects?role=HOMEOWNER`)
      const data = await response.json()
      if (data.success) {
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  if (isLoading || !user) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">My Projects</h1>
        <Link
          href="/portal/homeowner/projects/new"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No projects yet</h2>
          <p className="text-gray-600 mb-6">Create your first renovation project to get started.</p>
          <Link
            href="/portal/homeowner/projects/new"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/portal/homeowner/projects/${project.id}`}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold">
                      {project.projectType}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{project.address}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    {project.contractor && (
                      <span className="flex items-center gap-1">
                        <FiMessageSquare className="w-4 h-4" />
                        Contractor: {project.contractor.name}
                      </span>
                    )}
                    {project.budget > 0 && (
                      <span className="flex items-center gap-1">
                        <FiDollarSign className="w-4 h-4" />
                        Budget: ${project.budget.toFixed(2)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <FiMessageSquare className="w-4 h-4" />
                      {project._count.messages} messages
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      {project._count.milestones} milestones
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
