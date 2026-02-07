'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import { useRouter } from 'next/navigation'

interface Discount {
  id: number
  type: string
  value: number
}

interface Arrangement {
  id: number
  destination: string
  description: string
  price: number
  imageUrl: string | null
  category: {
    name: string
  }
  discounts: Discount[]
}

export default function HomePage() {
  const [arrangements, setArrangements] = useState<Arrangement[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchArrangements()
  }, [])

  const fetchArrangements = async () => {
    try {
      const response = await fetch('/api/arrangements')
      const data = await response.json()
      setArrangements(data)
    } catch (error) {
      console.error('Greška pri učitavanju:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDiscountedPrice = (arrangement: Arrangement) => {
    if (!arrangement.discounts || arrangement.discounts.length === 0) {
      return null
    }
    
    const discount = arrangement.discounts[0]
    if (discount.type === 'percentage' || discount.type === 'lastMinute') {
      return arrangement.price * (1 - discount.value / 100)
    } else {
      return arrangement.price - discount.value
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
      <h1 className="text-3xl font-bold text-center mb-8">
        Dobrodošli u <span className="text-purple-600">Telly</span>Travel
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Pronađite savršen aranžman za vaš odmor
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {arrangements.map((arrangement) => (
          <Card
            key={arrangement.id}
            title={arrangement.destination}
            description={arrangement.description}
            price={arrangement.price}
            discountedPrice={calculateDiscountedPrice(arrangement) || undefined}
            imageUrl={arrangement.imageUrl || undefined}
            category={arrangement.category?.name}
            onClick={() => router.push(`/arrangements/${arrangement.id}`)}
          />
        ))}
      </div>

      {arrangements.length === 0 && (
        <p className="text-center text-gray-500">
          Nema dostupnih aranžmana.
        </p>
      )}
    </div>
  )
}