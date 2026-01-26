'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateEstimate } from '@/app/actions'
import { PROJECT_TYPES, UNITS, type ProjectType, type Unit } from '@/lib/utils'
import { generatePDF } from '@/lib/pdf'
import { FiSave, FiDownload, FiPlus, FiTrash2, FiEdit2, FiX } from 'react-icons/fi'

interface LineItem {
  id?: string
  description: string
  quantity: number
  unit: Unit
  notes: string
}

interface Estimate {
  id: string
  clientName: string | null
  clientPhone: string | null
  clientEmail: string | null
  address: string | null
  zipCode: string | null
  clientId: string | null
  client: {
    id: string
    name: string
    email: string | null
    phone: string | null
    address: string | null
    zipCode: string | null
  } | null
  projectType: string
  createdAt: Date
  totalAmount: number
  lineItems: Array<{
    id: string
    description: string
    quantity: number
    unit: string
    notes: string | null
    laborCost: number
    materialCost: number
    permitCost: number
    disposalCost: number
    subtotal: number
  }>
}

export default function EstimateDetail({ estimate }: { estimate: Estimate }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    clientName: estimate.clientName || estimate.client?.name || '',
    clientPhone: estimate.clientPhone || estimate.client?.phone || '',
    clientEmail: estimate.clientEmail || estimate.client?.email || '',
    address: estimate.address || estimate.client?.address || '',
    zipCode: estimate.zipCode || estimate.client?.zipCode || '',
    projectType: estimate.projectType,
  })
  const [lineItems, setLineItems] = useState<LineItem[]>(
    estimate.lineItems.map((item) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit as Unit,
      notes: item.notes || '',
    }))
  )

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

  const handleSave = async () => {
    setError(null)
    setIsSaving(true)

    const validLineItems = lineItems.filter(
      (item) => item.description.trim() && item.quantity > 0
    )

    if (validLineItems.length === 0) {
      setError('Please add at least one line item')
      setIsSaving(false)
      return
    }

    const formDataToSubmit = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value)
    })
    formDataToSubmit.append('lineItems', JSON.stringify(validLineItems))

    const result = await updateEstimate(estimate.id, formDataToSubmit)

    if (result.success && result.estimate) {
      setIsEditing(false)
      router.refresh()
    } else {
      setError(result.error || 'Failed to update estimate')
    }
    setIsSaving(false)
  }

  const handleExportPDF = async () => {
    try {
      // Use server-side PDF generation (source of truth from database)
      const response = await fetch(`/api/estimate/${estimate.id}/pdf`)
      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RenoRate-Estimate-${estimate.id.substring(0, 8)}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      // Fallback to client-side if server fails
      generatePDF(estimate)
    }
  }

  const totalLabor = estimate.lineItems.reduce((sum, item) => sum + item.laborCost, 0)
  const totalMaterials = estimate.lineItems.reduce((sum, item) => sum + item.materialCost, 0)
  const totalPermits = estimate.lineItems.reduce((sum, item) => sum + item.permitCost, 0)
  const totalDisposal = estimate.lineItems.reduce((sum, item) => sum + item.disposalCost, 0)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Estimate' : 'Estimate Details'}
        </h1>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  router.refresh()
                }}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <FiDownload className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <FiEdit2 className="w-4 h-4" />
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Client Information</h2>
        {isEditing ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Client Name</p>
              <p className="text-lg font-medium text-gray-900">{estimate.clientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-lg font-medium text-gray-900">{estimate.clientPhone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium text-gray-900">{estimate.clientEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Project Type</p>
              <p className="text-lg font-medium text-gray-900">{estimate.projectType}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-lg font-medium text-gray-900">
                {estimate.address}, {estimate.zipCode}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Line Items</h2>
          {isEditing && (
            <button
              onClick={addLineItem}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Item
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            {lineItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                    <select
                      value={item.unit}
                      onChange={(e) =>
                        handleLineItemChange(index, 'unit', e.target.value as Unit)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Qty</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Unit</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Labor</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Materials</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Permits</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Disposal</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {estimate.lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.description}</p>
                        {item.notes && (
                          <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-700">{item.quantity}</td>
                    <td className="py-3 px-4 text-gray-700">{item.unit}</td>
                    <td className="text-right py-3 px-4 text-gray-700">
                      ${item.laborCost.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-700">
                      ${item.materialCost.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-700">
                      ${item.permitCost.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-700">
                      ${item.disposalCost.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4 font-semibold text-gray-900">
                      ${item.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="py-4 px-4 font-semibold text-gray-900">
                    Totals
                  </td>
                  <td className="text-right py-4 px-4 font-semibold text-gray-900">
                    ${totalLabor.toFixed(2)}
                  </td>
                  <td className="text-right py-4 px-4 font-semibold text-gray-900">
                    ${totalMaterials.toFixed(2)}
                  </td>
                  <td className="text-right py-4 px-4 font-semibold text-gray-900">
                    ${totalPermits.toFixed(2)}
                  </td>
                  <td className="text-right py-4 px-4 font-semibold text-gray-900">
                    ${totalDisposal.toFixed(2)}
                  </td>
                  <td className="text-right py-4 px-4 font-bold text-lg text-primary-600">
                    ${estimate.totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
