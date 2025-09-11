'use client'

import React, { useState, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  Activity, 
  TrendingUp, 
  Target, 
  Award,
  ChevronLeft,
  ChevronRight,
  Eye,
  BarChart3,
  Zap,
  Heart,
  Dumbbell,
  X
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface TrainingEvent {
  id: string
  title: string
  type: 'biceps-triceps-mave' | 'ryg-bryst-skulder' | 'ben-ass' | 'cardio' | 'yoga' | 'crossfit'
  duration: number
  intensity: 'low' | 'medium' | 'high'
  date: Date
  notes?: string
  calories?: number
  heartRate?: {
    avg: number
    max: number
  }
  exercises?: {
    name: string
    sets: number
    reps: number
    weight?: number
  }[]
}

interface TrainingHistoryViewProps {
  mode: 'personal' | 'work'
}

// Sample training data with more detailed information
const sampleTrainingHistory: TrainingEvent[] = [
  {
    id: '1',
    title: 'Biceps & Triceps + Mave',
    type: 'biceps-triceps-mave',
    duration: 45,
    intensity: 'high',
    date: new Date(2024, 0, 15),
    notes: 'Great workout today! Felt strong on all exercises.',
    calories: 320,
    heartRate: { avg: 145, max: 168 },
    exercises: [
      { name: 'Bicep Curls', sets: 4, reps: 12, weight: 20 },
      { name: 'Tricep Dips', sets: 3, reps: 15, weight: 0 },
      { name: 'Plank', sets: 3, reps: 60, weight: 0 },
      { name: 'Russian Twists', sets: 3, reps: 20, weight: 10 }
    ]
  },
  {
    id: '2',
    title: 'Ryg, Bryst og Skulder',
    type: 'ryg-bryst-skulder',
    duration: 50,
    intensity: 'high',
    date: new Date(2024, 0, 16),
    notes: 'Focused on upper body strength. New PR on bench press!',
    calories: 380,
    heartRate: { avg: 152, max: 175 },
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, weight: 80 },
      { name: 'Pull-ups', sets: 3, reps: 10, weight: 0 },
      { name: 'Shoulder Press', sets: 3, reps: 12, weight: 25 },
      { name: 'Lat Pulldown', sets: 3, reps: 12, weight: 60 }
    ]
  },
  {
    id: '3',
    title: 'Ben & A$$',
    type: 'ben-ass',
    duration: 40,
    intensity: 'medium',
    date: new Date(2024, 0, 17),
    notes: 'Leg day completed. Sore but satisfied!',
    calories: 280,
    heartRate: { avg: 138, max: 162 },
    exercises: [
      { name: 'Squats', sets: 4, reps: 15, weight: 60 },
      { name: 'Lunges', sets: 3, reps: 12, weight: 20 },
      { name: 'Deadlifts', sets: 3, reps: 10, weight: 70 },
      { name: 'Calf Raises', sets: 3, reps: 20, weight: 30 }
    ]
  },
  {
    id: '4',
    title: 'Cardio HIIT',
    type: 'cardio',
    duration: 30,
    intensity: 'high',
    date: new Date(2024, 0, 18),
    notes: 'High intensity cardio session. Sweat like crazy!',
    calories: 450,
    heartRate: { avg: 165, max: 185 },
    exercises: [
      { name: 'Burpees', sets: 4, reps: 15, weight: 0 },
      { name: 'Mountain Climbers', sets: 4, reps: 30, weight: 0 },
      { name: 'Jump Squats', sets: 3, reps: 20, weight: 0 },
      { name: 'High Knees', sets: 3, reps: 45, weight: 0 }
    ]
  },
  {
    id: '5',
    title: 'Yoga Flow',
    type: 'yoga',
    duration: 60,
    intensity: 'low',
    date: new Date(2024, 0, 19),
    notes: 'Relaxing yoga session. Great for recovery.',
    calories: 180,
    heartRate: { avg: 95, max: 120 },
    exercises: [
      { name: 'Sun Salutation', sets: 3, reps: 1, weight: 0 },
      { name: 'Warrior Poses', sets: 2, reps: 5, weight: 0 },
      { name: 'Tree Pose', sets: 2, reps: 3, weight: 0 },
      { name: 'Savasana', sets: 1, reps: 1, weight: 0 }
    ]
  },
  {
    id: '6',
    title: 'CrossFit WOD',
    type: 'crossfit',
    duration: 25,
    intensity: 'high',
    date: new Date(2024, 0, 20),
    notes: 'Tough WOD today. Finished in 18:45!',
    calories: 420,
    heartRate: { avg: 170, max: 190 },
    exercises: [
      { name: 'Thrusters', sets: 5, reps: 10, weight: 40 },
      { name: 'Pull-ups', sets: 5, reps: 8, weight: 0 },
      { name: 'Box Jumps', sets: 5, reps: 12, weight: 0 },
      { name: 'Kettlebell Swings', sets: 5, reps: 15, weight: 24 }
    ]
  }
]

const getTrainingTypeIcon = (type: string) => {
  switch (type) {
    case 'biceps-triceps-mave': return '💪'
    case 'ryg-bryst-skulder': return '🏋️'
    case 'ben-ass': return '🦵'
    case 'cardio': return '🏃'
    case 'yoga': return '🧘'
    case 'crossfit': return '⚡'
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

const getIntensityText = (intensity: string) => {
  switch (intensity) {
    case 'low': return 'Lav'
    case 'medium': return 'Medium'
    case 'high': return 'Høj'
    default: return intensity
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'biceps-triceps-mave': return 'bg-blue-100 text-blue-800'
    case 'ryg-bryst-skulder': return 'bg-purple-100 text-purple-800'
    case 'ben-ass': return 'bg-green-100 text-green-800'
    case 'cardio': return 'bg-red-100 text-red-800'
    case 'yoga': return 'bg-pink-100 text-pink-800'
    case 'crossfit': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function TrainingHistoryView({ mode }: TrainingHistoryViewProps) {
  const { t } = useLanguage()
  const [trainingHistory, setTrainingHistory] = useState<TrainingEvent[]>(sampleTrainingHistory)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTraining, setSelectedTraining] = useState<TrainingEvent | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'stats'>('calendar')

  // Calculate statistics
  const totalWorkouts = trainingHistory.length
  const totalDuration = trainingHistory.reduce((sum, workout) => sum + workout.duration, 0)
  const totalCalories = trainingHistory.reduce((sum, workout) => sum + (workout.calories || 0), 0)
  const avgIntensity = trainingHistory.reduce((sum, workout) => {
    const intensityValue = workout.intensity === 'low' ? 1 : workout.intensity === 'medium' ? 2 : 3
    return sum + intensityValue
  }, 0) / totalWorkouts

  const getEventsForDate = (date: Date) => {
    return trainingHistory.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('da-DK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('da-DK', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setSelectedDate(newDate)
  }

  const renderCalendar = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDate = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      const dayEvents = getEventsForDate(currentDate)
      const isCurrentMonth = currentDate.getMonth() === month
      const isToday = currentDate.toDateString() === new Date().toDateString()
      
      days.push(
        <div
          key={i}
          className={`relative p-2 h-24 border border-gray-200 ${
            isCurrentMonth ? 'bg-white' : 'bg-gray-50'
          } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
        >
          <div className={`text-sm font-medium ${
            isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
          } ${isToday ? 'text-blue-600' : ''}`}>
            {currentDate.getDate()}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="text-xs p-1 rounded cursor-pointer hover:bg-gray-100"
                style={{ backgroundColor: getTypeColor(event.type).split(' ')[0].replace('bg-', '').replace('-100', '-200') }}
                onClick={() => {
                  setSelectedTraining(event)
                  setShowDetails(true)
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>{getTrainingTypeIcon(event.type)}</span>
                  <span className="truncate">{event.title}</span>
                </div>
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 2} flere
              </div>
            )}
          </div>
        </div>
      )
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Træninger</p>
            <p className="text-2xl font-bold text-gray-900">{totalWorkouts}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Tid</p>
            <p className="text-2xl font-bold text-gray-900">{totalDuration}h</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-red-100 rounded-lg">
            <Zap className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Kalorier Forbrændt</p>
            <p className="text-2xl font-bold text-gray-900">{totalCalories.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Gennemsnitlig Intensitet</p>
            <p className="text-2xl font-bold text-gray-900">
              {avgIntensity.toFixed(1)}/3
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTrainingDetails = () => {
    if (!selectedTraining) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{getTrainingTypeIcon(selectedTraining.type)}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTraining.title}</h2>
                  <p className="text-gray-600">{formatDate(selectedTraining.date)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Clock className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Varighed</p>
                <p className="text-lg font-semibold">{selectedTraining.duration} min</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Zap className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Kalorier</p>
                <p className="text-lg font-semibold">{selectedTraining.calories || 'Ikke tilgængelig'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Heart className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Gennemsnitlig HR</p>
                <p className="text-lg font-semibold">{selectedTraining.heartRate?.avg || 'Ikke tilgængelig'} bpm</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Target className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Intensitet</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getIntensityColor(selectedTraining.intensity)}`}>
                  {getIntensityText(selectedTraining.intensity)}
                </span>
              </div>
            </div>

            {selectedTraining.notes && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Noter</h3>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{selectedTraining.notes}</p>
              </div>
            )}

            {selectedTraining.exercises && selectedTraining.exercises.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Øvelser</h3>
                <div className="space-y-3">
                  {selectedTraining.exercises.map((exercise, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{exercise.sets} sæt</span>
                          <span>{exercise.reps} gentagelser</span>
                          {exercise.weight && exercise.weight > 0 && (
                            <span>{exercise.weight} kg</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Træningshistorik</h1>
          <p className="mt-2 text-gray-600">Gennemgå dine tidligere træningssessioner</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('stats')}
            className={`px-4 py-2 rounded-lg font-medium ${
              viewMode === 'stats' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Statistikker
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg font-medium ${
              viewMode === 'calendar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Kalender
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Liste
          </button>
        </div>
      </div>

      {/* Stats View */}
      {viewMode === 'stats' && (
        <div>
          {renderStats()}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seneste Træninger</h3>
            <div className="space-y-3">
              {trainingHistory.slice(0, 5).map((training) => (
                <div
                  key={training.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedTraining(training)
                    setShowDetails(true)
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTrainingTypeIcon(training.type)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{training.title}</h4>
                      <p className="text-sm text-gray-600">{formatDate(training.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{training.duration} min</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getIntensityColor(training.intensity)}`}>
                      {getIntensityText(training.intensity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('da-DK', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  I dag
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
              {['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'].map((day) => (
                <div key={day} className="bg-gray-50 p-3 text-center font-medium text-gray-700 border-b border-gray-200">
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Alle Træninger</h2>
            <div className="space-y-4">
              {trainingHistory
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map((training) => (
                  <div
                    key={training.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSelectedTraining(training)
                      setShowDetails(true)
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{getTrainingTypeIcon(training.type)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{training.title}</h3>
                        <p className="text-sm text-gray-600">{formatDate(training.date)}</p>
                        {training.notes && (
                          <p className="text-sm text-gray-500 mt-1">{training.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{training.duration} min</span>
                      </div>
                      {training.calories && (
                        <div className="flex items-center space-x-1">
                          <Zap className="h-4 w-4" />
                          <span>{training.calories} kal</span>
                        </div>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${getIntensityColor(training.intensity)}`}>
                        {getIntensityText(training.intensity)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Training Details Modal */}
      {showDetails && renderTrainingDetails()}
    </div>
  )
}
