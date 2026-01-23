'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PROJECT_TYPES } from '@/lib/utils'
import { FiArrowLeft } from 'react-icons/fi'
import Mascot from '@/components/Mascot'

export default function NewProjectPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectType: '',
    address: '',
    zipCode: '',
    budget: '',
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/portal/homeowner/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          budget: formData.budget ? parseFloat(formData.budget) : 0,
          homeownerId: user.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/portal/homeowner/projects/${data.project.id}`)
      } else {
        setError(data.error || 'Failed to create project')
        setLoading(false)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-6">
          <Mascot size="medium" animated={false} />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">New Project</h1>
            <p className="text-gray-600">Create a new renovation project</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-400 text-red-800 rounded-lg font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-teal-400 focus:border-teal-500 bg-white shadow-sm transition-all"
              placeholder="e.g., Kitchen Renovation"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Project Type *
            </label>
            <select
              name="projectType"
              required
              value={formData.projectType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-teal-400 focus:border-teal-500 bg-white shadow-sm transition-all"
            >
              <option value="">Select project type</option>
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-teal-400 focus:border-teal-500 bg-white shadow-sm transition-all"
              placeholder="Describe your renovation project..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-teal-400 focus:border-teal-500 bg-white shadow-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                name="zipCode"
                required
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-teal-400 focus:border-teal-500 bg-white shadow-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Estimated Budget (Optional)
            </label>
            <input
              type="number"
              name="budget"
              min="0"
              step="0.01"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-teal-400 focus:border-teal-500 bg-white shadow-sm transition-all"
              placeholder="0.00"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
