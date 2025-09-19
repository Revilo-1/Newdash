'use client'

import { useState, useEffect } from 'react'
import { 
  Car, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Edit,
  Plus,
  Trash2,
  CreditCard,
  Clock,
  Target
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface CarLoan {
  id: string
  carName: string
  loanAmount: number
  remainingAmount: number
  monthlyPayment: number
  interestRate: number
  startDate: string
  endDate: string
  totalMonths: number
  paidMonths: number
  remainingMonths: number
}

interface PaymentHistory {
  month: string
  amount: number
  remaining: number
  interest: number
  principal: number
}

export default function CarLoanView() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y')
  const [carLoans, setCarLoans] = useState<CarLoan[]>([])
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingLoan, setEditingLoan] = useState<CarLoan | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    const mockLoans: CarLoan[] = [
      {
        id: '1',
        carName: 'BMW X5',
        loanAmount: 450000,
        remainingAmount: 280000,
        monthlyPayment: 8500,
        interestRate: 4.5,
        startDate: '2023-01-01',
        endDate: '2027-12-01',
        totalMonths: 60,
        paidMonths: 24,
        remainingMonths: 36
      }
    ]

    const mockHistory: PaymentHistory[] = [
      { month: 'Jan 2023', amount: 8500, remaining: 450000, interest: 1687, principal: 6813 },
      { month: 'Feb 2023', amount: 8500, remaining: 443187, interest: 1662, principal: 6838 },
      { month: 'Mar 2023', amount: 8500, remaining: 436349, interest: 1636, principal: 6864 },
      { month: 'Apr 2023', amount: 8500, remaining: 429485, interest: 1611, principal: 6889 },
      { month: 'May 2023', amount: 8500, remaining: 422596, interest: 1585, principal: 6915 },
      { month: 'Jun 2023', amount: 8500, remaining: 415681, interest: 1559, principal: 6941 },
      { month: 'Jul 2023', amount: 8500, remaining: 408740, interest: 1533, principal: 6967 },
      { month: 'Aug 2023', amount: 8500, remaining: 401773, interest: 1507, principal: 6993 },
      { month: 'Sep 2023', amount: 8500, remaining: 394780, interest: 1480, principal: 7020 },
      { month: 'Oct 2023', amount: 8500, remaining: 387760, interest: 1454, principal: 7046 },
      { month: 'Nov 2023', amount: 8500, remaining: 380714, interest: 1428, principal: 7072 },
      { month: 'Dec 2023', amount: 8500, remaining: 373642, interest: 1401, principal: 7099 },
      { month: 'Jan 2024', amount: 8500, remaining: 366543, interest: 1375, principal: 7125 },
      { month: 'Feb 2024', amount: 8500, remaining: 359418, interest: 1348, principal: 7152 },
      { month: 'Mar 2024', amount: 8500, remaining: 352266, interest: 1321, principal: 7179 },
      { month: 'Apr 2024', amount: 8500, remaining: 345087, interest: 1294, principal: 7206 },
      { month: 'May 2024', amount: 8500, remaining: 337881, interest: 1267, principal: 7233 },
      { month: 'Jun 2024', amount: 8500, remaining: 330648, interest: 1240, principal: 7260 },
      { month: 'Jul 2024', amount: 8500, remaining: 323388, interest: 1213, principal: 7287 },
      { month: 'Aug 2024', amount: 8500, remaining: 316101, interest: 1185, principal: 7315 },
      { month: 'Sep 2024', amount: 8500, remaining: 308786, interest: 1158, principal: 7342 },
      { month: 'Oct 2024', amount: 8500, remaining: 301444, interest: 1130, principal: 7370 },
      { month: 'Nov 2024', amount: 8500, remaining: 294074, interest: 1103, principal: 7397 },
      { month: 'Dec 2024', amount: 8500, remaining: 286677, interest: 1075, principal: 7425 }
    ]

    setCarLoans(mockLoans)
    setPaymentHistory(mockHistory)
    setLoading(false)
  }, [])

  // Calculate totals
  const totalLoanAmount = carLoans.reduce((sum, loan) => sum + loan.loanAmount, 0)
  const totalRemaining = carLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0)
  const totalPaid = totalLoanAmount - totalRemaining
  const totalPaidPercent = (totalPaid / totalLoanAmount) * 100
  const totalMonthlyPayment = carLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0)

  // Calculate progress data for chart
  const chartData = paymentHistory.map((payment, index) => ({
    month: payment.month.split(' ')[0],
    value: payment.remaining,
    paid: totalLoanAmount - payment.remaining,
    interest: payment.interest,
    principal: payment.principal
  }))

  const handleAddLoan = () => {
    setShowAddModal(true)
  }

  const handleEditLoan = (loan: CarLoan) => {
    setEditingLoan(loan)
    setShowAddModal(true)
  }

  const handleDeleteLoan = (id: string) => {
    setCarLoans(prev => prev.filter(loan => loan.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Billån Oversigt</h2>
          <p className="text-gray-600">Administrer dine billån og se betalingsstatus</p>
        </div>
        <button
          onClick={handleAddLoan}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tilføj Billån
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Car className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Lån</p>
              <p className="text-2xl font-semibold text-gray-900">{totalLoanAmount.toLocaleString('da-DK')} DKK</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Betalt</p>
              <p className="text-2xl font-semibold text-gray-900">{totalPaid.toLocaleString('da-DK')} DKK</p>
              <p className="text-sm text-green-600">+{totalPaidPercent.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resterende</p>
              <p className="text-2xl font-semibold text-gray-900">{totalRemaining.toLocaleString('da-DK')} DKK</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Månedlig Betaling</p>
              <p className="text-2xl font-semibold text-gray-900">{totalMonthlyPayment.toLocaleString('da-DK')} DKK</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Lån Status</h3>
          <div className="flex space-x-2">
            {['1M', '3M', '6M', '1Y', 'All'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedTimeframe(period)}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  selectedTimeframe === period
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [value.toLocaleString('da-DK') + ' DKK', 'Resterende']}
                labelFormatter={(label) => `Måned: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Nuværende Status</p>
            <p className="text-2xl font-bold text-gray-900">{totalRemaining.toLocaleString('da-DK')} DKK</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Total Betalt</p>
            <p className="text-lg font-semibold text-green-600">
              +{totalPaid.toLocaleString('da-DK')} DKK ({totalPaidPercent.toFixed(1)}%)
            </p>
          </div>
        </div>
      </div>

      {/* Loan Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Billån Detaljer</h3>
        
        <div className="space-y-4">
          {carLoans.map((loan) => (
            <div key={loan.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{loan.carName}</h4>
                    <p className="text-sm text-gray-600">
                      {loan.paidMonths} / {loan.totalMonths} måneder betalt
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Månedlig Betaling</p>
                  <p className="text-lg font-semibold text-gray-900">{loan.monthlyPayment.toLocaleString('da-DK')} DKK</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Resterende</p>
                  <p className="text-lg font-semibold text-gray-900">{loan.remainingAmount.toLocaleString('da-DK')} DKK</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Rente</p>
                  <p className="text-lg font-semibold text-gray-900">{loan.interestRate}%</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditLoan(loan)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteLoan(loan.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Fremgang</span>
                  <span>{((loan.paidMonths / loan.totalMonths) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(loan.paidMonths / loan.totalMonths) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Betalingshistorik</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Måned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Betaling
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hovedstol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resterende
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory.slice(-12).map((payment, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.amount.toLocaleString('da-DK')} DKK
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {payment.interest.toLocaleString('da-DK')} DKK
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {payment.principal.toLocaleString('da-DK')} DKK
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.remaining.toLocaleString('da-DK')} DKK
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
