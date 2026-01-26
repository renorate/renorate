import { notFound } from 'next/navigation'
import { getEstimate } from '@/app/actions'
import EstimateDetail from '@/components/EstimateDetail'

export default async function EstimateDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const estimate = await getEstimate(params.id)

  if (!estimate) {
    notFound()
  }

  return <EstimateDetail estimate={estimate} />
}
