'use client'

import { Calendar, Clock, MapPin, Plus } from 'lucide-react'
import { DashboardMode } from '@/types/dashboard'
import { useState } from 'react'

interface UpcomingEventsProps {
  mode: DashboardMode
}

interface Event {
  id: string
  title: string
  time: string
  location?: string
  type: 'meeting' | 'personal' | 'deadline'
}

const privateEvents: Event[] = [
  { id: '1', title: 'Doctor appointment', time: '2:00 PM', location: 'Medical Center', type: 'personal' },
  { id: '2', title: 'Gym session', time: '6:00 PM', type: 'personal' },
  { id: '3', title: 'Dinner with friends', time: '7:30 PM', location: 'Restaurant', type: 'personal' },
]

const workEvents: Event[] = [
  { id: '1', title: 'Client meeting', time: '10:00 AM', location: 'Conference Room A', type: 'meeting' },
  { id: '2', title: 'Project deadline', time: '5:00 PM', type: 'deadline' },
  { id: '3', title: 'Team standup', time: '9:00 AM', type: 'meeting' },
]

export default function UpcomingEvents({ mode }: UpcomingEventsProps) {
  const [events, setEvents] = useState(mode === 'private' ? privateEvents : workEvents)
  const [newEvent, setNewEvent] = useState('')
  const [showAddEvent, setShowAddEvent] = useState(false)

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Calendar className="h-4 w-4 text-blue-500" />
      case 'deadline':
        return <Clock className="h-4 w-4 text-red-500" />
      default:
        return <Calendar className="h-4 w-4 text-green-500" />
    }
  }

  const addEvent = () => {
    if (newEvent.trim()) {
      const newEventObj: Event = {
        id: Date.now().toString(),
        title: newEvent,
        time: '12:00 PM',
        type: mode === 'private' ? 'personal' : 'meeting'
      }
      setEvents([...events, newEventObj])
      setNewEvent('')
      setShowAddEvent(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowAddEvent(!showAddEvent)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Event
          </button>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View calendar
          </button>
        </div>
      </div>

      {showAddEvent && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              placeholder="Enter new event..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addEvent()}
            />
            <button
              onClick={addEvent}
              className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            {getEventIcon(event.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{event.title}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">{event.time}</span>
                {event.location && (
                  <>
                    <span className="text-xs text-gray-400">•</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{event.location}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
