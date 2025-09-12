-- Supabase Database Setup for MyDashboard
-- Run this in your Supabase SQL Editor

-- 1. Create users table (extends NextAuth users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create health_metrics table
CREATE TABLE IF NOT EXISTS public.health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- 'weight', 'body_fat', 'bmi', 'activity_level', etc.
  value DECIMAL,
  unit TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create training_sessions table
CREATE TABLE IF NOT EXISTS public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  heart_rate_avg INTEGER,
  intensity TEXT, -- 'low', 'medium', 'high'
  exercises JSONB DEFAULT '[]',
  notes TEXT,
  session_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create stock_portfolio table
CREATE TABLE IF NOT EXISTS public.stock_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  shares INTEGER NOT NULL,
  gak DECIMAL NOT NULL, -- Gennemsnitlig AnskaffelsesKurs
  purchase_date DATE NOT NULL,
  current_price DECIMAL DEFAULT 0,
  market_value DECIMAL DEFAULT 0,
  profit_loss DECIMAL DEFAULT 0,
  profit_loss_percent DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create calendar_events table
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  event_type TEXT DEFAULT 'personal', -- 'personal', 'work', 'training'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own user_profiles" ON public.user_profiles
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own health_metrics" ON public.health_metrics
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own training_sessions" ON public.training_sessions
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own stock_portfolio" ON public.stock_portfolio
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own tasks" ON public.tasks
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own calendar_events" ON public.calendar_events
  FOR ALL USING (auth.uid()::text = user_id::text);

-- 10. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_id ON public.health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_user_id ON public.training_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_portfolio_user_id ON public.stock_portfolio(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON public.calendar_events(user_id);

-- 11. Insert demo user
INSERT INTO public.users (id, email, name) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'demoen@outlook.dk', 'Demo User')
ON CONFLICT (email) DO NOTHING;

-- 12. Insert demo user profile
INSERT INTO public.user_profiles (user_id, bio, preferences) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Demo user for MyDashboard', '{"theme": "light", "language": "da"}')
ON CONFLICT DO NOTHING;
