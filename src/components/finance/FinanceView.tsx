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
          {/* Settings icon will be added in CarLoanView */}
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
        <div className="space-y-6">
          {/* Stock Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Portefølje Værdi</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {portfolioLoading ? '...' : stocks.reduce((sum, stock) => sum + (stock.marketValueDKK || stock.marketValue || 0), 0).toLocaleString('da-DK')} DKK
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Gevinst/Tab</p>
                  <p className={`text-2xl font-semibold ${stocks.reduce((sum, stock) => sum + (stock.profitLossDKK || stock.profitLoss || 0), 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {portfolioLoading ? '...' : (stocks.reduce((sum, stock) => sum + (stock.profitLossDKK || stock.profitLoss || 0), 0) >= 0 ? '+' : '') + stocks.reduce((sum, stock) => sum + (stock.profitLossDKK || stock.profitLoss || 0), 0).toLocaleString('da-DK')} DKK
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Antal Aktier</p>
                  <p className="text-2xl font-semibold text-gray-900">{stocks.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <RefreshCw className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sidst Opdateret</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {lastUpdated ? lastUpdated.toLocaleTimeString('da-DK') : 'Aldrig'}
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
                <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <Plus className="h-4 w-4 mr-1" />
                  Tilføj Aktie
                </button>
              </div>
            </div>

            {portfolioLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : stocks.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ingen aktier fundet</h3>
                <p className="text-gray-600">Tilføj dine første aktier for at komme i gang</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stocks.map((stock) => (
                  <div key={stock.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">{stock.logo}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{stock.name}</h4>
                          <p className="text-sm text-gray-600">
                            {stock.symbol} • {stock.shares} aktier • GAK: {stock.gakDKK ? stock.gakDKK.toLocaleString('da-DK') : stock.gak.toLocaleString('da-DK')} DKK
                          </p>
                        </div>
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
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <CarLoanView />
      )}
    </div>
  )
}
