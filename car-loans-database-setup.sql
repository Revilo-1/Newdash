-- Car Loans Database Setup for MyDashboard
-- Add these tables to your existing Supabase database
-- Run this in your Supabase SQL Editor

-- 8. Create car_loans table
CREATE TABLE IF NOT EXISTS public.car_loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  car_name TEXT NOT NULL,
  loan_amount DECIMAL NOT NULL,
  remaining_amount DECIMAL NOT NULL,
  monthly_payment DECIMAL NOT NULL,
  interest_rate DECIMAL NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_months INTEGER NOT NULL,
  paid_months INTEGER DEFAULT 0,
  remaining_months INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create car_loan_payments table
CREATE TABLE IF NOT EXISTS public.car_loan_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_loan_id UUID REFERENCES public.car_loans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL,
  amount DECIMAL NOT NULL,
  interest_amount DECIMAL DEFAULT 0,
  principal_amount DECIMAL DEFAULT 0,
  remaining_balance DECIMAL NOT NULL,
  payment_type TEXT DEFAULT 'monthly', -- 'monthly', 'extra'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for car loans
ALTER TABLE public.car_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_loan_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for car loans
CREATE POLICY "Users can view own car_loans" ON public.car_loans
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own car_loan_payments" ON public.car_loan_payments
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_car_loans_user_id ON public.car_loans(user_id);
CREATE INDEX IF NOT EXISTS idx_car_loan_payments_user_id ON public.car_loan_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_car_loan_payments_loan_id ON public.car_loan_payments(car_loan_id);

-- Insert demo car loan for demo user
INSERT INTO public.car_loans (
  id, user_id, car_name, loan_amount, remaining_amount, monthly_payment, 
  interest_rate, start_date, end_date, total_months, paid_months, remaining_months
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  'Tesla Model Y Performance',
  450000,
  280000,
  3200,
  4.5,
  '2023-01-01',
  '2027-12-01',
  60,
  24,
  36
) ON CONFLICT (id) DO UPDATE SET
  loan_amount = EXCLUDED.loan_amount,
  remaining_amount = EXCLUDED.remaining_amount,
  monthly_payment = EXCLUDED.monthly_payment,
  interest_rate = EXCLUDED.interest_rate;

-- Insert demo payment history
INSERT INTO public.car_loan_payments (
  car_loan_id, user_id, payment_date, amount, interest_amount, principal_amount, 
  remaining_balance, payment_type
) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '2024-01-01', 3200, 1687, 1513, 448487, 'monthly'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '2024-02-01', 3200, 1682, 1518, 446969, 'monthly'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '2024-03-01', 3200, 1676, 1524, 445445, 'monthly'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '2024-04-01', 3200, 1670, 1530, 443915, 'monthly'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '2024-05-01', 3200, 1665, 1535, 442380, 'monthly'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '2024-06-01', 3200, 1659, 1541, 440839, 'monthly'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '2024-07-01', 3200, 1653, 1547, 439292, 'monthly'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '2024-08-01', 3200, 1647, 1553, 437739, 'monthly'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '2024-09-01', 3200, 1642, 1558, 436181, 'monthly'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '2024-10-01', 3200, 1636, 1564, 434617, 'monthly'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '2024-11-01', 3200, 1630, 1570, 433047, 'monthly'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '2024-12-01', 3200, 1624, 1576, 431471, 'monthly')
ON CONFLICT DO NOTHING;
