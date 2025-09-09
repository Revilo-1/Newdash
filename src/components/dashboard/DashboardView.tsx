'use client'

import { useState, useEffect } from 'react'
import { DashboardMode } from '@/types/dashboard'
import KPICards from './KPICards'
import OverviewCharts from './OverviewCharts'
import RecentTasks from './RecentTasks'
import UpcomingEvents from './UpcomingEvents'

interface DashboardViewProps {
  mode: DashboardMode
}

export default function DashboardView({ mode }: DashboardViewProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [mode])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
          <li>
            <div>
              <span className="text-gray-500">Home</span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="text-gray-400">/</span>
              <span className="ml-4 text-gray-500">Dashboard</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          {mode === 'private' 
            ? 'An overview of your personal goals, tasks, and life metrics.'
            : 'An overview of your organization\'s activity and performance across all your projects.'
          }
        </p>
      </div>

      {/* KPI Cards */}
      <KPICards mode={mode} />

      {/* Overview Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
        <p className="text-gray-600 mb-6">
          {mode === 'private'
            ? 'Track your personal progress and life goals across different areas.'
            : 'An overview of your organization\'s activity and performance across all your projects.'
          }
        </p>
        <OverviewCharts mode={mode} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTasks mode={mode} />
        <UpcomingEvents mode={mode} />
      </div>
    </div>
  )
}
