'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiPlus, FiFileText, FiMessageSquare, FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import Mascot from '@/components/Mascot'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Project {
  id: string
  title: string
  status: string
  budget: number
  _count: {
    messages: number
  }
}

export default function ContractorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalRevenue: 0,
    pendingInquiries: 0,
    estimatesSent: 0,
  })
  const [recentProjects, setRecentProjects] = useState<Project[]>([])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/portal/contractor/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'CONTRACTOR') {
        router.push('/portal/contractor/login')
        return
      }
      setUser(parsedUser)
      fetchDashboardData(parsedUser.id)
    } catch (error) {
      router.push('/portal/contractor/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  const fetchDashboardData = async (userId: string) => {
    try {
      // Fetch contractor's projects
      const projectsResponse = await fetch(`/api/projects?userId=${userId}&role=CONTRACTOR`)
      const projectsData = await projectsResponse.json()
      
      if (projectsData.success) {
        const projects = projectsData.projects || []
        setRecentProjects(projects.slice(0, 5))
        
        const activeProjects = projects.filter((p: Project) => 
          ['PENDING', 'ACTIVE'].includes(p.status)
        ).length
        
        const totalRevenue = projects.reduce((sum: number, p: Project) => 
          sum + (p.budget || 0), 0
        )
        
        setStats({
          activeProjects,
          totalRevenue,
          pendingInquiries: projects.filter((p: Project) => p.status === 'PENDING').length,
          estimatesSent: projects.length,
        })
      }

      // Fetch estimates count
      const estimatesResponse = await fetch(`/api/estimates?contractorId=${userId}`)
      const estimatesData = await estimatesResponse.json()
      if (estimatesData.success) {
        setStats(prev => ({
          ...prev,
          estimatesSent: estimatesData.estimates?.length || 0,
        }))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}
            </h1>
            <p className="text-gray-600">Manage your projects and estimates</p>
          </div>
          <div className="flex items-center gap-4">
            <Mascot size="medium" animated={false} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/estimate/new"
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
              <FiPlus className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">New Estimate</h3>
              <p className="text-sm text-gray-600">Create a professional estimate</p>
            </div>
          </div>
        </Link>

        <Link
          href="/portal/contractor/projects"
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
              <FiFileText className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">My Projects</h3>
              <p className="text-sm text-gray-600">View active projects</p>
            </div>
          </div>
        </Link>

        <Link
          href="/portal/contractor/inquiries"
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
              <FiMessageSquare className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Project Inquiries</h3>
              <p className="text-sm text-gray-600">Review new opportunities</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Active Projects</p>
            <FiFileText className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.activeProjects}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <FiDollarSign className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending Inquiries</p>
            <FiMessageSquare className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.pendingInquiries}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Estimates Sent</p>
            <FiTrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.estimatesSent}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
          <Link
            href="/portal/contractor/projects"
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            View All →
          </Link>
        </div>
        {recentProjects.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No recent activity</p>
            <Link
              href="/estimate/new"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Create Your First Estimate
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/portal/contractor/projects/${project.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Status: {project.status} • Budget: ${project.budget.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {project._count?.messages || 0} messages
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
