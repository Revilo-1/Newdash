'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Target, 
  Settings,
  Zap,
  Key,
  Bell,
  Mail,
  Rocket,
  Heart,
  CreditCard
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAdmin } from '@/hooks/useAdmin'

const getNavigation = (t: any, isAdmin: boolean = false) => [
  { name: t.navigation.dashboard, href: '/dashboard', icon: LayoutDashboard },
  { name: t.navigation.tasks, href: '/tasks', icon: Target },
  { name: t.navigation.healthWellness, href: '/health-wellness', icon: Heart, privateOnly: true },
  { name: t.navigation.finance, href: '/finance', icon: CreditCard, privateOnly: true },
  // Child page under Finance → Finance with tab pre-selected
  { name: 'Salg af ting', href: '/finance?tab=sales', icon: CreditCard, privateOnly: true, childOf: '/finance' },
  ...(isAdmin ? [{ name: t.navigation.users, href: '/users', icon: Users, adminOnly: true }] : []),
  { name: t.navigation.aiIntegration, href: '/ai', icon: Zap },
  { name: t.navigation.api, href: '/api', icon: Key },
  { name: t.navigation.notifications, href: '/notifications', icon: Bell, comingSoon: true },
  { name: t.navigation.newsletter, href: '/newsletter', icon: Mail, comingSoon: true },
]

const getOthers = (t: any) => [
  { name: t.sidebar.accountSettings, href: '/settings', icon: Settings },
]

interface SidebarProps {
  dashboardMode?: 'private' | 'work'
}

export default function Sidebar({ dashboardMode = 'private' }: SidebarProps) {
  const { t } = useLanguage()
  const { isAdmin } = useAdmin()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const navigation = getNavigation(t, isAdmin)
  const others = getOthers(t)

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
      <div className="flex flex-col flex-grow bg-gray-100 border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        {/* Logo Section */}
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-900">MyDashboard</span>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Demo
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {/* Main Menu Section */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {t.sidebar.mainMenu}
              </h3>
              <div className="space-y-1">
                {navigation.map((item) => {
                  // Hide private-only items when in work mode
                  if (item.privateOnly && dashboardMode === 'work') {
                    return null
                  }
                  
                  // Active state supports child items with query params (e.g., /finance?tab=sales)
                  let isActive = pathname === item.href
                  if (!isActive && item.href.startsWith('/finance?tab=')) {
                    const currentTab = searchParams?.get('tab')
                    const itemTab = item.href.split('tab=')[1]
                    isActive = pathname === '/finance' && currentTab === itemTab
                  }
                  const isChild = Boolean((item as any).childOf)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive
                          ? 'bg-purple-50 border-purple-200 text-purple-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium border-l-4 transition-colors duration-200 rounded-r-md ${isChild ? 'ml-6' : ''}`}
                    >
                      <item.icon
                        className={`${
                          isActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 flex-shrink-0 h-5 w-5`}
                      />
                      <span className="flex-1">{item.name}</span>
                      {item.comingSoon && (
                        <span className="ml-auto text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                          {t.sidebar.comingSoon}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
            
            {/* Others Section */}
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {t.sidebar.others}
              </h3>
              <div className="space-y-1">
                {others.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive
                          ? 'bg-purple-50 border-purple-200 text-purple-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium border-l-4 transition-colors duration-200 rounded-r-md`}
                    >
                      <item.icon
                        className={`${
                          isActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 flex-shrink-0 h-5 w-5`}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
