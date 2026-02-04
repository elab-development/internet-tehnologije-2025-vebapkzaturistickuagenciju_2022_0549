'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import { useRouter } from 'next/navigation'

interface Category {
  id: number
  name: string
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
}

export default function ArrangementsPage() {
  const [arrangements, setArrangements] = useState<Arrangement[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
    fetchArrangements()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Greška pri učitavanju kategorija:', error)
    }
  }

  const fetchArrangements = async (categoryId?: string) => {
    setLoading(true)
    try {
      const url = categoryId 
        ? `/api/arrangements?categoryId=${categoryId}`
        : '/api/arrangements'
      const response = await fetch(url)
      const data = await response.json()
      setArrangements(data)
    } catch (error) {
      console.error('Greška pri učitavanju:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value
    setSelectedCategory(categoryId)
    fetchArrangements(categoryId)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Svi aranžmani
      </h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtriraj po kategoriji:
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sve kategorije</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Učitavanje...</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            Pronađeno {arrangements.length} aranžmana
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {arrangements.map((arrangement) => (
              <Card
                key={arrangement.id}
                title={arrangement.destination}
                description={arrangement.description}
                price={arrangement.price}
                imageUrl={arrangement.imageUrl || undefined}
                category={arrangement.category?.name}
                onClick={() => router.push(`/arrangements/${arrangement.id}`)}
              />
            ))}
          </div>

          {arrangements.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              Nema aranžmana u ovoj kategoriji.
            </p>
          )}
        </>
      )}
    </div>
  )
}