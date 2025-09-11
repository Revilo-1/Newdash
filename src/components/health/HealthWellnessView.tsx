'use client'

import { useState, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Plus, Heart, Activity, Target, TrendingUp, Clock, Flame, Droplets, Moon, Sun, History } from 'lucide-react'
import { DashboardMode } from '@/types/dashboard'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useLanguage } from '@/contexts/LanguageContext'
import TrainingHistoryView from './TrainingHistoryView'

interface HealthWellnessViewProps {
  mode: DashboardMode
}

interface WellnessMetric {
  id: string
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}

interface TrainingEvent {
  id: string
  title: string
  type: 'biceps-triceps-mave' | 'ryg-bryst-skulder' | 'ben-ass'
  duration: number
  intensity: 'low' | 'medium' | 'high'
  date: Date
  notes?: string
}

const wellnessData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 72 },
  { name: 'Mar', value: 68 },
  { name: 'Apr', value: 75 },
  { name: 'May', value: 82 },
  { name: 'Jun', value: 78 },
]

const sampleTrainingEvents: TrainingEvent[] = [
  {
    id: '1',
    title: 'Biceps & Triceps + Mave',
    type: 'biceps-triceps-mave',
    duration: 45,
    intensity: 'high',
    date: new Date(2024, 0, 15),
    notes: 'Great workout today!'
  },
  {
    id: '2',
    title: 'Ryg, Bryst og Skulder',
    type: 'ryg-bryst-skulder',
    duration: 50,
    intensity: 'high',
    date: new Date(2024, 0, 16),
    notes: 'Focused on upper body'
  },
  {
    id: '3',
    title: 'Ben & A$$',
    type: 'ben-ass',
    duration: 40,
    intensity: 'medium',
    date: new Date(2024, 0, 17),
    notes: 'Leg day completed'
  },
  {
    id: '4',
    title: 'Biceps & Triceps + Mave',
    type: 'biceps-triceps-mave',
    duration: 35,
    intensity: 'medium',
    date: new Date(2024, 0, 18),
    notes: 'Core focus today'
  }
]

const wellnessMetrics: WellnessMetric[] = [
  {
    id: '1',
    title: 'Sundhed & Velvære',
    value: '85%',
    change: '↑(+6%)',
    changeType: 'increase',
    icon: Heart,
    color: 'text-green-500',
    bgColor: 'bg-green-500'
  },
  {
    id: '2',
    title: 'Aktivitetsniveau',
    value: '7.2K',
    change: '↑(+12%)',
    changeType: 'increase',
    icon: Activity,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500'
  },
  {
    id: '3',
    title: 'Mål Opnået',
    value: '24',
    change: '↑(+8%)',
    changeType: 'increase',
    icon: Target,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500'
  },
  {
    id: '4',
    title: 'Streak Dage',
    value: '12',
    change: '↑(+3)',
    changeType: 'increase',
    icon: Flame,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500'
  }
]

const getTrainingTypeIcon = (type: string) => {
  switch (type) {
    case 'biceps-triceps-mave': return '💪'
    case 'ryg-bryst-skulder': return '🏋️‍♂️'
    case 'ben-ass': return '🦵'
    default: return '💪'
  }
}

const getIntensityColor = (intensity: string) => {
  switch (intensity) {
    case 'low': return 'bg-green-100 text-green-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'high': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function HealthWellnessView({ mode }: HealthWellnessViewProps) {
  const { t } = useLanguage()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [trainingEvents, setTrainingEvents] = useState(sampleTrainingEvents)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'biceps-triceps-mave' as const,
    duration: 30,
    intensity: 'medium' as const,
    notes: ''
  })

  // Only show this page for private dashboard
  if (mode !== 'private') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t.healthWellness.title}</h3>
          <p className="text-gray-500">Switch to Private mode to access your health and wellness tracking.</p>
        </div>
      </div>
    )
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    return trainingEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  const addTrainingEvent = () => {
    if (newEvent.title.trim()) {
      const event: TrainingEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        type: newEvent.type,
        duration: newEvent.duration,
        intensity: newEvent.intensity,
        date: selectedDate,
        notes: newEvent.notes
      }
      setTrainingEvents([...trainingEvents, event])
      setNewEvent({
        title: '',
        type: 'biceps-triceps-mave',
        duration: 30,
        intensity: 'medium',
        notes: ''
      })
      setShowAddEvent(false)
    }
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

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
              <span className="ml-4 text-gray-500">Sundhed & Velvære</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.healthWellness.title}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t.healthWellness.subtitle}
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => setShowHistory(false)}
            className={`px-6 py-3 rounded-lg font-medium ${
              !showHistory 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Activity className="h-5 w-5 inline mr-2" />
            Nuværende Træning
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className={`px-6 py-3 rounded-lg font-medium ${
              showHistory 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <History className="h-5 w-5 inline mr-2" />
            Træningshistorik
          </button>
        </div>
      </div>

      {/* Wellness Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wellnessMetrics.map((metric) => (
          <div key={metric.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
              <div className={`p-3 rounded-full ${metric.bgColor}`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Health & Wellness Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Sundhed & Velvære</h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">85%</p>
            <p className="text-sm text-green-600">↑(+6%)</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={wellnessData}>
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

      {/* Training Calendar and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{t.healthWellness.trainingCalendar}</h3>
            <button
              onClick={() => setShowAddEvent(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.healthWellness.addTraining}
            </button>
          </div>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h4 className="text-lg font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h4>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-10"></div>
              }

              const events = getEventsForDate(day)
              const isToday = day.toDateString() === new Date().toDateString()
              const isSelected = day.toDateString() === selectedDate.toDateString()

              return (
                <button
                  key={day.getTime()}
                  onClick={() => setSelectedDate(day)}
                  className={`h-10 text-sm rounded-md transition-colors relative ${
                    isToday 
                      ? 'bg-green-100 text-green-800 font-semibold' 
                      : isSelected
                      ? 'bg-blue-100 text-blue-800'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {day.getDate()}
                  {events.length > 0 && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Training Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.healthWellness.todaysTraining}</h3>
          <div className="space-y-3">
            {getEventsForDate(selectedDate).map((event) => (
              <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{getTrainingTypeIcon(event.type)}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{event.duration} min</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getIntensityColor(event.intensity)}`}>
                      {event.intensity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {getEventsForDate(selectedDate).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>{t.healthWellness.noTrainingScheduled}</p>
                <button
                  onClick={() => setShowAddEvent(true)}
                  className="mt-2 text-green-600 hover:text-green-700 font-medium"
                >
                  {t.healthWellness.addFirstWorkout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Training Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t.healthWellness.addTrainingSession}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t.healthWellness.trainingType}</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="biceps-triceps-mave">{t.healthWellness.trainingTypes.bicepsTricepsMave}</option>
                    <option value="ryg-bryst-skulder">{t.healthWellness.trainingTypes.rygBrystSkulder}</option>
                    <option value="ben-ass">{t.healthWellness.trainingTypes.benAss}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="e.g., Morning Run"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t.healthWellness.duration}</label>
                    <input
                      type="number"
                      value={newEvent.duration}
                      onChange={(e) => setNewEvent({...newEvent, duration: parseInt(e.target.value)})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Intensity</label>
                    <select
                      value={newEvent.intensity}
                      onChange={(e) => setNewEvent({...newEvent, intensity: e.target.value as any})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="low">{t.healthWellness.intensity.low}</option>
                      <option value="medium">{t.healthWellness.intensity.medium}</option>
                      <option value="high">{t.healthWellness.intensity.high}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t.healthWellness.notes}</label>
                  <textarea
                    value={newEvent.notes}
                    onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    rows={3}
                    placeholder={t.healthWellness.howDidItFeel}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t.common.cancel}
                </button>
                <button
                  onClick={addTrainingEvent}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  {t.healthWellness.addTraining}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training History View */}
      {showHistory && (
        <TrainingHistoryView mode={mode} />
      )}
    </div>
  )
}
