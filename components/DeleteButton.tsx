'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteEstimate } from '@/app/actions'
import { FiTrash2 } from 'react-icons/fi'

export default function DeleteButton({ estimateId }: { estimateId: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteEstimate(estimateId)
    if (result.success) {
      router.refresh()
    } else {
      alert('Failed to delete estimate')
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Confirm'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Delete"
    >
      <FiTrash2 className="w-5 h-5" />
    </button>
  )
}
