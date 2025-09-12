'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import SettingsView from '@/components/settings/SettingsView'
import { DashboardMode } from '@/types/dashboard'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>('private')

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar dashboardMode={dashboardMode} />
      <div className="lg:pl-64 w-full max-w-full overflow-x-hidden">
        <Header 
          dashboardMode={dashboardMode} 
          onModeChange={setDashboardMode}
        />
        <main className="py-6 w-full max-w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <SettingsView />
          </div>
        </main>
      </div>
    </div>
  )
}
