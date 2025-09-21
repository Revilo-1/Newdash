'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewSalePage() {
  const router = useRouter()
  const [itemName, setItemName] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [platform, setPlatform] = useState('')
  const [category, setCategory] = useState('Other')
  const [soldFor, setSoldFor] = useState<'self' | 'gitte'>('self')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemName || !salePrice || !platform) {
      alert('Udfyld venligst alle obligatoriske felter')
      return
    }

    try {
      setLoading(true)
      const payload = {
        item_name: itemName,
        sale_price: Number(salePrice),
        sale_platform: platform,
        category,
        description,
        condition: 'Good',
        sold_for: soldFor,
      }

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Fejl ved registrering af salg')
      }

      alert('Salg gemt ✔')
      router.push('/finance?tab=sales')
    } catch (err: any) {
      console.error('Create sale error:', err)
      alert(err.message || 'Fejl ved registrering af salg')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Tilføj Nyt Salg</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Varenavn *</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="F.eks. iPhone 12 Pro"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Salgspris (DKK) *</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="F.eks. 4500"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            required
            min="0"
            step="1"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Salgsplatform *</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            required
          >
            <option value="">Vælg platform</option>
            <option value="DBA">DBA</option>
            <option value="Facebook Marketplace">Facebook Marketplace</option>
            <option value="GulogGratis">GulogGratis</option>
            <option value="eBay">eBay</option>
            <option value="Local">Lokalt</option>
            <option value="Other">Andet</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Kategori</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Electronics">Elektronik</option>
            <option value="Clothing">Tøj & Sko</option>
            <option value="Home">Bolig</option>
            <option value="Sports">Sport & Fritid</option>
            <option value="Books">Bøger & Medier</option>
            <option value="Other">Andet</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Salgstype</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={soldFor}
            onChange={(e) => setSoldFor(e.target.value as 'self' | 'gitte')}
          >
            <option value="self">Egne ting</option>
            <option value="gitte">For Gitte</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Beskrivelse</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Beskrivelse af varen..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded">
            Annuller
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
            {loading ? 'Gemmer…' : 'Tilføj Salg'}
          </button>
        </div>
      </form>
    </div>
  )
}


