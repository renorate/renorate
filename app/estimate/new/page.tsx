'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEstimate } from '@/app/actions'
import { PROJECT_TYPES, UNITS, type ProjectType, type Unit } from '@/lib/utils'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import Mascot from '@/components/Mascot'

interface LineItem {
  description: string
  quantity: number
  unit: Unit
  notes: string
}

export default function NewEstimatePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    address: '',
    zipCode: '',
    projectType: '' as ProjectType | '',
  })
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 0, unit: 'sqft', notes: '' },
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const addLineItem = () => {
    setLineItems((prev) => [...prev, { description: '', quantity: 0, unit: 'sqft', notes: '' }])
  }

  const removeLineItem = (index: number) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    // Validate line items
    const validLineItems = lineItems.filter(
      (item) => item.description.trim() && item.quantity > 0
    )

    if (validLineItems.length === 0) {
      setError('Please add at least one line item')
      setIsSubmitting(false)
      return
    }

    const formDataToSubmit = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value)
    })
    formDataToSubmit.append('lineItems', JSON.stringify(validLineItems))

    try {
      const result = await createEstimate(formDataToSubmit)

      if (result.success && result.estimate) {
        router.push(`/estimate/${result.estimate.id}`)
      } else {
        setError(result.error || 'Failed to create estimate')
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-6 mb-8">
          <div>
            <Mascot size="medium" animated={false} />
          </div>
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary-700 via-accent-600 to-electric-600 bg-clip-text text-transparent drop-shadow-lg mb-2">
            Create New Estimate
          </h1>
          <p className="text-lg font-bold text-gray-700">RenoRhino is ready to help!</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white via-primary-50 to-accent-50 rounded-3xl shadow-2xl p-8 md:p-10 border-4 border-primary-300 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200 rounded-full -mr-32 -mt-32 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-200 rounded-full -ml-24 -mb-24 opacity-30 blur-3xl"></div>
        <div className="relative z-10">
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-4 border-red-400 text-red-800 rounded-xl shadow-lg font-semibold">
            ⚠️ {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
              Client Name *
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              required
              value={formData.clientName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl focus:ring-4 focus:ring-primary-400 focus:border-primary-500 bg-white shadow-md transition-all"
            />
          </div>

          <div>
            <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              id="clientPhone"
              name="clientPhone"
              required
              value={formData.clientPhone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl focus:ring-4 focus:ring-primary-400 focus:border-primary-500 bg-white shadow-md transition-all"
            />
          </div>

          <div>
            <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="clientEmail"
              name="clientEmail"
              required
              value={formData.clientEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl focus:ring-4 focus:ring-primary-400 focus:border-primary-500 bg-white shadow-md transition-all"
            />
          </div>

          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
              Project Type *
            </label>
            <select
              id="projectType"
              name="projectType"
              required
              value={formData.projectType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl focus:ring-4 focus:ring-primary-400 focus:border-primary-500 bg-white shadow-md transition-all"
            >
              <option value="">Select project type</option>
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl focus:ring-4 focus:ring-primary-400 focus:border-primary-500 bg-white shadow-md transition-all"
            />
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              required
              value={formData.zipCode}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl focus:ring-4 focus:ring-primary-400 focus:border-primary-500 bg-white shadow-md transition-all"
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Line Items
            </h2>
            <button
              type="button"
              onClick={addLineItem}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl hover:from-primary-600 hover:to-accent-600 transition-all shadow-lg hover:scale-105 font-bold transform"
            >
              <FiPlus className="w-5 h-5" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {lineItems.map((item, index) => (
              <div
                key={index}
                className="border-2 border-primary-200 rounded-2xl p-6 bg-white/80 shadow-lg hover:shadow-xl transition-all hover:border-primary-400 hover:scale-[1.01]"
              >
                <div className="grid md:grid-cols-4 gap-4 mb-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleLineItemChange(index, 'description', e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl focus:ring-4 focus:ring-primary-400 focus:border-primary-500 bg-white shadow-md transition-all"
                      placeholder="e.g., Install new flooring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) =>
                        handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl focus:ring-4 focus:ring-primary-400 focus:border-primary-500 bg-white shadow-md transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                    <select
                      value={item.unit}
                      onChange={(e) =>
                        handleLineItemChange(index, 'unit', e.target.value as Unit)
                      }
                      className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl focus:ring-4 focus:ring-primary-400 focus:border-primary-500 bg-white shadow-md transition-all"
                    >
                      {UNITS.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => handleLineItemChange(index, 'notes', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl focus:ring-4 focus:ring-primary-400 focus:border-primary-500 bg-white shadow-md transition-all"
                      placeholder="Optional notes"
                    />
                  </div>
                  {lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      className="mt-6 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:from-primary-600 hover:via-primary-700 hover:to-accent-700 transition-all shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transform"
          >
            {isSubmitting ? 'Creating... 🔨' : '✨ Create Estimate ✨'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-4 border-4 border-primary-400 text-primary-700 rounded-xl font-bold text-lg hover:bg-primary-100 transition-all shadow-lg hover:scale-105 transform"
          >
            Cancel
          </button>
        </div>
        </div>
      </form>
    </div>
  )
}
