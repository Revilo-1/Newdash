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
  PiggyBank,
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
  Check
} from 'lucide-react'
import { DashboardMode } from '@/types/dashboard'
import { useLanguage } from '@/contexts/LanguageContext'
import { useUserData } from '@/hooks/useUserData'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface FinanceViewProps {
  mode: DashboardMode
}

interface Stock {
  id: string
  name: string
  symbol: string
  logo: string
  category: string
  categoryColor: string
  shares: number
  gak: number // Gennemsnitlig AnskaffelsesKurs
  purchaseDate: string
  currentPrice: number
  marketValue: number
  profitLoss: number
  profitLossPercent: number
}

interface SearchResult {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

// Mock Nordnet portfolio data
const portfolioData = [
  { month: 'Jan', amount: 280000 },
  { month: 'Feb', amount: 285000 },
  { month: 'Mar', amount: 282000 },
  { month: 'Apr', amount: 290000 },
  { month: 'May', amount: 295000 },
  { month: 'Jun', amount: 292000 },
  { month: 'Jul', amount: 300000 },
  { month: 'Aug', amount: 298000 },
  { month: 'Sep', amount: 305000 },
  { month: 'Oct', amount: 302000 },
  { month: 'Nov', amount: 310000 },
  { month: 'Dec', amount: 300000 }
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

// Oliver's real stock holdings from Nordnet
const initialStocks: Stock[] = [
  {
    id: '1',
    name: 'CoreWeave',
    symbol: 'CW',
    logo: '☁️',
    category: 'Cloud Computing',
    categoryColor: 'bg-blue-500',
    shares: 90,
    gak: 97.12,
    purchaseDate: '2024-01-15',
    currentPrice: 111.96,
    marketValue: 64086,
    profitLoss: 7884,
    profitLossPercent: 14.03
  },
  {
    id: '2',
    name: 'Novo Nordisk B A/S',
    symbol: 'NOVO-B',
    logo: '💊',
    category: 'Healthcare',
    categoryColor: 'bg-blue-600',
    shares: 69,
    gak: 424.29,
    purchaseDate: '2024-02-20',
    currentPrice: 348.30,
    marketValue: 24033,
    profitLoss: -5244,
    profitLossPercent: -17.91
  },
  {
    id: '3',
    name: 'Novo Nordisk B A/S',
    symbol: 'NOVO-B-2',
    logo: '💊',
    category: 'Healthcare',
    categoryColor: 'bg-blue-600',
    shares: 195,
    gak: 351.53,
    purchaseDate: '2024-03-10',
    currentPrice: 348.30,
    marketValue: 67918,
    profitLoss: -630,
    profitLossPercent: -0.92
  },
  {
    id: '4',
    name: 'Opendoor Technologies',
    symbol: 'OPEN',
    logo: '🏠',
    category: 'Real Estate',
    categoryColor: 'bg-blue-700',
    shares: 420,
    gak: 4.37,
    purchaseDate: '2024-04-05',
    currentPrice: 9.07,
    marketValue: 24228,
    profitLoss: 12429,
    profitLossPercent: 105.35
  }
]

// Mock search results for stock search
const mockSearchResults: SearchResult[] = [
  { symbol: 'CW', name: 'CoreWeave', price: 111.96, change: -0.73, changePercent: -0.65 },
  { symbol: 'NOVO-B', name: 'Novo Nordisk B A/S', price: 348.30, change: 2.40, changePercent: 0.69 },
  { symbol: 'OPEN', name: 'Opendoor Technologies', price: 9.07, change: -1.45, changePercent: -13.78 },
  { symbol: 'TSLA', name: 'Tesla', price: 395.94, change: 27.12, changePercent: 7.36 },
  { symbol: 'ZEAL', name: 'Zealand Pharma A/S', price: 412.40, change: -17.80, changePercent: -4.14 },
  { symbol: 'MAERSK-B', name: 'A.P. Møller - Mærsk', price: 12450, change: -180, changePercent: -1.43 },
  { symbol: 'DSV', name: 'DSV', price: 1250, change: 25, changePercent: 2.04 },
  { symbol: 'ORSTED', name: 'Ørsted', price: 426, change: -8, changePercent: -1.84 },
  { symbol: 'CARL-B', name: 'Carlsberg', price: 980, change: 15, changePercent: 1.55 },
  { symbol: 'VWS', name: 'Vestas Wind Systems', price: 185.5, change: 3.2, changePercent: 1.75 }
]

export default function FinanceView({ mode }: FinanceViewProps) {
  const { t } = useLanguage()
  const { stocks: dbStocks, saveStock, updateStock, deleteStock, loading, error } = useUserData()
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y')
  const [stocks, setStocks] = useState<Stock[]>(initialStocks)
  
  // Update stocks when database data changes
  useEffect(() => {
    if (dbStocks && dbStocks.length > 0) {
      const formattedStocks = dbStocks.map(stock => ({
        id: stock.id,
        name: stock.name,
        symbol: stock.symbol,
        logo: stock.logo || '📈',
        category: stock.category || 'Custom',
        categoryColor: stock.categoryColor || 'bg-purple-500',
        shares: stock.shares,
        gak: stock.gak,
        purchaseDate: stock.purchase_date,
        currentPrice: stock.current_price,
        marketValue: stock.market_value,
        profitLoss: stock.profit_loss,
        profitLossPercent: stock.profit_loss_percent
      }))
      setStocks(formattedStocks)
    }
  }, [dbStocks])
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedStock, setSelectedStock] = useState<SearchResult | null>(null)
  const [shares, setShares] = useState('')
  const [gak, setGak] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [editingStock, setEditingStock] = useState<Stock | null>(null)

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          // Simulate small price changes
          const change = (Math.random() - 0.5) * 0.02 // ±1% change
          const newPrice = Math.max(0, stock.currentPrice + (stock.currentPrice * change))
          const newMarketValue = stock.shares * newPrice
          const newProfitLoss = newMarketValue - (stock.shares * stock.gak)
          const newProfitLossPercent = (newProfitLoss / (stock.shares * stock.gak)) * 100
          
          return {
            ...stock,
            currentPrice: newPrice,
            marketValue: newMarketValue,
            profitLoss: newProfitLoss,
            profitLossPercent: newProfitLossPercent
          }
        })
      )
    }, 5000) // Update every 5 seconds

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

  // Stock management functions
  const handleAddStock = async () => {
    console.log('handleAddStock called', { selectedStock, shares, gak, purchaseDate })
    
    if (!selectedStock || !shares || !gak || !purchaseDate) {
      console.log('Missing required fields')
      return
    }

    try {
      const stockData = {
        name: selectedStock.name,
        symbol: selectedStock.symbol,
        logo: '📈',
        category: 'Custom',
        categoryColor: 'bg-purple-500',
        shares: parseInt(shares),
        gak: parseFloat(gak),
        purchase_date: purchaseDate,
        current_price: selectedStock.price,
        market_value: parseInt(shares) * selectedStock.price,
        profit_loss: (parseInt(shares) * selectedStock.price) - (parseInt(shares) * parseFloat(gak)),
        profit_loss_percent: ((selectedStock.price - parseFloat(gak)) / parseFloat(gak)) * 100
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
          currentPrice: stockData.current_price,
          marketValue: stockData.market_value,
          profitLoss: stockData.profit_loss,
          profitLossPercent: stockData.profit_loss_percent
        }
        setStocks(prev => [newStock, ...prev])
        console.log('Stock added locally')
      }
      
      setShowAddModal(false)
      setSearchQuery('')
      setSelectedStock(null)
      setShares('')
      setGak('')
      setPurchaseDate('')
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
    setPurchaseDate(stock.purchaseDate)
    setShowAddModal(true)
  }

  const handleUpdateStock = async () => {
    console.log('handleUpdateStock called', { editingStock, selectedStock, shares, gak, purchaseDate })
    
    if (!editingStock || !selectedStock || !shares || !gak || !purchaseDate) {
      console.log('Missing required fields for update')
      return
    }

    try {
      const updates = {
        name: selectedStock.name,
        symbol: selectedStock.symbol,
        shares: parseInt(shares),
        gak: parseFloat(gak),
        purchase_date: purchaseDate,
        current_price: selectedStock.price,
        market_value: parseInt(shares) * selectedStock.price,
        profit_loss: (parseInt(shares) * selectedStock.price) - (parseInt(shares) * parseFloat(gak)),
        profit_loss_percent: ((selectedStock.price - parseFloat(gak)) / parseFloat(gak)) * 100
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
          currentPrice: updates.current_price,
          marketValue: updates.market_value,
          profitLoss: updates.profit_loss,
          profitLossPercent: updates.profit_loss_percent
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
      setPurchaseDate('')
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
      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
          <li>
            <div>
              <span className="text-gray-500">Home</span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="text-gray-400">/</span>
              <span className="ml-4 text-gray-500">Økonomi</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Økonomi</h1>
          <p className="mt-2 text-base sm:text-lg lg:text-xl text-gray-600">
            Administrer din økonomi og følg dine udgifter
          </p>
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
              <p className="text-3xl font-bold text-gray-900">{totalPortfolioValue.toLocaleString('da-DK')} kr</p>
              <p className="text-sm text-gray-600">Portefølje Værdi</p>
              <p className={`text-sm ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toLocaleString('da-DK')} kr ({totalProfitLossPercent >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%)
              </p>
            </div>

            {/* Virtual Card */}
            <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Ucok Sayuti</span>
                <span className="text-sm font-bold">VISA</span>
              </div>
              <div className="text-xl font-bold tracking-wider">
                3255 3422 6456 4634
              </div>
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
              <button className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="p-2 bg-orange-100 rounded-full">
                  <FileText className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-xs text-gray-600">Faktura</span>
              </button>
              <button className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="p-2 bg-pink-100 rounded-full">
                  <PiggyBank className="h-4 w-4 text-pink-600" />
                </div>
                <span className="text-xs text-gray-600">Donér</span>
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
                    formatter={(value) => [`${value.toLocaleString()} kr`, 'Portefølje Værdi']}
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
              <p className="text-2xl font-bold text-gray-900">{totalPortfolioValue.toLocaleString('da-DK')} kr</p>
              <p className={`text-sm ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}% i dag
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
                  <p className="text-2xl font-bold text-green-600">+{totalPortfolioValue.toLocaleString('da-DK')} kr</p>
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
                  <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toLocaleString('da-DK')} kr
                  </p>
                  <p className={`text-xs ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}% totalt
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Holdings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Aktie Holdings</h2>
              <div className="flex items-center space-x-2">
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
                    <p className="text-sm text-gray-600">{stock.symbol} • {stock.shares} aktier • GAK: {stock.gak.toLocaleString('da-DK')} kr</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${stock.categoryColor} rounded-sm`}></div>
                    <span className="text-sm text-gray-600">{stock.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{stock.marketValue.toLocaleString('da-DK')} kr</p>
                    <p className={`text-sm ${stock.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.profitLoss >= 0 ? '+' : ''}{stock.profitLoss.toLocaleString('da-DK')} kr ({stock.profitLossPercent >= 0 ? '+' : ''}{stock.profitLossPercent.toFixed(2)}%)
                    </p>
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
                            <p className="font-medium text-gray-900">{result.price.toLocaleString('da-DK')} kr</p>
                            <p className={`text-sm ${result.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {result.change >= 0 ? '+' : ''}{result.change.toLocaleString('da-DK')} kr ({result.changePercent >= 0 ? '+' : ''}{result.changePercent.toFixed(2)}%)
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
                  <p className="text-sm text-gray-600">{selectedStock.symbol} • {selectedStock.price.toLocaleString('da-DK')} kr</p>
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

              {/* Purchase Date Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Købsdato
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
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
                    setPurchaseDate('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Annuller
                </button>
                <button
                  onClick={editingStock ? handleUpdateStock : handleAddStock}
                  disabled={!selectedStock || !shares || !gak || !purchaseDate}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {editingStock ? 'Opdater' : 'Tilføj'} Aktie
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
