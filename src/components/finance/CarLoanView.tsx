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
  Target,
  Settings,
  X
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
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [editingLoan, setEditingLoan] = useState<CarLoan | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [isExtraPayment, setIsExtraPayment] = useState(false)
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')

  // Load data and saved settings
  useEffect(() => {
    // Load saved settings from localStorage
    let savedSettings = null
    try {
      const saved = localStorage.getItem('carLoanSettings')
      if (saved) {
        savedSettings = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading saved settings:', error)
    }

    // Default loan data
    const defaultLoan: CarLoan = {
      id: '1',
      carName: 'Tesla Model Y Performance',
      loanAmount: 450000,
      remainingAmount: 280000,
      monthlyPayment: 3200,
      interestRate: 4.5,
      startDate: '2023-01-01',
      endDate: '2027-12-01',
      totalMonths: 60,
      paidMonths: 24,
      remainingMonths: 36
    }

    // Load saved monthly payment
    let savedMonthlyPayment = null
    try {
      const saved = localStorage.getItem('carLoanMonthlyPayment')
      if (saved) {
        savedMonthlyPayment = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading saved monthly payment:', error)
    }

    // Apply saved settings if available
    const finalLoan = savedSettings ? {
      ...defaultLoan,
      loanAmount: savedSettings.loanAmount,
      interestRate: savedSettings.interestRate,
      monthlyPayment: savedMonthlyPayment ? savedMonthlyPayment.monthlyPayment : defaultLoan.monthlyPayment
    } : {
      ...defaultLoan,
      monthlyPayment: savedMonthlyPayment ? savedMonthlyPayment.monthlyPayment : defaultLoan.monthlyPayment
    }

    const mockLoans: CarLoan[] = [finalLoan]

    // Load saved payments from localStorage
    let savedPayments: PaymentHistory[] = []
    try {
      const saved = localStorage.getItem('carLoanPayments')
      if (saved) {
        savedPayments = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading saved payments:', error)
    }

    // Default payment history if no saved payments
    const defaultHistory: PaymentHistory[] = [
      { month: 'Jan 2023', amount: 3200, remaining: finalLoan.loanAmount, interest: 1687, principal: 1513 },
      { month: 'Feb 2023', amount: 3200, remaining: finalLoan.loanAmount - 1513, interest: 1682, principal: 1518 },
      { month: 'Mar 2023', amount: 3200, remaining: finalLoan.loanAmount - 3031, interest: 1676, principal: 1524 },
      { month: 'Apr 2023', amount: 3200, remaining: finalLoan.loanAmount - 4555, interest: 1670, principal: 1530 },
      { month: 'May 2023', amount: 3200, remaining: finalLoan.loanAmount - 6085, interest: 1665, principal: 1535 },
      { month: 'Jun 2023', amount: 3200, remaining: finalLoan.loanAmount - 7620, interest: 1659, principal: 1541 },
      { month: 'Jul 2023', amount: 3200, remaining: finalLoan.loanAmount - 9161, interest: 1653, principal: 1547 },
      { month: 'Aug 2023', amount: 3200, remaining: finalLoan.loanAmount - 10708, interest: 1647, principal: 1553 },
      { month: 'Sep 2023', amount: 3200, remaining: finalLoan.loanAmount - 12261, interest: 1642, principal: 1558 },
      { month: 'Oct 2023', amount: 3200, remaining: finalLoan.loanAmount - 13819, interest: 1636, principal: 1564 },
      { month: 'Nov 2023', amount: 3200, remaining: finalLoan.loanAmount - 15383, interest: 1630, principal: 1570 },
      { month: 'Dec 2023', amount: 3200, remaining: finalLoan.loanAmount - 16953, interest: 1624, principal: 1576 },
      { month: 'Jan 2024', amount: 3200, remaining: finalLoan.loanAmount - 18529, interest: 1618, principal: 1582 },
      { month: 'Feb 2024', amount: 3200, remaining: finalLoan.loanAmount - 20111, interest: 1612, principal: 1588 },
      { month: 'Mar 2024', amount: 3200, remaining: finalLoan.loanAmount - 21699, interest: 1606, principal: 1594 },
      { month: 'Apr 2024', amount: 3200, remaining: finalLoan.loanAmount - 23293, interest: 1600, principal: 1600 },
      { month: 'May 2024', amount: 3200, remaining: finalLoan.loanAmount - 24893, interest: 1594, principal: 1606 },
      { month: 'Jun 2024', amount: 3200, remaining: finalLoan.loanAmount - 26499, interest: 1588, principal: 1612 },
      { month: 'Jul 2024', amount: 3200, remaining: finalLoan.loanAmount - 28111, interest: 1582, principal: 1618 },
      { month: 'Aug 2024', amount: 3200, remaining: finalLoan.loanAmount - 29729, interest: 1576, principal: 1624 },
      { month: 'Sep 2024', amount: 3200, remaining: finalLoan.loanAmount - 31353, interest: 1570, principal: 1630 },
      { month: 'Oct 2024', amount: 3200, remaining: finalLoan.loanAmount - 32983, interest: 1564, principal: 1636 },
      { month: 'Nov 2024', amount: 3200, remaining: finalLoan.loanAmount - 34619, interest: 1558, principal: 1642 },
      { month: 'Dec 2024', amount: 3200, remaining: finalLoan.loanAmount - 36261, interest: 1552, principal: 1648 }
    ]

    // Use saved payments if available, otherwise use default
    const mockHistory = savedPayments.length > 0 ? savedPayments : defaultHistory

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

  const handleAddPayment = () => {
    if (!paymentAmount || !paymentDate) {
      alert('Udfyld venligst alle felter')
      return
    }

    const amount = parseFloat(paymentAmount)
    const date = new Date(paymentDate)
    
    // Add payment to history
    const newPayment: PaymentHistory = {
      month: date.toLocaleDateString('da-DK', { month: 'short', year: 'numeric' }),
      amount: amount,
      remaining: carLoans[0].remainingAmount - amount,
      interest: amount * 0.4, // Mock interest calculation
      principal: amount * 0.6  // Mock principal calculation
    }

    // Update state
    setPaymentHistory(prev => [newPayment, ...prev])
    
    // Update loan remaining amount
    setCarLoans(prev => prev.map(loan => ({
      ...loan,
      remainingAmount: loan.remainingAmount - amount
    })))

    // Save payment to localStorage
    try {
      const savedPayments = JSON.parse(localStorage.getItem('carLoanPayments') || '[]')
      savedPayments.unshift(newPayment)
      localStorage.setItem('carLoanPayments', JSON.stringify(savedPayments))
    } catch (error) {
      console.error('Error saving payment:', error)
    }

    // Reset form
    setPaymentAmount('')
    setPaymentDate('')
    setIsExtraPayment(false)
    setShowPaymentModal(false)
    
    alert('Indbetaling registreret!')
  }

  const handleSetMonthlyPayment = (loanId: string, newAmount: number) => {
    // Update state
    setCarLoans(prev => prev.map(loan => 
      loan.id === loanId 
        ? { ...loan, monthlyPayment: newAmount }
        : loan
    ))

    // Save to localStorage
    try {
      const monthlyPaymentData = {
        monthlyPayment: newAmount,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem('carLoanMonthlyPayment', JSON.stringify(monthlyPaymentData))
    } catch (error) {
      console.error('Error saving monthly payment:', error)
    }

    alert('Månedlig betaling opdateret!')
  }

  const handleOpenSettings = () => {
    if (carLoans.length > 0) {
      setLoanAmount(carLoans[0].loanAmount.toString())
      setInterestRate(carLoans[0].interestRate.toString())
    }
    setShowSettingsModal(true)
  }

  const handleSaveSettings = () => {
    if (!loanAmount || !interestRate) {
      alert('Udfyld venligst alle felter')
      return
    }

    const newLoanAmount = parseFloat(loanAmount)
    const newInterestRate = parseFloat(interestRate)

    if (isNaN(newLoanAmount) || isNaN(newInterestRate)) {
      alert('Indtast venligst gyldige tal')
      return
    }

    // Update state
    setCarLoans(prev => prev.map(loan => ({
      ...loan,
      loanAmount: newLoanAmount,
      interestRate: newInterestRate
    })))

    // Save to localStorage for persistence
    try {
      const carLoanData = {
        loanAmount: newLoanAmount,
        interestRate: newInterestRate,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem('carLoanSettings', JSON.stringify(carLoanData))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }

    setShowSettingsModal(false)
    setLoanAmount('')
    setInterestRate('')
    alert('Indstillinger gemt!')
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
        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenSettings}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Indstillinger"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tilføj Indbetaling
          </button>
        </div>
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
                  <div className="flex items-center space-x-2">
                    <p className="text-lg font-semibold text-gray-900">{loan.monthlyPayment.toLocaleString('da-DK')} DKK</p>
                    <button
                      onClick={() => {
                        const newAmount = prompt('Indtast ny månedlig betaling:', loan.monthlyPayment.toString())
                        if (newAmount && !isNaN(parseFloat(newAmount))) {
                          handleSetMonthlyPayment(loan.id, parseFloat(newAmount))
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                  </div>
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

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Tilføj Indbetaling</h3>
              <button 
                onClick={() => {
                  setShowPaymentModal(false)
                  setPaymentAmount('')
                  setPaymentDate('')
                  setIsExtraPayment(false)
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Payment Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beløb (DKK)
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="F.eks. 5000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dato
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Payment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Betalingstype
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={!isExtraPayment}
                      onChange={() => setIsExtraPayment(false)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Månedlig betaling ({carLoans[0]?.monthlyPayment.toLocaleString('da-DK')} DKK)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={isExtraPayment}
                      onChange={() => setIsExtraPayment(true)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Ekstra indbetaling</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowPaymentModal(false)
                    setPaymentAmount('')
                    setPaymentDate('')
                    setIsExtraPayment(false)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Annuller
                </button>
                <button
                  onClick={handleAddPayment}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Registrer Indbetaling
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Lån Indstillinger</h3>
              <button 
                onClick={() => {
                  setShowSettingsModal(false)
                  setLoanAmount('')
                  setInterestRate('')
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Loan Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Samlet Lånebeløb (DKK)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="F.eks. 450000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rente (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="F.eks. 4.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowSettingsModal(false)
                    setLoanAmount('')
                    setInterestRate('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Annuller
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Gem Indstillinger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
