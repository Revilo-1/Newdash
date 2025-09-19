import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { StockApiService, StockHolding } from '@/lib/stockApi'

// GET /api/stocks/portfolio - Get portfolio with live prices
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // For now, return mock portfolio data
    // In a real app, this would come from your database
    const mockHoldings: StockHolding[] = [
      {
        id: '1',
        symbol: 'ZEAL',
        name: 'Zealand Pharma A/S',
        shares: 110,
        gak: 441,
        gakCurrency: 'DKK',
        category: 'Custom'
      },
      {
        id: '2',
        symbol: 'OPEN',
        name: 'Opendoor Technologies',
        shares: 80,
        gak: 9.77,
        gakCurrency: 'USD',
        category: 'Custom'
      },
      {
        id: '3',
        symbol: 'TSLA',
        name: 'Tesla Inc',
        shares: 28,
        gak: 323,
        gakCurrency: 'USD',
        category: 'Custom'
      },
      {
        id: '4',
        symbol: 'CW',
        name: 'CoreWeave',
        shares: 90,
        gak: 97.12,
        gakCurrency: 'USD',
        category: 'Cloud Computing'
      },
      {
        id: '5',
        symbol: 'NOVO-B',
        name: 'Novo Nordisk B A/S',
        shares: 69,
        gak: 424.29,
        gakCurrency: 'DKK',
        category: 'Healthcare'
      },
      {
        id: '6',
        symbol: 'NOVO-B',
        name: 'Novo Nordisk B A/S',
        shares: 195,
        gak: 351.53,
        gakCurrency: 'DKK',
        category: 'Healthcare'
      },
      {
        id: '7',
        symbol: 'OPEN',
        name: 'Opendoor Technologies',
        shares: 420,
        gak: 4.37,
        gakCurrency: 'USD',
        category: 'Real Estate'
      }
    ]
    
    // Calculate live portfolio values
    const portfolioWithPrices = await StockApiService.calculatePortfolioValue(mockHoldings)
    
    return NextResponse.json({ 
      holdings: portfolioWithPrices,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}
