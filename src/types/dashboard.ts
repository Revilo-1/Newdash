export type DashboardMode = 'private' | 'work'

export interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in-progress' | 'completed'
  dueDate?: Date
  category: 'personal' | 'work'
  createdAt: Date
  updatedAt: Date
}

export interface Goal {
  id: string
  title: string
  description?: string
  targetValue: number
  currentValue: number
  unit: string
  category: 'personal' | 'work' | 'financial'
  deadline?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay?: boolean
  description?: string
  category: 'personal' | 'work'
  googleEventId?: string
}

export interface SalesData {
  id: string
  date: Date
  revenue: number
  leads: number
  conversions: number
  category: 'monthly' | 'quarterly' | 'yearly'
}
