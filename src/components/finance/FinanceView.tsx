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
  currency: string
}

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
      setStocks([])
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
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Aktieportefølje</h2>
          <p className="text-gray-600">Aktieportefølje funktionalitet kommer snart...</p>
        </div>
      ) : (
        <CarLoanView />
      )}
    </div>
  )
}
