-- Sales Database Setup for MyDashboard
-- Add these tables to your existing Supabase database
-- Run this in your Supabase SQL Editor

-- 10. Create sales_items table
CREATE TABLE IF NOT EXISTS public.sales_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  sale_price DECIMAL NOT NULL,
  sale_platform TEXT NOT NULL, -- 'DBA', 'Facebook Marketplace', 'eBay', 'Local', etc.
  sale_date DATE NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Other', -- 'Electronics', 'Furniture', 'Clothing', 'Books', 'Other'
  condition TEXT DEFAULT 'Good', -- 'New', 'Like New', 'Good', 'Fair', 'Poor'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for sales
ALTER TABLE public.sales_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sales
CREATE POLICY "Users can view own sales_items" ON public.sales_items
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_items_user_id ON public.sales_items(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_items_sale_date ON public.sales_items(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_items_platform ON public.sales_items(sale_platform);

-- Insert demo sales data for demo user
INSERT INTO public.sales_items (
  user_id, item_name, sale_price, sale_platform, sale_date, description, category, condition
) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'iPhone 12 Pro', 4500, 'DBA', '2024-01-15', '64GB, Space Gray, excellent condition', 'Electronics', 'Like New'),
  ('550e8400-e29b-41d4-a716-446655440000', 'MacBook Air M1', 8500, 'Facebook Marketplace', '2024-02-03', '256GB SSD, 8GB RAM, barely used', 'Electronics', 'Like New'),
  ('550e8400-e29b-41d4-a716-446655440000', 'IKEA Sofa', 1200, 'DBA', '2024-02-20', 'Gray 3-seater, good condition', 'Furniture', 'Good'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Nike Air Max', 800, 'Local', '2024-03-10', 'Size 42, worn a few times', 'Clothing', 'Like New'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Gaming Chair', 1500, 'eBay', '2024-03-25', 'Ergonomic office chair, black', 'Furniture', 'Good')
ON CONFLICT DO NOTHING;
