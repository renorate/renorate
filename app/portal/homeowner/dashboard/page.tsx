'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiPlus, FiFileText, FiMessageSquare, FiDollarSign, FiCalendar } from 'react-icons/fi'
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
    milestones: number
  }
}

export default function HomeownerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalBudget: 0,
    messages: 0,
    upcoming: 0,
  })
  const [recentProjects, setRecentProjects] = useState<Project[]>([])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/portal/homeowner/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'HOMEOWNER') {
        router.push('/portal/homeowner/login')
        return
      }
      setUser(parsedUser)
      fetchDashboardData(parsedUser.id)
    } catch (error) {
      router.push('/portal/homeowner/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  const fetchDashboardData = async (userId: string) => {
    try {
      const response = await fetch(`/api/projects?userId=${userId}&role=HOMEOWNER`)
      const data = await response.json()
      
      if (data.success) {
        const projects = data.projects || []
        setRecentProjects(projects.slice(0, 5))
        
        const activeProjects = projects.filter((p: Project) => 
          ['PENDING', 'ACTIVE'].includes(p.status)
        ).length
        
        const totalBudget = projects.reduce((sum: number, p: Project) => sum + (p.budget || 0), 0)
        const totalMessages = projects.reduce((sum: number, p: Project) => 
          sum + (p._count?.messages || 0), 0
        )
        const upcoming = projects.filter((p: Project) => 
          p.status === 'PENDING'
        ).length
        
        setStats({
          activeProjects,
          totalBudget,
          messages: totalMessages,
          upcoming,
        })
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
            <p className="text-gray-600">Manage your renovation projects</p>
          </div>
          <div className="flex items-center gap-4">
            <Mascot size="medium" animated={false} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/portal/homeowner/projects/new"
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
              <FiPlus className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">New Project</h3>
              <p className="text-sm text-gray-600">Start a new renovation project</p>
            </div>
          </div>
        </Link>

        <Link
          href="/portal/homeowner/projects"
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
              <FiFileText className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">My Projects</h3>
              <p className="text-sm text-gray-600">View all your projects</p>
            </div>
          </div>
        </Link>

        <Link
          href="/portal/homeowner/contractors"
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
              <FiMessageSquare className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Find Contractors</h3>
              <p className="text-sm text-gray-600">Browse verified contractors</p>
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
            <p className="text-sm text-gray-600">Total Budget</p>
            <FiDollarSign className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">${stats.totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Messages</p>
            <FiMessageSquare className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.messages}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Upcoming</p>
            <FiCalendar className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
          <Link
            href="/portal/homeowner/projects"
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            View All →
          </Link>
        </div>
        {recentProjects.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No projects yet</p>
            <Link
              href="/portal/homeowner/projects/new"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/portal/homeowner/projects/${project.id}`}
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
