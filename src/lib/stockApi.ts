// Stock API service for real-time prices and currency conversion
export interface StockPrice {
  symbol: string
  name: string
  price: number
  currency: string
  change: number
  changePercent: number
  lastUpdated: string
}

export interface CurrencyRate {
  from: string
  to: string
  rate: number
  lastUpdated: string
}

export interface StockHolding {
  id: string
  symbol: string
  name: string
  shares: number
  gak: number // Gennemsnitlig AnskaffelsesKurs
  gakCurrency: string
  category: string
  currentPrice?: number
  currentPriceDKK?: number
  marketValue?: number
  marketValueDKK?: number
  profitLoss?: number
  profitLossDKK?: number
  profitLossPercent?: number
  dailyChange?: number
  dailyChangeDKK?: number
  dailyChangePercent?: number
  gakDKK?: number // GAK converted to DKK
}

export class StockApiService {
  private static readonly ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo'
  private static readonly EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || 'demo'
  
  // Cache for prices and rates
  private static priceCache = new Map<string, { data: StockPrice; timestamp: number }>()
  private static rateCache = new Map<string, { data: CurrencyRate; timestamp: number }>()
  private static readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  // Get real-time stock price
  static async getStockPrice(symbol: string): Promise<StockPrice> {
    const cacheKey = symbol.toUpperCase()
    const cached = this.priceCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    try {
      // Try Alpha Vantage first
      const price = await this.getAlphaVantagePrice(symbol)
      this.priceCache.set(cacheKey, { data: price, timestamp: Date.now() })
      return price
    } catch (error) {
      console.warn(`Failed to get price for ${symbol} from Alpha Vantage:`, error)
      
      // Fallback to mock data for demo
      return this.getMockPrice(symbol)
    }
  }

  // Get price from Alpha Vantage API
  private static async getAlphaVantagePrice(symbol: string): Promise<StockPrice> {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.ALPHA_VANTAGE_API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data['Error Message']) {
      throw new Error(data['Error Message'])
    }
    
    const quote = data['Global Quote']
    if (!quote || !quote['05. price']) {
      throw new Error('Invalid response format')
    }
    
    return {
      symbol: symbol.toUpperCase(),
      name: this.getStockName(symbol),
      price: parseFloat(quote['05. price']),
      currency: this.getStockCurrency(symbol),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      lastUpdated: new Date().toISOString()
    }
  }

  // Get mock price for demo purposes
  private static getMockPrice(symbol: string): StockPrice {
    const mockPrices: Record<string, StockPrice> = {
      'ZEAL': {
        symbol: 'ZEAL',
        name: 'Zealand Pharma A/S',
        price: 418.92,
        currency: 'DKK',
        change: -21.08,
        changePercent: -4.79,
        lastUpdated: new Date().toISOString()
      },
      'OPEN': {
        symbol: 'OPEN',
        name: 'Opendoor Technologies',
        price: 9.23,
        currency: 'USD',
        change: -0.54,
        changePercent: -5.53,
        lastUpdated: new Date().toISOString()
      },
      'TSLA': {
        symbol: 'TSLA',
        name: 'Tesla Inc',
        price: 401.44,
        currency: 'USD',
        change: 78.44,
        changePercent: 24.28,
        lastUpdated: new Date().toISOString()
      },
      'CW': {
        symbol: 'CW',
        name: 'CoreWeave',
        price: 116.23,
        currency: 'USD',
        change: 19.11,
        changePercent: 19.67,
        lastUpdated: new Date().toISOString()
      },
      'NOVO-B': {
        symbol: 'NOVO-B',
        name: 'Novo Nordisk B A/S',
        price: 364.25,
        currency: 'DKK',
        change: -60.04,
        changePercent: -14.15,
        lastUpdated: new Date().toISOString()
      }
    }

    return mockPrices[symbol.toUpperCase()] || {
      symbol: symbol.toUpperCase(),
      name: symbol,
      price: 100,
      currency: 'USD',
      change: 0,
      changePercent: 0,
      lastUpdated: new Date().toISOString()
    }
  }

  // Get currency exchange rate
  static async getExchangeRate(from: string, to: string): Promise<CurrencyRate> {
    if (from === to) {
      return {
        from,
        to,
        rate: 1,
        lastUpdated: new Date().toISOString()
      }
    }

    const cacheKey = `${from}-${to}`
    const cached = this.rateCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    try {
      // Try ExchangeRate-API
      const rate = await this.getExchangeRateAPI(from, to)
      this.rateCache.set(cacheKey, { data: rate, timestamp: Date.now() })
      return rate
    } catch (error) {
      console.warn(`Failed to get exchange rate ${from}-${to}:`, error)
      
      // Fallback to mock rate
      return this.getMockExchangeRate(from, to)
    }
  }

  // Get exchange rate from ExchangeRate-API
  private static async getExchangeRateAPI(from: string, to: string): Promise<CurrencyRate> {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      from,
      to,
      rate: data.rates[to],
      lastUpdated: new Date().toISOString()
    }
  }

  // Get mock exchange rate
  private static getMockExchangeRate(from: string, to: string): CurrencyRate {
    const mockRates: Record<string, number> = {
      'USD-DKK': 6.95,
      'DKK-USD': 0.144,
      'EUR-DKK': 7.46,
      'DKK-EUR': 0.134
    }

    const rate = mockRates[`${from}-${to}`] || 1

    return {
      from,
      to,
      rate,
      lastUpdated: new Date().toISOString()
    }
  }

  // Get stock name by symbol
  private static getStockName(symbol: string): string {
    const names: Record<string, string> = {
      'ZEAL': 'Zealand Pharma A/S',
      'OPEN': 'Opendoor Technologies',
      'TSLA': 'Tesla Inc',
      'CW': 'CoreWeave',
      'NOVO-B': 'Novo Nordisk B A/S'
    }
    return names[symbol.toUpperCase()] || symbol
  }

  // Get stock currency by symbol
  private static getStockCurrency(symbol: string): string {
    const currencies: Record<string, string> = {
      'ZEAL': 'DKK',
      'NOVO-B': 'DKK',
      'OPEN': 'USD',
      'TSLA': 'USD',
      'CW': 'USD'
    }
    return currencies[symbol.toUpperCase()] || 'USD'
  }

  // Calculate portfolio value with DKK conversion
  static async calculatePortfolioValue(holdings: StockHolding[]): Promise<StockHolding[]> {
    const updatedHoldings: StockHolding[] = []

    for (const holding of holdings) {
      try {
        // Get current stock price
        const stockPrice = await this.getStockPrice(holding.symbol)
        
        // Get exchange rate if needed
        let exchangeRate = 1
        if (stockPrice.currency !== 'DKK') {
          const rate = await this.getExchangeRate(stockPrice.currency, 'DKK')
          exchangeRate = rate.rate
        }

        // Calculate values
        const currentPrice = stockPrice.price
        const currentPriceDKK = currentPrice * exchangeRate
        const marketValue = currentPrice * holding.shares
        const marketValueDKK = marketValue * exchangeRate
        
        // Calculate GAK values - convert to DKK if needed
        const gakValue = holding.gak * holding.shares
        const gakValueDKK = gakValue * (holding.gakCurrency === 'DKK' ? 1 : exchangeRate)
        const gakDKK = holding.gak * (holding.gakCurrency === 'DKK' ? 1 : exchangeRate)
        
        const profitLoss = marketValue - gakValue
        const profitLossDKK = marketValueDKK - gakValueDKK
        const profitLossPercent = (profitLoss / gakValue) * 100
        const dailyChange = stockPrice.change * holding.shares
        const dailyChangeDKK = dailyChange * exchangeRate
        const dailyChangePercent = stockPrice.changePercent

        updatedHoldings.push({
          ...holding,
          currentPrice,
          currentPriceDKK,
          marketValue,
          marketValueDKK,
          profitLoss,
          profitLossDKK,
          profitLossPercent,
          dailyChange,
          dailyChangeDKK,
          dailyChangePercent,
          gakDKK
        })
      } catch (error) {
        console.error(`Error calculating value for ${holding.symbol}:`, error)
        updatedHoldings.push(holding)
      }
    }

    return updatedHoldings
  }

  // Get multiple stock prices at once
  static async getMultipleStockPrices(symbols: string[]): Promise<StockPrice[]> {
    const promises = symbols.map(symbol => this.getStockPrice(symbol))
    return Promise.all(promises)
  }

  // Clear cache
  static clearCache(): void {
    this.priceCache.clear()
    this.rateCache.clear()
  }
}

export default StockApiService
