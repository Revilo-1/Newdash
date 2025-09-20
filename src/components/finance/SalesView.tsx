'use client'

import { useState, useEffect } from 'react'
import { 
  ShoppingBag, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Edit,
  Trash2,
  X,
  Package,
  Store,
  Tag
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface SalesItem {
  id: string
  itemName: string
  salePrice: number
  salePlatform: string
  saleDate: string
  description?: string
  category: string
  condition: string
  soldFor?: 'self' | 'gitte'
}

interface SalesStats {
  totalSales: number
  totalItems: number
  platforms: string[]
  monthlySales: Record<string, number>
}

export default function SalesView() {
  const [salesItems, setSalesItems] = useState<SalesItem[]>([])
  const [salesStats, setSalesStats] = useState<SalesStats>({
    totalSales: 0,
    totalItems: 0,
    platforms: [],
    monthlySales: {}
  })
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<SalesItem | null>(null)
  
  // Form states
  const [itemName, setItemName] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [salePlatform, setSalePlatform] = useState('')
  const [saleDate, setSaleDate] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Other')
  const [condition, setCondition] = useState('Good')
  const [soldFor, setSoldFor] = useState<'self' | 'gitte'>('self')

  // Load sales data from database
  useEffect(() => {
    loadSalesData()
  }, [])

  const loadSalesData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sales')
      
      if (response.ok) {
        const data = await response.json()
        
        // Transform database data to match our interface
        const transformedItems: SalesItem[] = data.salesItems.map((item: any) => ({
          id: item.id,
          itemName: item.item_name,
          salePrice: parseFloat(item.sale_price),
          salePlatform: item.sale_platform,
          saleDate: item.sale_date,
          description: item.description,
          category: item.category,
          condition: item.condition,
          soldFor: item.sold_for || 'self'
        }))
        
        setSalesItems(transformedItems)
        setSalesStats(data.salesStats)
      } else {
        console.error('Failed to load sales data')
      }
    } catch (error) {
      console.error('Error loading sales data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    if (!itemName || !salePrice || !salePlatform) {
      alert('Udfyld venligst alle påkrævede felter')
      return
    }

    try {
      const salesData = {
        item_name: itemName,
        sale_price: parseFloat(salePrice),
        sale_platform: salePlatform,
        // sale_date optional; backend defaults to today
        description: description,
        category: category,
        condition: condition,
        sold_for: soldFor
      }

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salesData)
      })

      if (response.ok) {
        await loadSalesData() // Reload data
        resetForm()
        setShowAddModal(false)
        alert('Salg registreret i database!')
      } else {
        throw new Error('Failed to save to database')
      }
    } catch (error) {
      console.error('Error saving sales item:', error)
      alert('Fejl ved registrering af salg')
    }
  }

  const handleUpdateItem = async () => {
    if (!editingItem || !itemName || !salePrice || !salePlatform) {
      alert('Udfyld venligst alle påkrævede felter')
      return
    }

    try {
      const updates = {
        item_name: itemName,
        sale_price: parseFloat(salePrice),
        sale_platform: salePlatform,
        description: description,
        category: category,
        condition: condition,
        sold_for: soldFor
      }

      const response = await fetch(`/api/sales/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        await loadSalesData() // Reload data
        resetForm()
        setShowAddModal(false)
        setEditingItem(null)
        alert('Salg opdateret i database!')
      } else {
        throw new Error('Failed to update in database')
      }
    } catch (error) {
      console.error('Error updating sales item:', error)
      alert('Fejl ved opdatering af salg')
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Er du sikker på, at du vil slette dette salg?')) {
      try {
        const response = await fetch(`/api/sales/${itemId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await loadSalesData() // Reload data
          alert('Salg slettet fra database!')
        } else {
          throw new Error('Failed to delete from database')
        }
      } catch (error) {
        console.error('Error deleting sales item:', error)
        alert('Fejl ved sletning af salg')
      }
    }
  }

  const handleEditItem = (item: SalesItem) => {
    setEditingItem(item)
    setItemName(item.itemName)
    setSalePrice(item.salePrice.toString())
    setSalePlatform(item.salePlatform)
    setSaleDate(item.saleDate)
    setDescription(item.description || '')
    setCategory(item.category)
    setCondition(item.condition)
    setSoldFor(item.soldFor || 'self')
    setShowAddModal(true)
  }

  const resetForm = () => {
    setItemName('')
    setSalePrice('')
    setSalePlatform('')
    setSaleDate('')
    setDescription('')
    setCategory('Other')
    setCondition('Good')
    setSoldFor('self')
    setEditingItem(null)
  }

  // Prepare chart data
  const chartData = Object.entries(salesStats.monthlySales)
    .map(([month, amount]) => ({
      month: new Date(month + '-01').toLocaleDateString('da-DK', { month: 'short' }),
      amount: amount
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

  const platformData = salesStats.platforms.map(platform => ({
    platform,
    count: salesItems.filter(item => item.salePlatform === platform).length,
    total: salesItems
      .filter(item => item.salePlatform === platform)
      .reduce((sum, item) => sum + item.salePrice, 0)
  }))

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
          <h2 className="text-2xl font-bold text-gray-900">Salg af Ting</h2>
          <p className="text-gray-600">Administrer dine solgte varer og se salgsstatistikker</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tilføj Salg
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Salg</p>
              <p className="text-2xl font-semibold text-gray-900">
                {salesStats.totalSales.toLocaleString('da-DK')} DKK
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Solgte Varer</p>
              <p className="text-2xl font-semibold text-gray-900">{salesStats.totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Store className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Platforme</p>
              <p className="text-2xl font-semibold text-gray-900">{salesStats.platforms.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gennemsnit</p>
              <p className="text-2xl font-semibold text-gray-900">
                {salesStats.totalItems > 0 ? Math.round(salesStats.totalSales / salesStats.totalItems).toLocaleString('da-DK') : 0} DKK
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Månedlige Salg</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`${value.toLocaleString('da-DK')} DKK`, 'Salg']}
                />
                <Bar dataKey="amount" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Salg per Platform</h3>
          <div className="space-y-3">
            {platformData.map((platform) => (
              <div key={platform.platform} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">{platform.platform}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {platform.total.toLocaleString('da-DK')} DKK
                  </p>
                  <p className="text-xs text-gray-500">{platform.count} varer</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Items List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Solgte Varer</h3>
        
        {salesItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ingen salg registreret</h3>
            <p className="text-gray-600">Tilføj dit første salg for at komme i gang</p>
          </div>
        ) : (
          <div className="space-y-4">
            {salesItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.itemName}</h4>
                      <p className="text-sm text-gray-600">
                        {item.salePlatform} • {new Date(item.saleDate).toLocaleDateString('da-DK')} • {item.category} • {item.soldFor === 'gitte' ? 'For Gitte' : 'Egne ting'}
                      </p>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {item.salePrice.toLocaleString('da-DK')} DKK
                    </p>
                    <p className="text-sm text-gray-600">{item.condition}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditItem(item)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Rediger Salg' : 'Tilføj Nyt Salg'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Item Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Varenavn *
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="F.eks. iPhone 12 Pro"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Sale Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salgspris (DKK) *
                </label>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="F.eks. 4500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Sale Platform */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salgsplatform *
                </label>
                <select
                  value={salePlatform}
                  onChange={(e) => setSalePlatform(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Vælg platform</option>
                  <option value="DBA">DBA</option>
                  <option value="Facebook Marketplace">Facebook Marketplace</option>
                  <option value="eBay">eBay</option>
                  <option value="Local">Lokalt</option>
                  <option value="Andet">Andet</option>
                </select>
              </div>

              {/* Sale Date - removed per request; backend defaults to today */}

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Electronics">Elektronik</option>
                  <option value="Furniture">Møbler</option>
                  <option value="Clothing">Tøj</option>
                  <option value="Books">Bøger</option>
                  <option value="Other">Andet</option>
                </select>
              </div>

              {/* Condition - removed per request */}

              {/* Sold For */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salgstype
                </label>
                <select
                  value={soldFor}
                  onChange={(e) => setSoldFor(e.target.value as 'self' | 'gitte')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="self">Egne ting</option>
                  <option value="gitte">For Gitte</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beskrivelse
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beskrivelse af varen..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Annuller
                </button>
                <button
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {editingItem ? 'Opdater' : 'Tilføj'} Salg
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
