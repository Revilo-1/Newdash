'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import UserManagementView from '@/components/users/UserManagementView'
import { DashboardMode } from '@/types/dashboard'

export default function UsersPage() {
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

  // Check if user is admin (only admin@lifedash.com can access)
  if (session.user?.email !== 'admin@lifedash.com') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
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
            <UserManagementView />
          </div>
        </main>
      </div>
    </div>
  )
}
