'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { 
  Sun, 
  Moon, 
  Bell, 
  ChevronDown,
  User,
  LogOut,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { DashboardMode } from '@/types/dashboard'
import { useLanguage } from '@/contexts/LanguageContext'
import MobileNavigation from './MobileNavigation'

interface HeaderProps {
  dashboardMode: DashboardMode
  onModeChange: (mode: DashboardMode) => void
}

export default function Header({ dashboardMode, onModeChange }: HeaderProps) {
  const { data: session } = useSession()
  const { t } = useLanguage()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Implement dark mode logic here
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/login' })
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Mobile menu + Welcome message */}
          <div className="flex items-center space-x-4">
            <MobileNavigation dashboardMode={dashboardMode} />
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 hidden sm:block">
              {t.dashboard.welcome} {session?.user?.name}! 👋
            </h1>
            <h1 className="text-lg font-semibold text-gray-900 sm:hidden">
              MyDashboard
            </h1>
          </div>
          
          {/* Right side - Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dashboard Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onModeChange('private')}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                  dashboardMode === 'private'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="hidden sm:inline">{t.dashboard.privateMode}</span>
                <span className="sm:hidden">Priv</span>
              </button>
              <button
                onClick={() => onModeChange('work')}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                  dashboardMode === 'work'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="hidden sm:inline">{t.dashboard.workMode}</span>
                <span className="sm:hidden">Work</span>
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">{session?.user?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    href="/settings"
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {t.navigation.settings}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t.navigation.signOut}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
