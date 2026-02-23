'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'

interface Category {
  id: number
  name: string
}

interface Discount {
  id: number
  type: string
  value: number
  startDate: string
  endDate: string
}

interface Arrangement {
  id: number
  destination: string
  description: string
  price: number
  startDate: string
  endDate: string
  numberOfNights: number
  imageUrl: string | null
  categoryId: number
  category: { name: string }
  discounts: Discount[]
}

interface Reservation {
  id: number
  status: string
  createdAt: string
  user: { firstName: string; lastName: string; email: string }
  arrangement: { destination: string; price: number }
}

export default function AgentPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('arrangements')
  const [arrangements, setArrangements] = useState<Arrangement[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDiscountForm, setShowDiscountForm] = useState(false)
  const [selectedArrangementId, setSelectedArrangementId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    destination: '', description: '', price: '', startDate: '',
    endDate: '', numberOfNights: '', imageUrl: '', categoryId: ''
  })

  const [discountData, setDiscountData] = useState({
    type: 'percentage', value: '', startDate: '', endDate: ''
  })

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) { router.push('/login'); return }
    const user = JSON.parse(userStr)
    if (user.role !== 'AGENT' && user.role !== 'ADMIN') { router.push('/'); return }
    fetchArrangements()
    fetchCategories()
    fetchReservations()
  }, [router])

  const fetchArrangements = async () => {
    try {
      const response = await fetch('/api/arrangements')
      const data = await response.json()
      setArrangements(Array.isArray(data) ? data : data.arrangements ?? [])
    } catch (error) { console.error('Greška:', error) }
    finally { setLoading(false) }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(Array.isArray(data) ? data : data.categories ?? [])
    } catch (error) { console.error('Greška:', error) }
  }

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/reservations', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setReservations(Array.isArray(data) ? data : data.reservations ?? [])
    } catch (error) { console.error('Greška:', error) }
  }

  const handleStatusChange = async (reservationId: number, newStatus: string) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      })
      if (response.ok) {
        setReservations(prev =>
          prev.map(r => r.id === reservationId ? { ...r, status: newStatus } : r)
        )
        setMessage('Status uspešno promenjen!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Greška pri promeni statusa')
      }
    } catch { setMessage('Greška pri povezivanju sa serverom') }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDiscountData({ ...discountData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData({ destination: '', description: '', price: '', startDate: '', endDate: '', numberOfNights: '', imageUrl: '', categoryId: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const resetDiscountForm = () => {
    setDiscountData({ type: 'percentage', value: '', startDate: '', endDate: '' })
    setSelectedArrangementId(null)
    setShowDiscountForm(false)
  }

  const handleEdit = (arrangement: Arrangement) => {
    setFormData({
      destination: arrangement.destination, description: arrangement.description,
      price: arrangement.price.toString(), startDate: arrangement.startDate.split('T')[0],
      endDate: arrangement.endDate.split('T')[0], numberOfNights: arrangement.numberOfNights.toString(),
      imageUrl: arrangement.imageUrl || '', categoryId: arrangement.categoryId.toString()
    })
    setEditingId(arrangement.id)
    setShowForm(true)
    setShowDiscountForm(false)
  }

  const handleAddDiscount = (arrangementId: number) => {
    setSelectedArrangementId(arrangementId)
    setShowDiscountForm(true)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    const token = localStorage.getItem('token')
    const url = editingId ? `/api/arrangements/${editingId}` : '/api/arrangements'
    const method = editingId ? 'PUT' : 'POST'
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          destination: formData.destination, description: formData.description,
          price: parseFloat(formData.price), startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(), numberOfNights: parseInt(formData.numberOfNights),
          imageUrl: formData.imageUrl || null, categoryId: parseInt(formData.categoryId)
        })
      })
      if (response.ok) {
        setMessage(editingId ? 'Aranžman uspešno izmenjen!' : 'Aranžman uspešno kreiran!')
        resetForm(); fetchArrangements()
      } else {
        const data = await response.json()
        setMessage(data.error || 'Greška pri čuvanju')
      }
    } catch { setMessage('Greška pri povezivanju sa serverom') }
  }

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('/api/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          arrangementId: selectedArrangementId, type: discountData.type,
          value: parseFloat(discountData.value), startDate: new Date(discountData.startDate).toISOString(),
          endDate: new Date(discountData.endDate).toISOString()
        })
      })
      if (response.ok) {
        setMessage('Popust uspešno kreiran!')
        resetDiscountForm(); fetchArrangements()
      } else {
        const data = await response.json()
        setMessage(data.error || 'Greška pri kreiranju popusta')
      }
    } catch { setMessage('Greška pri povezivanju sa serverom') }
  }

  const handleDeleteDiscount = async (discountId: number) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj popust?')) return
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/discounts/${discountId}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) { setMessage('Popust uspešno obrisan!'); fetchArrangements() }
      else { const data = await response.json(); setMessage(data.error || 'Greška pri brisanju') }
    } catch { setMessage('Greška pri povezivanju sa serverom') }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj aranžman?')) return
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/arrangements/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) { setMessage('Aranžman uspešno obrisan!'); fetchArrangements() }
      else { const data = await response.json(); setMessage(data.error || 'Greška pri brisanju') }
    } catch { setMessage('Greška pri povezivanju sa serverom') }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-500">Učitavanje...</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Agent Panel</h1>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('uspešno') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab('arrangements')} className={`px-4 py-2 rounded-lg ${activeTab === 'arrangements' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
          Aranžmani
        </button>
        <button onClick={() => setActiveTab('reservations')} className={`px-4 py-2 rounded-lg ${activeTab === 'reservations' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
          Rezervacije
        </button>
      </div>

      {activeTab === 'arrangements' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upravljanje aranžmanima</h2>
            <Button onClick={() => { setShowForm(!showForm); setShowDiscountForm(false) }}>
              {showForm ? 'Zatvori formu' : '+ Novi aranžman'}
            </Button>
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">{editingId ? 'Izmeni aranžman' : 'Kreiraj novi aranžman'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Destinacija" name="destination" value={formData.destination} onChange={handleChange} required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="">Izaberi kategoriju</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <Input label="Cena (€)" name="price" type="number" value={formData.price} onChange={handleChange} required />
                  <Input label="Broj noćenja" name="numberOfNights" type="number" value={formData.numberOfNights} onChange={handleChange} required />
                  <Input label="Datum polaska" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
                  <Input label="Datum povratka" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
                  <div className="md:col-span-2">
                    <Input label="URL slike" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/slika.jpg" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button type="submit">{editingId ? 'Sačuvaj izmene' : 'Kreiraj aranžman'}</Button>
                  <Button type="button" variant="secondary" onClick={resetForm}>Otkaži</Button>
                </div>
              </form>
            </div>
          )}

          {showDiscountForm && selectedArrangementId && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">Kreiraj popust/akciju</h2>
              <form onSubmit={handleDiscountSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tip popusta</label>
                    <select name="type" value={discountData.type} onChange={handleDiscountChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="percentage">Procenat (%)</option>
                      <option value="fixed">Fiksni iznos (€)</option>
                      <option value="lastMinute">Last Minute</option>
                    </select>
                  </div>
                  <Input label={discountData.type === 'percentage' || discountData.type === 'lastMinute' ? 'Vrednost (%)' : 'Vrednost (€)'} name="value" type="number" value={discountData.value} onChange={handleDiscountChange} required />
                  <Input label="Datum početka" name="startDate" type="date" value={discountData.startDate} onChange={handleDiscountChange} required />
                  <Input label="Datum završetka" name="endDate" type="date" value={discountData.endDate} onChange={handleDiscountChange} required />
                </div>
                <div className="flex gap-4 mt-6">
                  <Button type="submit">Kreiraj popust</Button>
                  <Button type="button" variant="secondary" onClick={resetDiscountForm}>Otkaži</Button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Destinacija</th>
                  <th className="px-4 py-3 text-left">Kategorija</th>
                  <th className="px-4 py-3 text-left">Cena</th>
                  <th className="px-4 py-3 text-left">Popust</th>
                  <th className="px-4 py-3 text-left">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {arrangements.map(arr => (
                  <tr key={arr.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{arr.destination}</td>
                    <td className="px-4 py-3">{arr.category?.name}</td>
                    <td className="px-4 py-3">{arr.price} €</td>
                    <td className="px-4 py-3">
                      {arr.discounts && arr.discounts.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {arr.discounts.map(d => (
                            <span key={d.id} className="inline-flex items-center gap-2 text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                              {d.type === 'percentage' || d.type === 'lastMinute' ? `${d.value}%` : `${d.value}€`}
                              {d.type === 'lastMinute' && ' (Last Minute)'}
                              <button onClick={() => handleDeleteDiscount(d.id)} className="text-red-500 hover:text-red-700">×</button>
                            </span>
                          ))}
                        </div>
                      ) : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(arr)} className="text-purple-600 hover:text-purple-800">Izmeni</button>
                        <button onClick={() => handleAddDiscount(arr.id)} className="text-green-600 hover:text-green-800">+ Popust</button>
                        <button onClick={() => handleDelete(arr.id)} className="text-red-600 hover:text-red-800">Obriši</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {arrangements.length === 0 && <p className="text-center text-gray-500 py-8">Nema aranžmana.</p>}
          </div>
        </div>
      )}

      {activeTab === 'reservations' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Sve rezervacije</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Korisnik</th>
                  <th className="px-4 py-3 text-left">Aranžman</th>
                  <th className="px-4 py-3 text-left">Cena</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Datum</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">#{res.id}</td>
                    <td className="px-4 py-3">
                      {res.user?.firstName} {res.user?.lastName}
                      <br />
                      <span className="text-sm text-gray-500">{res.user?.email}</span>
                    </td>
                    <td className="px-4 py-3">{res.arrangement?.destination}</td>
                    <td className="px-4 py-3">{res.arrangement?.price} €</td>
                    <td className="px-4 py-3">
                      <select
                        value={res.status}
                        onChange={e => handleStatusChange(res.id, e.target.value)}
                        className={`text-sm px-2 py-1 rounded border-0 cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                          res.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          res.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          res.status === 'COMPLETED' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                        }`}
                      >
                        <option value="PENDING">Na čekanju</option>
                        <option value="CONFIRMED">Potvrđena</option>
                        <option value="CANCELLED">Otkazana</option>
                        <option value="COMPLETED">Završena</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">{new Date(res.createdAt).toLocaleDateString('sr-RS')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reservations.length === 0 && <p className="text-center text-gray-500 py-8">Nema rezervacija.</p>}
          </div>
        </div>
      )}
    </div>
  )
}