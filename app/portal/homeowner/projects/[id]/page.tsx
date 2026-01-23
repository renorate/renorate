'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { FiArrowLeft, FiMessageSquare, FiDollarSign, FiCalendar, FiCheckCircle, FiSend } from 'react-icons/fi'
import Mascot from '@/components/Mascot'
// Date formatting helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

interface Project {
  id: string
  title: string
  description: string
  projectType: string
  status: string
  address: string
  zipCode: string
  budget: number
  deposit: number
  paidAmount: number
  balance: number
  startDate: string
  expectedEndDate: string
  homeowner: any
  contractor: any
  messages: Array<{
    id: string
    sender: any
    content: string
    createdAt: string
  }>
  milestones: Array<{
    id: string
    title: string
    description: string | null
    dueDate: string | null
    isCompleted: boolean
  }>
}

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<any>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'timeline' | 'financial'>('overview')
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/portal/homeowner/login')
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

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !project) return

    setSendingMessage(true)
    try {
      const response = await fetch(`/api/projects/${params.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          content: newMessage,
          messageType: 'GENERAL',
        }),
      })

      const data = await response.json()
      if (data.success) {
        setNewMessage('')
        fetchProject()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSendingMessage(false)
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
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>
        <div className="flex items-center gap-6 mb-6">
          <Mascot size="medium" animated={false} />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.title}</h1>
            <p className="text-gray-600">{project.address}, {project.zipCode}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          {(['overview', 'messages', 'timeline', 'financial'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Project Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Project Type</p>
                  <p className="font-semibold text-gray-900">{project.projectType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-gray-900">{project.status}</p>
                </div>
                {project.description && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="font-semibold text-gray-900">{project.description}</p>
                  </div>
                )}
              </div>
            </div>

            {project.contractor && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Assigned Contractor</h3>
                <p className="font-semibold text-gray-900">{project.contractor.name}</p>
                <p className="text-sm text-gray-600">{project.contractor.email}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Project Messages</h3>
              {project.contractor && (
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-teal-800">
                    <strong>Contractor:</strong> {project.contractor.name} ({project.contractor.email})
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {project.messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg ${
                    message.sender.id === user.id
                      ? 'bg-teal-50 border border-teal-200 ml-8'
                      : 'bg-gray-50 border border-gray-200 mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{message.sender.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                  <p className="text-gray-700">{message.content}</p>
                </div>
              ))}
            </div>

            {project.contractor && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex gap-2">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={3}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-teal-400 focus:border-teal-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FiSend className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Project Timeline</h3>
            {project.milestones.length === 0 ? (
              <p className="text-gray-600">No milestones yet.</p>
            ) : (
              <div className="space-y-4">
                {project.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-lg border-2 ${
                      milestone.isCompleted
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {milestone.isCompleted ? (
                        <FiCheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{milestone.title}</p>
                        {milestone.description && (
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                        )}
                        {milestone.dueDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            Due: {new Date(milestone.dueDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Overview</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900">${project.budget.toFixed(2)}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Deposit</p>
                <p className="text-3xl font-bold text-gray-900">${project.deposit.toFixed(2)}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                <p className="text-3xl font-bold text-gray-900">${project.paidAmount.toFixed(2)}</p>
              </div>
              <div className="p-6 bg-teal-50 rounded-lg border-2 border-teal-200">
                <p className="text-sm text-gray-600 mb-1">Remaining Balance</p>
                <p className="text-3xl font-bold text-teal-700">${project.balance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
