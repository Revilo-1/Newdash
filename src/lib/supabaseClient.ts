import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://keexguzmsxvrdrylqzf.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZXhndXpteHN4dnJkcnlscXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTY3OTAsImV4cCI6MjA3MzAzMjc5MH0.OZdGD29CFF5L9vomooVT045lQRh76U3KBXB2wiLKFuo'

declare global {
  // undgå flere klienter i dev under hot-reload
  // eslint-disable-next-line no-var
  var __supabase__: ReturnType<typeof createClient> | undefined
}

export const supabase =
  globalThis.__supabase__ ??
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__supabase__ = supabase
}

export default supabase
