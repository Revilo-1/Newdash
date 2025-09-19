'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Bell, 
  Plus, 
  MoreVertical, 
  Send, 
  Download, 
  FileText, 
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  TrendingDown,
  Filter,
  CreditCard,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  X,
  Check,
  RefreshCw
} from 'lucide-react'
import { DashboardMode } from '@/types/dashboard'
import { useLanguage } from '@/contexts/LanguageContext'
import { useUserData } from '@/hooks/useUserData'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StockHolding } from '@/lib/stockApi'
import CarLoanView from './CarLoanView'

interface FinanceViewProps {
  mode: DashboardMode
}

interface Stock extends StockHolding {
  logo: string
  categoryColor: string
  purchaseDate: string // Still used internally for database
  gakDKK?: number // GAK converted to DKK
}

interface SearchResult {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

// Mock Nordnet portfolio data - updated to reflect actual portfolio value
const portfolioData = [
  { month: 'Jan', amount: 180000 },
  { month: 'Feb', amount: 185000 },
  { month: 'Mar', amount: 182000 },
  { month: 'Apr', amount: 190000 },
  { month: 'May', amount: 195000 },
  { month: 'Jun', amount: 192000 },
  { month: 'Jul', amount: 200000 },
  { month: 'Aug', amount: 198000 },
  { month: 'Sep', amount: 205000 },
  { month: 'Oct', amount: 202000 },
  { month: 'Nov', amount: 210000 },
  { month: 'Dec', amount: 321541 } // Current actual portfolio value in DKK
]

// Sample upcoming payments
const upcomingPayments = [
  {
    id: '1',
    name: 'Spotify',
    logo: '🎵',
    date: 'Jun 03 2025',
    amount: '$9.99',
    color: 'bg-red-500'
  },
  {
    id: '2',
    name: 'Disney+',
    logo: '🏰',
    date: 'Jul 03 2025',
    amount: '$52.99',
    color: 'bg-blue-500'
  },
  {
    id: '3',
    name: 'Amazon Prime Video',
    logo: '📺',
    date: 'Aug 15 2025',
    amount: '$24.99',
    color: 'bg-gray-800'
  }
]

// Oliver's real stock holdings from Nordnet - updated with actual values
// Note: CoreWeave, Opendoor, and Tesla are USD stocks, Novo Nordisk and Zealand Pharma are DKK
const initialStocks: Stock[] = [
  {
    id: '1',
    name: 'Zealand Pharma A/S',
    symbol: 'ZEAL',
    logo: '📈',
    category: 'Custom',
    categoryColor: 'bg-purple-500',
    shares: 110,
    gak: 441,
    purchaseDate: '2024-01-15',
    currentPrice: 421.90,
    marketValue: 46409.05,
    profitLoss: -2100.95,
    profitLossPercent: -4.33,
    currency: 'DKK'
  },
  {
    id: '2',
    name: 'Opendoor Technologies',
    symbol: 'OPEN',
    logo: '📈',
    category: 'Custom',
    categoryColor: 'bg-purple-500',
    shares: 80,
    gak: 9.77,
    purchaseDate: '2024-02-20',
    currentPrice: 9.28,
    marketValue: 742.43,
    profitLoss: -39.17,
    profitLossPercent: -5.01,
    currency: 'USD'
  },
  {
    id: '3',
    name: 'Tesla',
    symbol: 'TSLA',
    logo: '📈',
    category: 'Custom',
    categoryColor: 'bg-purple-500',
    shares: 28,
    gak: 323,
    purchaseDate: '2024-03-10',
    currentPrice: 402.41,
    marketValue: 11267.35,
    profitLoss: 2223.35,
    profitLossPercent: 24.58,
    currency: 'USD'
  },
  {
    id: '4',
    name: 'CoreWeave',
    symbol: 'CW',
    logo: '☁️',
    category: 'Cloud Computing',
    categoryColor: 'bg-blue-500',
    shares: 90,
    gak: 97.12,
    purchaseDate: '2024-04-05',
    currentPrice: 113.07,
    marketValue: 10176.50,
    profitLoss: 1435.70,
    profitLossPercent: 16.43,
    currency: 'USD'
  },
  {
    id: '5',
    name: 'Novo Nordisk B A/S',
    symbol: 'NOVO-B',
    logo: '💊',
    category: 'Healthcare',
    categoryColor: 'bg-blue-600',
    shares: 69,
    gak: 424.29,
    purchaseDate: '2024-05-10',
    currentPrice: 358.23,
    marketValue: 24717.65,
    profitLoss: -4558.36,
    profitLossPercent: -15.57,
    currency: 'DKK'
  },
  {
    id: '6',
    name: 'Novo Nordisk B A/S',
    symbol: 'NOVO-B-2',
    logo: '💊',
    category: 'Healthcare',
    categoryColor: 'bg-blue-600',
    shares: 195,
    gak: 351.53,
    purchaseDate: '2024-06-15',
    currentPrice: 353.40,
    marketValue: 68912.95,
    profitLoss: 364.60,
    profitLossPercent: 0.53,
    currency: 'DKK'
  },
  {
    id: '7',
    name: 'Opendoor Technologies',
    symbol: 'OPEN-2',
    logo: '🏠',
    category: 'Real Estate',
    categoryColor: 'bg-blue-700',
    shares: 420,
    gak: 4.37,
    purchaseDate: '2024-07-20',
    currentPrice: 8.91,
    marketValue: 3742.44,
    profitLoss: 1907.04,
    profitLossPercent: 103.90,
    currency: 'USD'
  }
]

// Mock search results for stock search
// Note: US stocks in USD, Danish stocks in DKK
const mockSearchResults: SearchResult[] = [
  { symbol: 'CW', name: 'CoreWeave', price: 111.96, change: -0.73, changePercent: -0.65 }, // USD
  { symbol: 'NOVO-B', name: 'Novo Nordisk B A/S', price: 348.30, change: 2.40, changePercent: 0.69 }, // DKK
  { symbol: 'OPEN', name: 'Opendoor Technologies', price: 9.07, change: -1.45, changePercent: -13.78 }, // USD
  { symbol: 'TSLA', name: 'Tesla', price: 395.94, change: 27.12, changePercent: 7.36 }, // USD
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 2.30, changePercent: 1.33 }, // USD
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 380.25, change: -1.75, changePercent: -0.46 }, // USD
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.80, change: 3.20, changePercent: 2.29 }, // USD
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 155.90, change: -0.80, changePercent: -0.51 }, // USD
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 485.60, change: 8.40, changePercent: 1.76 }, // USD
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.30, change: 15.70, changePercent: 1.83 }, // USD
  { symbol: 'ZEAL', name: 'Zealand Pharma A/S', price: 412.40, change: -17.80, changePercent: -4.14 }, // DKK
  { symbol: 'MAERSK-B', name: 'A.P. Møller - Mærsk', price: 12450, change: -180, changePercent: -1.43 }, // DKK
  { symbol: 'DSV', name: 'DSV', price: 1250, change: 25, changePercent: 2.04 }, // DKK
  { symbol: 'ORSTED', name: 'Ørsted', price: 426, change: -8, changePercent: -1.84 }, // DKK
  { symbol: 'CARL-B', name: 'Carlsberg', price: 980, change: 15, changePercent: 1.55 }, // DKK
  { symbol: 'VWS', name: 'Vestas Wind Systems', price: 185.5, change: 3.2, changePercent: 1.75 } // DKK
]

export default function FinanceView({ mode }: FinanceViewProps) {
  const { t } = useLanguage()
  const { stocks: dbStocks, saveStock, updateStock, deleteStock, loading, error } = useUserData()
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y')
  const [stocks, setStocks] = useState<Stock[]>([])
  const [portfolioLoading, setPortfolioLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState<'stocks' | 'car-loans'>('stocks')
  
  // Load portfolio with live prices
  const loadPortfolio = async () => {
    try {
      setPortfolioLoading(true)
      const response = await fetch('/api/stocks/portfolio')
      if (!response.ok) throw new Error('Failed to fetch portfolio')
      
      const data = await response.json()
      
      // Transform API data to match our Stock interface
      const formattedStocks: Stock[] = data.holdings.map((holding: any) => ({
        id: holding.id,
        name: holding.name,
        symbol: holding.symbol,
        logo: '📈',
        category: holding.category,
        categoryColor: getCategoryColor(holding.category),
        shares: holding.shares,
        gak: holding.gakDKK || holding.gak, // Use DKK GAK if available
        gakCurrency: holding.gakCurrency,
        purchaseDate: new Date().toISOString().split('T')[0],
        currentPrice: holding.currentPriceDKK || holding.currentPrice,
        marketValue: holding.marketValueDKK || holding.marketValue,
        profitLoss: holding.profitLossDKK || holding.profitLoss,
        profitLossPercent: holding.profitLossPercent,
        currency: 'DKK' as const,
        currentPriceDKK: holding.currentPriceDKK,
        marketValueDKK: holding.marketValueDKK,
        profitLossDKK: holding.profitLossDKK,
        dailyChange: holding.dailyChangeDKK || holding.dailyChange,
        dailyChangePercent: holding.dailyChangePercent,
        gakDKK: holding.gakDKK
      }))
      
      setStocks(formattedStocks)
      setLastUpdated(new Date(data.lastUpdated))
    } catch (err) {
      console.error('Error loading portfolio:', err)
      // Fallback to initial stocks if API fails
      setStocks(initialStocks)
    } finally {
      setPortfolioLoading(false)
    }
  }
  
  // Load portfolio on component mount
  useEffect(() => {
    loadPortfolio()
  }, [])
  
  // Helper function to get category color
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Custom': 'bg-purple-500',
      'Cloud Computing': 'bg-blue-500',
      'Healthcare': 'bg-green-500',
      'Real Estate': 'bg-orange-500',
      'Technology': 'bg-indigo-500'
    }
    return colors[category] || 'bg-gray-500'
  }
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedStock, setSelectedStock] = useState<SearchResult | null>(null)
  const [shares, setShares] = useState('')
  const [gak, setGak] = useState('')
  const [editingStock, setEditingStock] = useState<Stock | null>(null)

  // Simulate real-time price updates (more realistic)
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          // Much smaller, more realistic price changes (±0.1% to ±0.5%)
          const change = (Math.random() - 0.5) * 0.01 // ±0.5% change
          const newPrice = Math.max(0.01, stock.currentPrice + (stock.currentPrice * change))
          const newMarketValue = stock.shares * newPrice
          const newProfitLoss = newMarketValue - (stock.shares * stock.gak)
          const newProfitLossPercent = (newProfitLoss / (stock.shares * stock.gak)) * 100
          
          return {
            ...stock,
            currentPrice: parseFloat(newPrice.toFixed(2)),
            marketValue: parseFloat(newMarketValue.toFixed(2)),
            profitLoss: parseFloat(newProfitLoss.toFixed(2)),
            profitLossPercent: parseFloat(newProfitLossPercent.toFixed(2))
          }
        })
      )
    }, 10000) // Update every 10 seconds (less frequent)

    return () => clearInterval(interval)
  }, [])

  // Search functionality
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = mockSearchResults.filter(stock => 
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  // Calculate total portfolio value
  const totalPortfolioValue = stocks.reduce((sum, stock) => sum + stock.marketValue, 0)
  const totalProfitLoss = stocks.reduce((sum, stock) => sum + stock.profitLoss, 0)
  const totalProfitLossPercent = (totalProfitLoss / (totalPortfolioValue - totalProfitLoss)) * 100
  
  // Calculate USD and DKK totals separately
  const usdStocks = stocks.filter(stock => stock.currency === 'USD')
  const dkkStocks = stocks.filter(stock => stock.currency === 'DKK')
  const totalUSDValue = usdStocks.reduce((sum, stock) => sum + stock.marketValue, 0)
  const totalDKKValue = dkkStocks.reduce((sum, stock) => sum + stock.marketValue, 0)
  const totalUSDProfitLoss = usdStocks.reduce((sum, stock) => sum + stock.profitLoss, 0)
  const totalDKKProfitLoss = dkkStocks.reduce((sum, stock) => sum + stock.profitLoss, 0)
  
  // Convert USD to DKK for total portfolio value (1 USD = 7.0 DKK)
  const usdToDkkRate = 7.0
  const totalPortfolioValueInDKK = totalDKKValue + (totalUSDValue * usdToDkkRate)
  const totalProfitLossInDKK = totalDKKProfitLoss + (totalUSDProfitLoss * usdToDkkRate)

  // Stock management functions
  const handleAddStock = async () => {
    console.log('handleAddStock called', { selectedStock, shares, gak })

    if (!selectedStock || !shares || !gak) {
      console.log('Missing required fields')
      return
    }

    try {
        const sharesNum = parseInt(shares)
        const gakNum = parseFloat(gak)
        const currentPrice = selectedStock.price
        const marketValue = sharesNum * currentPrice
        const totalCost = sharesNum * gakNum
        const profitLoss = marketValue - totalCost
        const profitLossPercent = (profitLoss / totalCost) * 100

        // Determine currency based on stock symbol/name
        const isUSDStock = selectedStock.symbol.includes('TSLA') || 
                          selectedStock.symbol.includes('OPEN') || 
                          selectedStock.symbol.includes('CW') ||
                          selectedStock.name.toLowerCase().includes('tesla') ||
                          selectedStock.name.toLowerCase().includes('opendoor') ||
                          selectedStock.name.toLowerCase().includes('coreweave') ||
                          selectedStock.name.toLowerCase().includes('apple') ||
                          selectedStock.name.toLowerCase().includes('microsoft') ||
                          selectedStock.name.toLowerCase().includes('google') ||
                          selectedStock.name.toLowerCase().includes('amazon') ||
                          selectedStock.name.toLowerCase().includes('meta') ||
                          selectedStock.name.toLowerCase().includes('nvidia')
        
        const stockData = {
          name: selectedStock.name,
          symbol: selectedStock.symbol,
          logo: '📈',
          category: 'Custom',
          categoryColor: 'bg-purple-500',
          shares: sharesNum,
          gak: gakNum,
          purchase_date: new Date().toISOString().split('T')[0], // Use current date
          current_price: currentPrice,
          market_value: parseFloat(marketValue.toFixed(2)),
          profit_loss: parseFloat(profitLoss.toFixed(2)),
          profit_loss_percent: parseFloat(profitLossPercent.toFixed(2)),
          currency: isUSDStock ? 'USD' : 'DKK'
        }

      console.log('Saving stock data:', stockData)
      
      // Try to save to database first
      try {
        await saveStock(stockData)
        console.log('Stock saved to database successfully')
      } catch (dbError) {
        console.log('Database save failed, adding locally:', dbError)
        // Fallback: add to local state if database fails
        const newStock: Stock = {
          id: Date.now().toString(),
          name: stockData.name,
          symbol: stockData.symbol,
          logo: stockData.logo,
          category: stockData.category,
          categoryColor: stockData.categoryColor,
          shares: stockData.shares,
          gak: stockData.gak,
          purchaseDate: stockData.purchase_date,
          currentPrice: parseFloat(stockData.current_price.toFixed(2)),
          marketValue: parseFloat(stockData.market_value.toFixed(2)),
          profitLoss: parseFloat(stockData.profit_loss.toFixed(2)),
          profitLossPercent: parseFloat(stockData.profit_loss_percent.toFixed(2)),
          currency: stockData.currency
        }
        setStocks(prev => [newStock, ...prev])
        console.log('Stock added locally')
      }
      
      setShowAddModal(false)
      setSearchQuery('')
      setSelectedStock(null)
      setShares('')
      setGak('')
    } catch (error) {
      console.error('Error adding stock:', error)
      alert('Fejl ved tilføjelse af aktie: ' + error.message)
    }
  }

  const handleDeleteStock = async (id: string) => {
    try {
      await deleteStock(id)
      console.log('Stock deleted from database successfully')
    } catch (error) {
      console.log('Database delete failed, deleting locally:', error)
      // Fallback: delete from local state if database fails
      setStocks(prev => prev.filter(stock => stock.id !== id))
      console.log('Stock deleted locally')
    }
  }

  const handleEditStock = (stock: Stock) => {
    setEditingStock(stock)
    setSelectedStock({ symbol: stock.symbol, name: stock.name, price: stock.currentPrice, change: 0, changePercent: 0 })
    setShares(stock.shares.toString())
    setGak(stock.gak.toString())
    setShowAddModal(true)
  }

  const handleUpdateStock = async () => {
    console.log('handleUpdateStock called', { editingStock, selectedStock, shares, gak })

    if (!editingStock || !selectedStock || !shares || !gak) {
      console.log('Missing required fields for update')
      return
    }

    try {
      const sharesNum = parseInt(shares)
      const gakNum = parseFloat(gak)
      const currentPrice = selectedStock.price
      const marketValue = sharesNum * currentPrice
      const totalCost = sharesNum * gakNum
      const profitLoss = marketValue - totalCost
      const profitLossPercent = (profitLoss / totalCost) * 100

      const updates = {
        name: selectedStock.name,
        symbol: selectedStock.symbol,
        shares: sharesNum,
        gak: gakNum,
        purchase_date: new Date().toISOString().split('T')[0], // Use current date
        current_price: currentPrice,
        market_value: parseFloat(marketValue.toFixed(2)),
        profit_loss: parseFloat(profitLoss.toFixed(2)),
        profit_loss_percent: parseFloat(profitLossPercent.toFixed(2))
      }

      console.log('Updating stock with data:', updates)
      
      // Try to update in database first
      try {
        await updateStock(editingStock.id, updates)
        console.log('Stock updated in database successfully')
      } catch (dbError) {
        console.log('Database update failed, updating locally:', dbError)
        // Fallback: update local state if database fails
        const updatedStock: Stock = {
          ...editingStock,
          name: updates.name,
          symbol: updates.symbol,
          shares: updates.shares,
          gak: updates.gak,
          purchaseDate: updates.purchase_date,
          currentPrice: parseFloat(updates.current_price.toFixed(2)),
          marketValue: parseFloat(updates.market_value.toFixed(2)),
          profitLoss: parseFloat(updates.profit_loss.toFixed(2)),
          profitLossPercent: parseFloat(updates.profit_loss_percent.toFixed(2))
        }
        setStocks(prev => prev.map(stock => stock.id === editingStock.id ? updatedStock : stock))
        console.log('Stock updated locally')
      }
      
      setShowAddModal(false)
      setEditingStock(null)
      setSearchQuery('')
      setSelectedStock(null)
      setShares('')
      setGak('')
    } catch (error) {
      console.error('Error updating stock:', error)
      alert('Fejl ved opdatering af aktie: ' + error.message)
    }
  }

  // Only show this page for private dashboard
  if (mode !== 'private') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Økonomi kun tilgængelig i Privat Mode</h3>
          <p className="text-gray-600">Skift til Privat Mode for at se din økonomi</p>
        </div>
      </div>
    )
  }

  const timeframes = ['1D', '5D', '1M', '1Y', 'All']

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Økonomi</h1>
          <p className="text-gray-600">Administrer dine aktier og billån</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <Plus className="h-4 w-4 mr-2" />
            Tilføj Transaktion
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('stocks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stocks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Aktieportefølje
          </button>
          <button
            onClick={() => setActiveTab('car-loans')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'car-loans'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Billån
          </button>
        </nav>
      </div>

      {/* Conditional Content */}
      {activeTab === 'stocks' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - My Card & Upcoming Payments */}
        <div className="lg:col-span-1 space-y-6">
          {/* My Card Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Mit Kort</h2>
              <div className="flex items-center space-x-2">
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  + Tilføj Kort
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Portfolio Value */}
            <div className="mb-6">
              <div className="space-y-2">
                {totalUSDValue > 0 && (
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalUSDValue.toLocaleString('da-DK')} USD</p>
                    <p className={`text-sm ${totalUSDProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalUSDProfitLoss >= 0 ? '+' : ''}{totalUSDProfitLoss.toLocaleString('da-DK')} USD
                    </p>
                  </div>
                )}
                {totalDKKValue > 0 && (
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalDKKValue.toLocaleString('da-DK')} DKK</p>
                    <p className={`text-sm ${totalDKKProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalDKKProfitLoss >= 0 ? '+' : ''}{totalDKKProfitLoss.toLocaleString('da-DK')} DKK
                    </p>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">Portefølje Værdi</p>
            </div>


            {/* Quick Actions */}
            <div className="grid grid-cols-5 gap-4">
              <button className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Send className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-xs text-gray-600">Send</span>
              </button>
              <button className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="p-2 bg-green-100 rounded-full">
                  <Download className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-xs text-gray-600">Modtag</span>
              </button>
              <button className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Plus className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-xs text-gray-600">Anmod</span>
              </button>
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Kommende Betalinger</h2>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-10 h-10 ${payment.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                    {payment.logo}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{payment.name}</p>
                    <p className="text-sm text-gray-600">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{payment.amount}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Tilføj Flere Påmindelser
            </button>
          </div>
        </div>

        {/* Right Column - Expenses, Summary, Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Expenses Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Nordnet</h2>
              <div className="flex items-center space-x-2">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      selectedTimeframe === timeframe
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280" 
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={12} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`${value.toLocaleString()} DKK`, 'Portefølje Værdi']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{totalPortfolioValueInDKK.toLocaleString('da-DK')} DKK</p>
              <p className={`text-sm ${totalProfitLossInDKK >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalProfitLossInDKK >= 0 ? '+' : ''}{totalProfitLossInDKK.toLocaleString('da-DK')} DKK ({((totalProfitLossInDKK / (totalPortfolioValueInDKK - totalProfitLossInDKK)) * 100).toFixed(2)}%)
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ArrowUpRight className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Aktier</p>
                  <p className="text-2xl font-bold text-gray-900">{stocks.length}</p>
                  <p className="text-xs text-gray-500">Aktier i porteføljen</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Portefølje Værdi</p>
                  <p className="text-2xl font-bold text-green-600">+{totalPortfolioValueInDKK.toLocaleString('da-DK')} DKK</p>
                  <p className="text-xs text-gray-500">Total portefølje værdi</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Gevinst/Tab</p>
                  <p className={`text-2xl font-bold ${totalProfitLossInDKK >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalProfitLossInDKK >= 0 ? '+' : ''}{totalProfitLossInDKK.toLocaleString('da-DK')} DKK
                  </p>
                  <p className={`text-xs ${totalProfitLossInDKK >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {totalProfitLossInDKK >= 0 ? '+' : ''}{((totalProfitLossInDKK / (totalPortfolioValueInDKK - totalProfitLossInDKK)) * 100).toFixed(2)}% totalt
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Holdings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Aktie Holdings</h2>
                {lastUpdated && (
                  <p className="text-sm text-gray-500 mt-1">
                    Live priser - Opdateret {lastUpdated.toLocaleTimeString('da-DK')}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={loadPortfolio}
                  disabled={portfolioLoading}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${portfolioLoading ? 'animate-spin' : ''}`} />
                  Opdater
                </button>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Tilføj Aktie
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600">Live priser - Opdateret nu</p>
            </div>

            <div className="space-y-4">
              {stocks.map((stock) => (
                <div key={stock.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                    {stock.logo}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{stock.name}</p>
                    <p className="text-sm text-gray-600">
                      {stock.symbol} • {stock.shares} aktier • GAK: {stock.gakDKK ? stock.gakDKK.toLocaleString('da-DK') : stock.gak.toLocaleString('da-DK')} DKK
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${stock.categoryColor} rounded-sm`}></div>
                    <span className="text-sm text-gray-600">{stock.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {stock.marketValueDKK ? stock.marketValueDKK.toLocaleString('da-DK') : stock.marketValue.toLocaleString('da-DK')} DKK
                    </p>
                    <p className={`text-sm ${stock.profitLossDKK ? (stock.profitLossDKK >= 0 ? 'text-green-600' : 'text-red-600') : (stock.profitLoss >= 0 ? 'text-green-600' : 'text-red-600')}`}>
                      {stock.profitLossDKK ? (
                        <>
                          {stock.profitLossDKK >= 0 ? '+' : ''}{stock.profitLossDKK.toLocaleString('da-DK')} DKK ({stock.profitLossPercent >= 0 ? '+' : ''}{stock.profitLossPercent.toFixed(2)}%)
                        </>
                      ) : (
                        <>
                          {stock.profitLoss >= 0 ? '+' : ''}{stock.profitLoss.toLocaleString('da-DK')} {stock.currency} ({stock.profitLossPercent >= 0 ? '+' : ''}{stock.profitLossPercent.toFixed(2)}%)
                        </>
                      )}
                    </p>
                    {stock.dailyChange && (
                      <p className={`text-xs ${stock.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.dailyChange >= 0 ? '+' : ''}{stock.dailyChange.toLocaleString('da-DK')} DKK ({stock.dailyChangePercent >= 0 ? '+' : ''}{stock.dailyChangePercent.toFixed(2)}%)
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleEditStock(stock)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteStock(stock.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingStock ? 'Rediger Aktie' : 'Tilføj Ny Aktie'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddModal(false)
                  setEditingStock(null)
                  setSearchQuery('')
                  setSelectedStock(null)
                  setShares('')
                  setGak('')
                  setPurchaseDate('')
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Stock Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Søg Aktie
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Skriv aktie navn eller symbol..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-md max-h-40 overflow-y-auto">
                    {searchResults.map((result) => (
                      <button
                        key={result.symbol}
                        onClick={() => {
                          setSelectedStock(result)
                          setSearchQuery(`${result.name} (${result.symbol})`)
                          setSearchResults([])
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{result.name}</p>
                            <p className="text-sm text-gray-600">{result.symbol}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{result.price.toLocaleString('da-DK')} {result.symbol.includes('TSLA') || result.symbol.includes('OPEN') || result.symbol.includes('CW') || result.symbol.includes('AAPL') || result.symbol.includes('MSFT') || result.symbol.includes('GOOGL') || result.symbol.includes('AMZN') || result.symbol.includes('META') || result.symbol.includes('NVDA') ? 'USD' : 'DKK'}</p>
                            <p className={`text-sm ${result.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {result.change >= 0 ? '+' : ''}{result.change.toLocaleString('da-DK')} {result.symbol.includes('TSLA') || result.symbol.includes('OPEN') || result.symbol.includes('CW') || result.symbol.includes('AAPL') || result.symbol.includes('MSFT') || result.symbol.includes('GOOGL') || result.symbol.includes('AMZN') || result.symbol.includes('META') || result.symbol.includes('NVDA') ? 'USD' : 'DKK'} ({result.changePercent >= 0 ? '+' : ''}{result.changePercent.toFixed(2)}%)
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Stock Display */}
              {selectedStock && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="font-medium text-gray-900">{selectedStock.name}</p>
                  <p className="text-sm text-gray-600">{selectedStock.symbol} • {selectedStock.price.toLocaleString('da-DK')} {selectedStock.symbol.includes('TSLA') || selectedStock.symbol.includes('OPEN') || selectedStock.symbol.includes('CW') || selectedStock.symbol.includes('AAPL') || selectedStock.symbol.includes('MSFT') || selectedStock.symbol.includes('GOOGL') || selectedStock.symbol.includes('AMZN') || selectedStock.symbol.includes('META') || selectedStock.symbol.includes('NVDA') ? 'USD' : 'DKK'}</p>
                </div>
              )}

              {/* Shares Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Antal Aktier
                </label>
                <input
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="F.eks. 100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* GAK Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GAK (Gennemsnitlig AnskaffelsesKurs)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={gak}
                  onChange={(e) => setGak(e.target.value)}
                  placeholder="F.eks. 850.50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>


              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingStock(null)
                    setSearchQuery('')
                    setSelectedStock(null)
                    setShares('')
                    setGak('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Annuller
                </button>
                <button
                  onClick={editingStock ? handleUpdateStock : handleAddStock}
                  disabled={!selectedStock || !shares || !gak}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {editingStock ? 'Opdater' : 'Tilføj'} Aktie
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      ) : (
        <CarLoanView />
      )}
    </div>
  )
}
