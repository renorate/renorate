'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSettings } from '@/app/actions'
import { FiSave } from 'react-icons/fi'

interface Settings {
  id: string
  defaultMarkup: number
  laborRate: number
  permitFeeEnabled: boolean
}

export default function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    defaultMarkup: (settings.defaultMarkup * 100).toFixed(2), // Convert to percentage
    laborRate: settings.laborRate.toFixed(2),
    permitFeeEnabled: settings.permitFeeEnabled,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    const formDataToSubmit = new FormData()
    formDataToSubmit.append('defaultMarkup', formData.defaultMarkup)
    formDataToSubmit.append('laborRate', formData.laborRate)
    formDataToSubmit.append('permitFeeEnabled', formData.permitFeeEnabled.toString())

    const result = await updateSettings(formDataToSubmit)

    if (result.success) {
      router.refresh()
      alert('Settings saved successfully!')
    } else {
      setError(result.error || 'Failed to update settings')
    }
    setIsSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="defaultMarkup" className="block text-sm font-medium text-gray-700 mb-2">
            Default Markup Percentage (%)
          </label>
          <input
            type="number"
            id="defaultMarkup"
            name="defaultMarkup"
            min="0"
            max="100"
            step="0.01"
            value={formData.defaultMarkup}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="25.00"
          />
          <p className="mt-1 text-sm text-gray-500">
            This percentage will be applied to material costs. Current: {formData.defaultMarkup}%
          </p>
        </div>

        <div>
          <label htmlFor="laborRate" className="block text-sm font-medium text-gray-700 mb-2">
            Default Labor Rate ($/hour)
          </label>
          <input
            type="number"
            id="laborRate"
            name="laborRate"
            min="0"
            step="0.01"
            value={formData.laborRate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="75.00"
          />
          <p className="mt-1 text-sm text-gray-500">
            Default hourly rate used for labor cost calculations. Current: ${formData.laborRate}/hr
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="permitFeeEnabled"
            name="permitFeeEnabled"
            checked={formData.permitFeeEnabled}
            onChange={handleInputChange}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="permitFeeEnabled" className="ml-3 text-sm font-medium text-gray-700">
            Include Permit Fees in Estimates
          </label>
        </div>
        <p className="text-sm text-gray-500 -mt-4">
          When enabled, permit fees will be automatically calculated and included in estimates.
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}
