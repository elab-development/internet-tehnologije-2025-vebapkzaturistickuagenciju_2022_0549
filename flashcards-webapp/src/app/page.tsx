'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import HeroSlideshow from '@/components/HeroSlideshow'
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
      setArrangements(Array.isArray(data) ? data : data.arrangements ?? [])
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
    <div>
      <HeroSlideshow />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-2">Dostupni aranžmani</h2>
        <p className="text-gray-600 mb-6">Pronađite savršen odmor za vas</p>

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
          <p className="text-center text-gray-500 mt-12">
            Nema dostupnih aranžmana.
          </p>
        )}
      </div>
    </div>
  )
}