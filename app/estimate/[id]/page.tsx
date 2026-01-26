import { notFound } from 'next/navigation'
import { getEstimate } from '@/app/actions'
import EstimateDetail from '@/components/EstimateDetail'

export default async function EstimateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const estimate = await getEstimate(id)

  if (!estimate) {
    notFound()
  }

  // Ensure required fields are present (handle nullable legacy fields)
  const hasClientInfo = estimate.clientName || estimate.client?.name
  if (!hasClientInfo) {
    notFound()
  }

  return <EstimateDetail estimate={estimate} />
}
