import Link from 'next/link'
import { getAllEstimates } from '@/app/actions'
import { FiFileText, FiEdit2, FiTrash2 } from 'react-icons/fi'
import DeleteButton from '@/components/DeleteButton'
import Mascot from '@/components/Mascot'

export default async function EstimatesPage() {
  const estimates = await getAllEstimates()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div>
            <Mascot size="medium" animated={false} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary-600 via-accent-600 to-electric-600 bg-clip-text text-transparent drop-shadow-lg">
              Saved Estimates
            </h1>
            <p className="text-lg font-bold text-gray-700 mt-2">RenoRhino's Reports</p>
          </div>
        </div>
        <Link
          href="/estimate/new"
          className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-600 text-white px-8 py-4 rounded-xl font-black text-lg shadow-2xl hover:scale-105 transition-all transform hover:from-primary-600 hover:via-primary-700 hover:to-accent-700"
        >
          ✨ New Estimate ✨
        </Link>
      </div>

      {estimates.length === 0 ? (
        <div className="bg-gradient-to-br from-white via-primary-50 to-accent-50 rounded-3xl shadow-2xl p-12 text-center border-4 border-primary-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200 rounded-full -mr-32 -mt-32 opacity-30 blur-3xl"></div>
          <div className="relative z-10">
            <div className="inline-block mb-6">
              <Mascot size="large" animated={false} />
            </div>
            <FiFileText className="w-20 h-20 text-primary-400 mx-auto mb-6 drop-shadow-lg" />
            <h2 className="text-3xl font-black text-gray-900 mb-3 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              No estimates yet
            </h2>
            <p className="text-lg font-bold text-gray-700 mb-8">RenoRhino is ready to help you create your first estimate!</p>
            <Link
              href="/estimate/new"
              className="inline-block bg-gradient-to-r from-primary-500 via-primary-600 to-accent-600 text-white px-8 py-4 rounded-xl font-black text-lg shadow-2xl hover:scale-110 transition-all transform"
            >
              ✨ Create Your First Estimate ✨
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {estimates.map((estimate) => (
            <div
              key={estimate.id}
              className="bg-gradient-to-br from-white via-primary-50 to-accent-50 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all border-4 border-primary-200 hover:border-primary-400 hover:scale-[1.02] transform"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-black text-gray-900">{estimate.clientName}</h2>
                    <span className="px-4 py-2 bg-gradient-to-r from-primary-400 to-accent-400 text-white rounded-full text-sm font-black shadow-lg">
                      {estimate.projectType}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-1">{estimate.address}, {estimate.zipCode}</p>
                  <p className="text-gray-500 text-sm mb-3">
                    {estimate.clientEmail} • {estimate.clientPhone}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{estimate.lineItems.length} line item(s)</span>
                    <span>•</span>
                    <span className="font-black text-lg text-primary-700 bg-primary-100 px-3 py-1 rounded-lg shadow-md">
                      Total: ${estimate.totalAmount.toFixed(2)}
                    </span>
                    <span>•</span>
                    <span>{new Date(estimate.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/estimate/${estimate.id}`}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="View/Edit"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </Link>
                  <DeleteButton estimateId={estimate.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
