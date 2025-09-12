import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DatabaseService } from '@/lib/database'

export interface UserData {
  healthMetrics: any[]
  trainingSessions: any[]
  stocks: any[]
  tasks: any[]
  calendarEvents: any[]
  loading: boolean
  error: string | null
}

export function useUserData() {
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<UserData>({
    healthMetrics: [],
    trainingSessions: [],
    stocks: [],
    tasks: [],
    calendarEvents: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      loadUserData()
    } else if (status === 'unauthenticated') {
      setUserData(prev => ({ ...prev, loading: false }))
    }
  }, [status, session])

  const loadUserData = async () => {
    if (!session?.user?.id) return

    try {
      setUserData(prev => ({ ...prev, loading: true, error: null }))

      const [healthMetrics, trainingSessions, stocks, tasks, calendarEvents] = await Promise.all([
        DatabaseService.getHealthMetrics(session.user.id),
        DatabaseService.getTrainingSessions(session.user.id),
        DatabaseService.getStocks(session.user.id),
        DatabaseService.getTasks(session.user.id),
        DatabaseService.getCalendarEvents(session.user.id)
      ])

      setUserData({
        healthMetrics: healthMetrics || [],
        trainingSessions: trainingSessions || [],
        stocks: stocks || [],
        tasks: tasks || [],
        calendarEvents: calendarEvents || [],
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Error loading user data:', error)
      setUserData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load user data'
      }))
    }
  }

  const saveHealthMetric = async (metricType: string, value: number, unit: string) => {
    if (!session?.user?.id) return

    try {
      const newMetric = await DatabaseService.saveHealthMetric(session.user.id, metricType, value, unit)
      setUserData(prev => ({
        ...prev,
        healthMetrics: [newMetric, ...prev.healthMetrics]
      }))
      return newMetric
    } catch (error) {
      console.error('Error saving health metric:', error)
      throw error
    }
  }

  const saveTrainingSession = async (sessionData: any) => {
    if (!session?.user?.id) return

    try {
      const newSession = await DatabaseService.saveTrainingSession(session.user.id, sessionData)
      setUserData(prev => ({
        ...prev,
        trainingSessions: [newSession, ...prev.trainingSessions]
      }))
      return newSession
    } catch (error) {
      console.error('Error saving training session:', error)
      throw error
    }
  }

  const saveStock = async (stockData: any) => {
    if (!session?.user?.id) return

    try {
      const newStock = await DatabaseService.saveStock(session.user.id, stockData)
      setUserData(prev => ({
        ...prev,
        stocks: [newStock, ...prev.stocks]
      }))
      return newStock
    } catch (error) {
      console.error('Error saving stock:', error)
      throw error
    }
  }

  const updateStock = async (stockId: string, updates: any) => {
    if (!session?.user?.id) return

    try {
      const updatedStock = await DatabaseService.updateStock(session.user.id, stockId, updates)
      setUserData(prev => ({
        ...prev,
        stocks: prev.stocks.map(stock => 
          stock.id === stockId ? updatedStock : stock
        )
      }))
      return updatedStock
    } catch (error) {
      console.error('Error updating stock:', error)
      throw error
    }
  }

  const deleteStock = async (stockId: string) => {
    if (!session?.user?.id) return

    try {
      await DatabaseService.deleteStock(session.user.id, stockId)
      setUserData(prev => ({
        ...prev,
        stocks: prev.stocks.filter(stock => stock.id !== stockId)
      }))
    } catch (error) {
      console.error('Error deleting stock:', error)
      throw error
    }
  }

  const saveTask = async (taskData: any) => {
    if (!session?.user?.id) return

    try {
      const newTask = await DatabaseService.saveTask(session.user.id, taskData)
      setUserData(prev => ({
        ...prev,
        tasks: [newTask, ...prev.tasks]
      }))
      return newTask
    } catch (error) {
      console.error('Error saving task:', error)
      throw error
    }
  }

  const updateTask = async (taskId: string, updates: any) => {
    if (!session?.user?.id) return

    try {
      const updatedTask = await DatabaseService.updateTask(session.user.id, taskId, updates)
      setUserData(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => 
          task.id === taskId ? updatedTask : task
        )
      }))
      return updatedTask
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  const saveCalendarEvent = async (eventData: any) => {
    if (!session?.user?.id) return

    try {
      const newEvent = await DatabaseService.saveCalendarEvent(session.user.id, eventData)
      setUserData(prev => ({
        ...prev,
        calendarEvents: [...prev.calendarEvents, newEvent].sort(
          (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        )
      }))
      return newEvent
    } catch (error) {
      console.error('Error saving calendar event:', error)
      throw error
    }
  }

  return {
    ...userData,
    session,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    refreshData: loadUserData,
    saveHealthMetric,
    saveTrainingSession,
    saveStock,
    updateStock,
    deleteStock,
    saveTask,
    updateTask,
    saveCalendarEvent
  }
}
