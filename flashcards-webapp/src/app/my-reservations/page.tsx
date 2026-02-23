'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Reservation {
  id: number
  status: string
  createdAt: string
  arrangement: {
    id: number
    destination: string
    description: string
    price: number
    startDate: string
    endDate: string
    numberOfNights: number
    imageUrl: string | null
    category: {
      name: string
    }
  }
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Na čekanju', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Potvrđena', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Otkazana', color: 'bg-red-100 text-red-800' },
  COMPLETED: { label: 'Završena', color: 'bg-gray-100 text-gray-800' },
}

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      const response = await fetch(`/api/reservations?userId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      const arr = Array.isArray(data) ? data : data.reservations ?? []
      setReservations(arr)
    } catch (error) {
      console.error('Greška:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id: number) => {
    if (!confirm('Da li ste sigurni da želite da otkažete rezervaciju?')) return

    setCancelling(id)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'CANCELLED' })
      })

      if (response.ok) {
        setReservations(prev =>
          prev.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r)
        )
      }
    } catch (error) {
      console.error('Greška pri otkazivanju:', error)
    } finally {
      setCancelling(null)
    }
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('sr-RS')

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-500">Učitavanje...</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Moje rezervacije</h1>
      <p className="text-gray-600 mb-8">Pregled svih vaših rezervacija</p>

      {reservations.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">Nemate nijednu rezervaciju.</p>
          <button
            onClick={() => router.push('/arrangements')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Pregledaj aranžmane
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map(reservation => (
            <div key={reservation.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Slika */}
                <div className="md:w-48 h-40 md:h-auto flex-shrink-0">
                  <img
                    src={reservation.arrangement?.imageUrl || `https://picsum.photos/seed/${reservation.arrangement?.destination}/400/300`}
                    alt={reservation.arrangement?.destination}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {reservation.arrangement?.category?.name}
                      </span>
                      <h2 className="text-xl font-bold mt-2">
                        {reservation.arrangement?.destination}
                      </h2>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusLabels[reservation.status]?.color}`}>
                      {statusLabels[reservation.status]?.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 my-3 text-sm text-gray-600">
                    <div>
                      <p className="text-xs text-gray-400">Polazak</p>
                      <p className="font-medium">{formatDate(reservation.arrangement?.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Povratak</p>
                      <p className="font-medium">{formatDate(reservation.arrangement?.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Cena</p>
                      <p className="font-bold text-purple-600">{reservation.arrangement?.price} €</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-400">
                      Rezervisano: {formatDate(reservation.createdAt)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/arrangements/${reservation.arrangement?.id}`)}
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Detalji
                      </button>
                      {(reservation.status === 'PENDING' || reservation.status === 'CONFIRMED') && (
                        <button
                          onClick={() => handleCancel(reservation.id)}
                          disabled={cancelling === reservation.id}
                          className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                        >
                          {cancelling === reservation.id ? 'Otkazivanje...' : 'Otkaži'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}