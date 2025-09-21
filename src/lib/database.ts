import { supabase } from './supabaseClient'
import { createClient } from '@supabase/supabase-js'

// Server-side admin client (bypasses RLS) used from API routes
const supabaseAdmin = (typeof process !== 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    )
  : undefined

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

  // Car Loans
  static async saveCarLoan(userId: string, loanData: any) {
    const { data, error } = await supabase
      .from('car_loans')
      .insert([{ user_id: userId, ...loanData }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getCarLoans(userId: string) {
    const { data, error } = await supabase
      .from('car_loans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async updateCarLoan(userId: string, loanId: string, updates: any) {
    const { data, error } = await supabase
      .from('car_loans')
      .update(updates)
      .eq('id', loanId)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteCarLoan(userId: string, loanId: string) {
    const { error } = await supabase
      .from('car_loans')
      .delete()
      .eq('id', loanId)
      .eq('user_id', userId)
    
    if (error) throw error
  }

  // Car Loan Payments
  static async saveCarLoanPayment(userId: string, paymentData: any) {
    const { data, error } = await supabase
      .from('car_loan_payments')
      .insert([{ user_id: userId, ...paymentData }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getCarLoanPayments(userId: string, loanId?: string) {
    let query = supabase
      .from('car_loan_payments')
      .select('*')
      .eq('user_id', userId)
      .order('payment_date', { ascending: false })
    
    if (loanId) {
      query = query.eq('car_loan_id', loanId)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  static async updateCarLoanPayment(userId: string, paymentId: string, updates: any) {
    const { data, error } = await supabase
      .from('car_loan_payments')
      .update(updates)
      .eq('id', paymentId)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteCarLoanPayment(userId: string, paymentId: string) {
    const { error } = await supabase
      .from('car_loan_payments')
      .delete()
      .eq('id', paymentId)
      .eq('user_id', userId)
    
    if (error) throw error
  }

  // Sales Items
  static async saveSalesItem(userId: string, salesData: any) {
    // First attempt: insert with all provided fields (new schema)
    const writeClient = supabaseAdmin ?? supabase
    let { data, error } = await writeClient
      .from('sales_items')
      .insert([{ user_id: userId, ...salesData }])
      .select()
      .single()

    // Fallbacks for older/minimal schemas
    if (error) {
      const message = typeof error.message === 'string' ? error.message : ''
      // Map new fields -> legacy columns (title, price) and drop unknowns
      const legacyRow: any = {
        title: salesData.item_name ?? salesData.title ?? '',
        price: salesData.sale_price ?? salesData.price ?? 0,
      }
      // Optional sold_for if present in table; try with it first
      if (salesData.sold_for) legacyRow.sold_for = salesData.sold_for

      // Try legacy insert
      let retry = await writeClient
        .from('sales_items')
        .insert([{ user_id: userId, ...legacyRow }])
        .select()
        .single()

      // If legacy insert fails due to sold_for not existing, try without it
      if (retry.error && typeof retry.error.message === 'string' && retry.error.message.includes('sold_for')) {
        const { sold_for, ...withoutSoldFor } = legacyRow
        retry = await writeClient
          .from('sales_items')
          .insert([{ user_id: userId, ...withoutSoldFor }])
          .select()
          .single()
      }
      if (retry.error) throw retry.error
      return retry.data
    }

    if (error) throw error
    return data
  }

  static async getSalesItems(userId: string) {
    const client = supabaseAdmin ?? supabase
    const { data, error } = await client
      .from('sales_items')
      .select('*')
      .eq('user_id', userId)
      .order('sale_date', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async updateSalesItem(userId: string, itemId: string, updates: any) {
    const client = supabaseAdmin ?? supabase
    const { data, error } = await client
      .from('sales_items')
      .update(updates)
      .eq('id', itemId)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteSalesItem(userId: string, itemId: string) {
    const client = supabaseAdmin ?? supabase
    const { error } = await client
      .from('sales_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId)
    
    if (error) throw error
  }

  static async getSalesStats(userId: string) {
    const client = supabaseAdmin ?? supabase
    const { data, error } = await client
      .from('sales_items')
      .select('sale_price, sale_date, sale_platform, sold_for')
      .eq('user_id', userId)
    
    if (error) throw error
    
    const totalSales = data?.reduce((sum, item) => sum + parseFloat(item.sale_price), 0) || 0
    const totalItems = data?.length || 0
    const platforms = [...new Set(data?.map(item => item.sale_platform) || [])]
    
    // Calculate monthly sales
    const monthlySales = data?.reduce((acc, item) => {
      const month = new Date(item.sale_date).toISOString().slice(0, 7) // YYYY-MM
      acc[month] = (acc[month] || 0) + parseFloat(item.sale_price)
      return acc
    }, {} as Record<string, number>) || {}
    
    return {
      totalSales,
      totalItems,
      platforms,
      monthlySales
    }
  }
}

export default DatabaseService
