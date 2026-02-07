'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  status: string
  createdAt: string
}

interface Reservation {
  id: number
  status: string
  createdAt: string
  user: {
    firstName: string
    lastName: string
    email: string
  }
  arrangement: {
    destination: string
    price: number
  }
}

interface Category {
  id: number
  name: string
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState<User[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'CLIENT',
    status: 'ACTIVE'
  })

  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState('')

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    const user = JSON.parse(userStr)
    if (user.role !== 'ADMIN') {
      router.push('/')
      return
    }
    
    fetchUsers()
    fetchReservations()
    fetchCategories()
  }, [router])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Greška:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/reservations', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setReservations(data)
    } catch (error) {
      console.error('Greška:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Greška:', error)
    }
  }

  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserFormData({
      ...userFormData,
      [e.target.name]: e.target.value
    })
  }

  const resetUserForm = () => {
    setUserFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'CLIENT',
      status: 'ACTIVE'
    })
    setEditingUser(null)
    setShowUserForm(false)
  }

  const handleEditUser = (user: User) => {
    setUserFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status
    })
    setEditingUser(user)
    setShowUserForm(true)
  }

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    
    const token = localStorage.getItem('token')
    const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users'
    const method = editingUser ? 'PUT' : 'POST'

    const body: Record<string, string> = {
      firstName: userFormData.firstName,
      lastName: userFormData.lastName,
      email: userFormData.email,
      role: userFormData.role,
      status: userFormData.status
    }
    
    if (userFormData.password) {
      body.password = userFormData.password
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        setMessage(editingUser ? 'Korisnik uspešno izmenjen!' : 'Korisnik uspešno kreiran!')
        resetUserForm()
        fetchUsers()
      } else {
        const data = await response.json()
        setMessage(data.error || 'Greška pri čuvanju')
      }
    } catch (error) {
      setMessage('Greška pri povezivanju sa serverom')
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
      return
    }

    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setMessage('Korisnik uspešno obrisan!')
        fetchUsers()
      } else {
        const data = await response.json()
        setMessage(data.error || 'Greška pri brisanju')
      }
    } catch (error) {
      setMessage('Greška pri povezivanju sa serverom')
    }
  }

  const handleToggleUserStatus = async (user: User) => {
    const newStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setMessage(`Korisnik ${newStatus === 'BLOCKED' ? 'blokiran' : 'aktiviran'}!`)
        fetchUsers()
      } else {
        const data = await response.json()
        setMessage(data.error || 'Greška pri promeni statusa')
      }
    } catch (error) {
      setMessage('Greška pri povezivanju sa serverom')
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    
    const token = localStorage.getItem('token')
    const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories'
    const method = editingCategory ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: categoryName })
      })

      if (response.ok) {
        setMessage(editingCategory ? 'Kategorija uspešno izmenjena!' : 'Kategorija uspešno kreirana!')
        setCategoryName('')
        setEditingCategory(null)
        setShowCategoryForm(false)
        fetchCategories()
      } else {
        const data = await response.json()
        setMessage(data.error || 'Greška pri čuvanju')
      }
    } catch (error) {
      setMessage('Greška pri povezivanju sa serverom')
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovu kategoriju?')) {
      return
    }

    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setMessage('Kategorija uspešno obrisana!')
        fetchCategories()
      } else {
        const data = await response.json()
        setMessage(data.error || 'Greška pri brisanju')
      }
    } catch (error) {
      setMessage('Greška pri povezivanju sa serverom')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Učitavanje...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes('uspešno') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'users' ? 'bg-purple-600 text-white' : 'bg-gray-200'
          }`}
        >
          Korisnici
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'reservations' ? 'bg-purple-600 text-white' : 'bg-gray-200'
          }`}
        >
          Rezervacije
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'categories' ? 'bg-purple-600 text-white' : 'bg-gray-200'
          }`}
        >
          Kategorije
        </button>
      </div>

      {activeTab === 'users' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upravljanje korisnicima</h2>
            <Button onClick={() => setShowUserForm(!showUserForm)}>
              {showUserForm ? 'Zatvori formu' : '+ Novi korisnik'}
            </Button>
          </div>

          {showUserForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingUser ? 'Izmeni korisnika' : 'Kreiraj novog korisnika'}
              </h3>
              <form onSubmit={handleUserSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Ime"
                    name="firstName"
                    value={userFormData.firstName}
                    onChange={handleUserFormChange}
                    required
                  />
                  <Input
                    label="Prezime"
                    name="lastName"
                    value={userFormData.lastName}
                    onChange={handleUserFormChange}
                    required
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={userFormData.email}
                    onChange={handleUserFormChange}
                    required
                  />
                  <Input
                    label={editingUser ? "Nova lozinka (ostavite prazno)" : "Lozinka"}
                    name="password"
                    type="password"
                    value={userFormData.password}
                    onChange={handleUserFormChange}
                    required={!editingUser}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Uloga
                    </label>
                    <select
                      name="role"
                      value={userFormData.role}
                      onChange={handleUserFormChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="CLIENT">Klijent</option>
                      <option value="AGENT">Agent</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={userFormData.status}
                      onChange={handleUserFormChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="ACTIVE">Aktivan</option>
                      <option value="BLOCKED">Blokiran</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button type="submit">
                    {editingUser ? 'Sačuvaj izmene' : 'Kreiraj korisnika'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={resetUserForm}>
                    Otkaži
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Ime i prezime</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Uloga</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{user.firstName} {user.lastName}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                        user.role === 'AGENT' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status === 'ACTIVE' ? 'Aktivan' : 'Blokiran'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          Izmeni
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user)}
                          className={user.status === 'ACTIVE' ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'}
                        >
                          {user.status === 'ACTIVE' ? 'Blokiraj' : 'Aktiviraj'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Obriši
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="text-center text-gray-500 py-8">Nema korisnika.</p>
            )}
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
                {reservations.map((res) => (
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
                      <span className={`px-2 py-1 rounded text-sm ${
                        res.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        res.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(res.createdAt).toLocaleDateString('sr-RS')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reservations.length === 0 && (
              <p className="text-center text-gray-500 py-8">Nema rezervacija.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upravljanje kategorijama</h2>
            <Button onClick={() => setShowCategoryForm(!showCategoryForm)}>
              {showCategoryForm ? 'Zatvori formu' : '+ Nova kategorija'}
            </Button>
          </div>

          {showCategoryForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <form onSubmit={handleCategorySubmit}>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      label="Naziv kategorije"
                      name="categoryName"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button type="submit">
                      {editingCategory ? 'Sačuvaj' : 'Kreiraj'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => {
                      setCategoryName('')
                      setEditingCategory(null)
                      setShowCategoryForm(false)
                    }}>
                      Otkaži
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Naziv</th>
                  <th className="px-4 py-3 text-left">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">#{cat.id}</td>
                    <td className="px-4 py-3">{cat.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCategoryName(cat.name)
                            setEditingCategory(cat)
                            setShowCategoryForm(true)
                          }}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          Izmeni
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Obriši
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {categories.length === 0 && (
              <p className="text-center text-gray-500 py-8">Nema kategorija.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}