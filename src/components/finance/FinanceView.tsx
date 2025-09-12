'use client'

import { useState } from 'react'
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
  DollarSign
} from 'lucide-react'
import { DashboardMode } from '@/types/dashboard'
import { useLanguage } from '@/contexts/LanguageContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface FinanceViewProps {
  mode: DashboardMode
}

// Sample data for expenses chart
const expensesData = [
  { month: 'Jan', amount: 8500 },
  { month: 'Feb', amount: 9200 },
  { month: 'Mar', amount: 7800 },
  { month: 'Apr', amount: 10500 },
  { month: 'May', amount: 9800 },
  { month: 'Jun', amount: 10512 },
  { month: 'Jul', amount: 11200 },
  { month: 'Aug', amount: 10800 },
  { month: 'Sep', amount: 12500 },
  { month: 'Oct', amount: 11800 },
  { month: 'Nov', amount: 13200 },
  { month: 'Dec', amount: 12800 }
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

// Sample recent transactions
const recentTransactions = [
  {
    id: '1',
    name: 'Shopee',
    logo: '🛒',
    time: 'Today, 08:21',
    category: 'Beverage & Snacks',
    categoryColor: 'bg-purple-500',
    amount: '-$28.00',
    type: 'expense'
  },
  {
    id: '2',
    name: 'Walmart',
    logo: '🏪',
    time: 'Today, 09:10',
    category: 'Groceries',
    categoryColor: 'bg-orange-500',
    amount: '-$152.00',
    type: 'expense'
  },
  {
    id: '3',
    name: 'Gojek',
    logo: '🚗',
    time: 'Yesterday, 21:45',
    category: 'Transportation',
    categoryColor: 'bg-green-500',
    amount: '-$97.00',
    type: 'expense'
  }
]

export default function FinanceView({ mode }: FinanceViewProps) {
  const { t } = useLanguage()
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y')

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

            {/* Net Worth */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900">$14,732.80</p>
              <p className="text-sm text-gray-600">Net Worth</p>
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
                <LineChart data={expensesData}>
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
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Udgifter']}
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
              <p className="text-2xl font-bold text-gray-900">300.000 kr</p>
              <p className="text-sm text-green-600">+8.2% vs sidste år</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Transaktioner</p>
                  <p className="text-2xl font-bold text-gray-900">312</p>
                  <p className="text-xs text-gray-500">Total transaktioner denne måned</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Indtægt</p>
                  <p className="text-2xl font-bold text-green-600">+$17,746.61</p>
                  <p className="text-xs text-gray-500">Kumulativ indtægt optjent</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Udgift</p>
                  <p className="text-2xl font-bold text-red-600">-$5,987.35</p>
                  <p className="text-xs text-gray-500">Kumulativ udgift</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Seneste Transaktioner</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Search className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600">May 23, 2025</p>
            </div>

            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                    {transaction.logo}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{transaction.name}</p>
                    <p className="text-sm text-gray-600">{transaction.time}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${transaction.categoryColor} rounded-sm`}></div>
                    <span className="text-sm text-gray-600">{transaction.category}</span>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                      {transaction.amount}
                    </p>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
