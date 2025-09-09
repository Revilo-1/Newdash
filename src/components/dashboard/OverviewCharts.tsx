'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DashboardMode } from '@/types/dashboard'

interface OverviewChartsProps {
  mode: DashboardMode
}

const privateData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 72 },
  { name: 'Mar', value: 68 },
  { name: 'Apr', value: 75 },
  { name: 'May', value: 82 },
  { name: 'Jun', value: 78 },
]

const workData = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 48 },
  { name: 'Apr', value: 55 },
  { name: 'May', value: 62 },
  { name: 'Jun', value: 58 },
]

export default function OverviewCharts({ mode }: OverviewChartsProps) {
  const data = mode === 'private' ? privateData : workData
  
  const charts = mode === 'private' 
    ? [
        { title: 'Personal Growth', value: '78%', change: '↑(+4%)' },
        { title: 'Health & Wellness', value: '85%', change: '↑(+6%)' },
        { title: 'Life Satisfaction', value: '72%', change: '↑(+3%)' }
      ]
    : [
        { title: 'Monthly Recurring Revenue', value: '$9.1', change: '↑(+4%)' },
        { title: 'Revenue', value: '$32.9', change: '↑(+4%)' },
        { title: 'Fees', value: '$50', change: '↑(+4%)' }
      ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {charts.map((chart, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{chart.title}</h3>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{chart.value}</p>
              <p className="text-sm text-green-600">{chart.change}</p>
            </div>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280" 
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12} 
                  domain={[40, 100]}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  )
}
