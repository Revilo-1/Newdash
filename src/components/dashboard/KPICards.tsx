'use client'

import { 
  Eye, 
  DollarSign, 
  Users, 
  TrendingUp,
  Target,
  Calendar,
  Heart,
  Briefcase,
  UserCheck
} from 'lucide-react'
import { DashboardMode } from '@/types/dashboard'

interface KPICardsProps {
  mode: DashboardMode
}

interface KPICard {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}

export default function KPICards({ mode }: KPICardsProps) {
  const privateKPIs: KPICard[] = [
    {
      title: 'Tasks Completed',
      value: '24',
      change: '12%↑',
      changeType: 'increase',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Goals Achieved',
      value: '8',
      change: '25%↑',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Events This Week',
      value: '12',
      change: '3%↑',
      changeType: 'increase',
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Wellness Score',
      value: '85%',
      change: '5%↑',
      changeType: 'increase',
      icon: Heart,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500'
    }
  ]

  const workKPIs: KPICard[] = [
    {
      title: 'Total Revenue',
      value: '$42.2K',
      change: '4.35%↑',
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500'
    },
    {
      title: 'Total Visitors',
      value: '3.456K',
      change: '0.43%↑',
      changeType: 'increase',
      icon: Eye,
      color: 'text-green-500',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Free Users',
      value: '43543',
      change: '2.59%↑',
      changeType: 'increase',
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Pro Users',
      value: '5334',
      change: '0.95%↓',
      changeType: 'decrease',
      icon: UserCheck,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500'
    }
  ]

  const kpis = mode === 'private' ? privateKPIs : workKPIs

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
            <div className={`p-3 rounded-full ${kpi.bgColor}`}>
              <kpi.icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${
              kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpi.change}
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
      ))}
    </div>
  )
}
