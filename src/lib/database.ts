import { supabase } from './supabaseClient'

// Database service for MyDashboard
export class DatabaseService {
  // User Management
  static async createUser(email: string, name: string, role: string = 'user') {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, name, role }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Health Metrics
  static async saveHealthMetric(userId: string, metricType: string, value: number, unit: string) {
    const { data, error } = await supabase
      .from('health_metrics')
      .insert([{ user_id: userId, metric_type: metricType, value, unit }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getHealthMetrics(userId: string, metricType?: string) {
    let query = supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
    
    if (metricType) {
      query = query.eq('metric_type', metricType)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  // Training Sessions
  static async saveTrainingSession(userId: string, sessionData: any) {
    const { data, error } = await supabase
      .from('training_sessions')
      .insert([{ user_id: userId, ...sessionData }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getTrainingSessions(userId: string) {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('session_date', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Stock Portfolio
  static async saveStock(userId: string, stockData: any) {
    const { data, error } = await supabase
      .from('stock_portfolio')
      .insert([{ user_id: userId, ...stockData }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getStocks(userId: string) {
    const { data, error } = await supabase
      .from('stock_portfolio')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async updateStock(userId: string, stockId: string, updates: any) {
    const { data, error } = await supabase
      .from('stock_portfolio')
      .update(updates)
      .eq('id', stockId)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteStock(userId: string, stockId: string) {
    const { error } = await supabase
      .from('stock_portfolio')
      .delete()
      .eq('id', stockId)
      .eq('user_id', userId)
    
    if (error) throw error
  }

  // Tasks
  static async saveTask(userId: string, taskData: any) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ user_id: userId, ...taskData }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getTasks(userId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async updateTask(userId: string, taskId: string, updates: any) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Calendar Events
  static async saveCalendarEvent(userId: string, eventData: any) {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([{ user_id: userId, ...eventData }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getCalendarEvents(userId: string) {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data
  }

  // User Profile Management
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async saveUserProfile(userId: string, profileData: any) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert([{ 
        user_id: userId, 
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        birthday: profileData.birthday,
        website: profileData.website
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateUser(userId: string, userData: any) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

export default DatabaseService
