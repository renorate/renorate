import { getSettings } from '@/app/actions'
import SettingsForm from '@/components/SettingsForm'

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  )
}
