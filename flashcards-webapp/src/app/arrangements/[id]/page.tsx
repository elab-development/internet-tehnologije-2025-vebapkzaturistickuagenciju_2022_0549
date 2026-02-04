'use client'
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'

interface Arrangement {
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
  discounts: {
    id: number
    type: string
    value: number
  }[]
}

export default function ArrangementDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params)
  const router = useRouter()
  const [arrangement, setArrangement] = useState<Arrangement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reserving, setReserving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchArrangement()
  }, [id])

  const fetchArrangement = async () => {
    try {
      const response = await fetch(`/api/arrangements/${id}`)
      if (!response.ok) {
        setError('Aranžman nije pronađen')
        return
      }
      const data = await response.json()
      setArrangement(data)
    } catch {
      setError('Greška pri učitavanju')
    } finally {
      setLoading(false)
    }
  }

  const handleReservation = async () => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }

    const user = JSON.parse(userStr)
    setReserving(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          arrangementId: parseInt(id)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Greška pri rezervaciji')
        return
      }

      setMessage('Rezervacija uspešno kreirana!')
    } catch {
      setMessage('Greška pri povezivanju sa serverom')
    } finally {
      setReserving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Učitavanje...</p>
      </div>
    )
  }

  if (error || !arrangement) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-red-500 text-center">{error}</p>
        <Button onClick={() => router.push('/')} className="mt-4 mx-auto block">
          Nazad na početnu
        </Button>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('sr-RS')
  }

  let finalPrice = arrangement.price
  const activeDiscount = arrangement.discounts?.[0]
  if (activeDiscount) {
    if (activeDiscount.type === 'percentage') {
      finalPrice = arrangement.price * (1 - activeDiscount.value / 100)
    } else {
      finalPrice = arrangement.price - activeDiscount.value
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="rounded-lg overflow-hidden mb-6">
        <img
          src={arrangement.imageUrl || `https://picsum.photos/seed/${arrangement.destination}/800/400`}
          alt={arrangement.destination}
          className="w-full h-64 object-cover"
        />
      </div>

      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
        {arrangement.category?.name}
      </span>

      <h1 className="text-3xl font-bold mt-4">{arrangement.destination}</h1>

      <p className="text-gray-600 mt-4">{arrangement.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-sm text-gray-500">Polazak</p>
          <p className="font-semibold">{formatDate(arrangement.startDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Povratak</p>
          <p className="font-semibold">{formatDate(arrangement.endDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Broj noćenja</p>
          <p className="font-semibold">{arrangement.numberOfNights}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Cena</p>
          {activeDiscount ? (
            <div>
              <p className="text-gray-400 line-through">{arrangement.price} €</p>
              <p className="font-bold text-green-600">{finalPrice.toFixed(2)} €</p>
            </div>
          ) : (
            <p className="font-bold text-blue-600">{arrangement.price} €</p>
          )}
        </div>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          message.includes('uspešno') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <Button onClick={() => router.back()} variant="secondary">
          Nazad
        </Button>
        <Button onClick={handleReservation} disabled={reserving}>
          {reserving ? 'Rezervacija...' : 'Rezerviši'}
        </Button>
      </div>
    </div>
  )
}