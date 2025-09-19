import { NextRequest, NextResponse } from 'next/server'
import { StockApiService } from '@/lib/stockApi'

// GET /api/stocks/prices?symbols=TSLA,ZEAL,OPEN
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get('symbols')
    
    if (!symbols) {
      return NextResponse.json({ error: 'Symbols parameter is required' }, { status: 400 })
    }
    
    const symbolList = symbols.split(',').map(s => s.trim().toUpperCase())
    const prices = await StockApiService.getMultipleStockPrices(symbolList)
    
    return NextResponse.json({ prices })
  } catch (error) {
    console.error('Error fetching stock prices:', error)
    return NextResponse.json({ error: 'Failed to fetch stock prices' }, { status: 500 })
  }
}
