'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  computeShedEstimate,
  applyTaxAndContingency,
  type ShedInputs,
  type QuickEstimateResult,
  type RoofType,
  type SidingType,
} from '@/lib/estimate/baseline-pricing'
import { generateQuickEstimatePDF } from '@/lib/pdf'
import { z } from 'zod'

const shedInputSchema = z.object({
  widthFt: z.number().min(4).max(100),
  lengthFt: z.number().min(4).max(100),
  heightFt: z.number().min(6).max(20),
  roofType: z.enum(['metal', 'shingle']),
  windowCount: z.number().min(0).max(20),
  doorCount: z.number().min(0).max(10),
  sidingType: z.enum(['vinyl', 'metal', 'wood']),
})

const DEFAULT_INPUTS: ShedInputs = {
  widthFt: 10,
  lengthFt: 12,
  heightFt: 8,
  roofType: 'metal',
  windowCount: 1,
  doorCount: 1,
  sidingType: 'vinyl',
}

export default function QuickEstimatePage() {
  const { data: session, status } = useSession()
  const [inputs, setInputs] = useState<ShedInputs>(DEFAULT_INPUTS)
  const [result, setResult] = useState<QuickEstimateResult | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [salesTaxEnabled, setSalesTaxEnabled] = useState(false)
  const [salesTaxRate] = useState(0.07)
  const [contingencyPercent, setContingencyPercent] = useState(10)

  const handleInputChange = (field: keyof ShedInputs, value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleGenerate = () => {
    const parsed = shedInputSchema.safeParse(inputs)
    if (!parsed.success) {
      const err: Record<string, string> = {}
      parsed.error.flatten().fieldErrors?.widthFt && (err.widthFt = 'Width 4–100 ft')
      parsed.error.flatten().fieldErrors?.lengthFt && (err.lengthFt = 'Length 4–100 ft')
      parsed.error.flatten().fieldErrors?.heightFt && (err.heightFt = 'Height 6–20 ft')
      setErrors(err)
      return
    }
    setErrors({})
    const computed = computeShedEstimate(parsed.data)
    const { salesTaxAmount, contingencyAmount, totalAmount } = applyTaxAndContingency(
      computed.materialsSubtotal,
      salesTaxEnabled,
      salesTaxRate,
      contingencyPercent
    )
    setResult({
      ...computed,
      salesTaxEnabled,
      salesTaxRate,
      salesTaxAmount,
      contingencyPercent,
      contingencyAmount,
      totalAmount,
    })
  }

  const handleTaxToggle = () => {
    setSalesTaxEnabled((prev) => !prev)
    setTimeout(() => {
      if (result) {
        const next = !salesTaxEnabled
        const { salesTaxAmount, contingencyAmount, totalAmount } = applyTaxAndContingency(
          result.materialsSubtotal,
          next,
          salesTaxRate,
          contingencyPercent
        )
        setResult((r) =>
          r ? { ...r, salesTaxEnabled: next, salesTaxAmount, contingencyAmount, totalAmount } : null
        )
      }
    }, 0)
  }

  const handleContingencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = Number(e.target.value)
    setContingencyPercent(pct)
    if (result) {
      const { contingencyAmount, totalAmount } = applyTaxAndContingency(
        result.materialsSubtotal,
        salesTaxEnabled,
        salesTaxRate,
        pct
      )
      setResult((r) => (r ? { ...r, contingencyPercent: pct, contingencyAmount, totalAmount } : null))
    }
  }

  const handleDownloadPDF = () => {
    if (!result) return
    const inputsSummary = `${inputs.widthFt}'×${inputs.lengthFt}'×${inputs.heightFt}', ${inputs.roofType} roof, ${inputs.windowCount} window(s), ${inputs.doorCount} door(s), ${inputs.sidingType} siding`
    generateQuickEstimatePDF({
      projectType: 'Utility Building / Shed',
      inputsSummary,
      lineItems: result.lineItems,
      materialsSubtotal: result.materialsSubtotal,
      salesTaxAmount: result.salesTaxAmount,
      contingencyPercent: result.contingencyPercent,
      contingencyAmount: result.contingencyAmount,
      totalAmount: result.totalAmount,
    })
  }

  const handleSave = () => {
    if (status !== 'authenticated') {
      window.location.href = '/portal?redirect=/estimate&save=1'
      return
    }
    window.location.href = '/estimate/new?from=quick'
  }

  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto p-8 flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quick Estimate</h1>
        <p className="text-gray-600 mt-1">
          Utility Building / Shed — baseline pricing. No login required to generate.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dimensions & options</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Width (ft)</label>
              <input
                type="number"
                min={4}
                max={100}
                value={inputs.widthFt}
                onChange={(e) => handleInputChange('widthFt', Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
              {errors.widthFt && <p className="text-red-600 text-xs mt-1">{errors.widthFt}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Length (ft)</label>
              <input
                type="number"
                min={4}
                max={100}
                value={inputs.lengthFt}
                onChange={(e) => handleInputChange('lengthFt', Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
              {errors.lengthFt && <p className="text-red-600 text-xs mt-1">{errors.lengthFt}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (ft)</label>
              <input
                type="number"
                min={6}
                max={20}
                value={inputs.heightFt}
                onChange={(e) => handleInputChange('heightFt', Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
              {errors.heightFt && <p className="text-red-600 text-xs mt-1">{errors.heightFt}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Roof type</label>
              <select
                value={inputs.roofType}
                onChange={(e) => handleInputChange('roofType', e.target.value as RoofType)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="metal">Metal</option>
                <option value="shingle">Shingle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"># Windows</label>
              <input
                type="number"
                min={0}
                max={20}
                value={inputs.windowCount}
                onChange={(e) => handleInputChange('windowCount', Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"># Doors</label>
              <input
                type="number"
                min={0}
                max={10}
                value={inputs.doorCount}
                onChange={(e) => handleInputChange('doorCount', Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Siding type</label>
              <select
                value={inputs.sidingType}
                onChange={(e) => handleInputChange('sidingType', e.target.value as SidingType)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="vinyl">Vinyl</option>
                <option value="metal">Metal</option>
                <option value="wood">Wood / LP</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGenerate}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg"
            >
              Generate Estimate
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          {!result ? (
            <div className="text-gray-500 text-center py-12">
              Enter dimensions and click &quot;Generate Estimate&quot; to see itemized costs.
            </div>
          ) : (
            <>
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mb-4">
                Baseline pricing — for reference only. Not a substitute for a professional quote.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2">Description</th>
                      <th className="text-right py-2">Qty</th>
                      <th className="text-right py-2">Unit</th>
                      <th className="text-right py-2">Unit $</th>
                      <th className="text-right py-2">Extended $</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.lineItems.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-1.5">{row.description}</td>
                        <td className="text-right">{row.quantity}</td>
                        <td className="text-right">{row.unit}</td>
                        <td className="text-right">${row.unitCost.toFixed(2)}</td>
                        <td className="text-right">${row.extendedCost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span>Materials / Labor subtotal</span>
                  <span>${result.materialsSubtotal.toFixed(2)}</span>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={salesTaxEnabled}
                    onChange={handleTaxToggle}
                    className="rounded"
                  />
                  <span>Apply sales tax (7%)</span>
                </label>
                {result.salesTaxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Sales tax</span>
                    <span>${result.salesTaxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <span>Contingency</span>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    value={contingencyPercent}
                    onChange={handleContingencyChange}
                    className="flex-1"
                  />
                  <span>{contingencyPercent}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Contingency amount</span>
                  <span>${result.contingencyAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>${result.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2.5 px-4 rounded-lg"
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full border border-teal-600 text-teal-700 hover:bg-teal-50 font-semibold py-2.5 px-4 rounded-lg"
                >
                  {session?.user ? 'Save to dashboard' : 'Save (requires login)'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-teal-600 hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
