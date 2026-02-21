'use client'

import { useState, useEffect } from 'react'
import { Chart } from 'react-google-charts'

interface Reservation {
  id: number
  status: string
  createdAt: string
  arrangement: {
    destination: string
    price: number
    category: {
      name: string
    }
  }
}

export default function StatisticsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('/api/reservations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : data.reservations ?? []
        setReservations(arr)
      })
      .finally(() => setLoading(false))
  }, [])

  // Rezervacije po statusu
  const statusData = () => {
    const counts: Record<string, number> = {}
    reservations.forEach(r => {
      counts[r.status] = (counts[r.status] || 0) + 1
    })
    return [
      ['Status', 'Broj rezervacija'],
      ...Object.entries(counts)
    ]
  }

  // Rezervacije po mesecu
  const monthData = () => {
    const counts: Record<string, number> = {}
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec']
    reservations.forEach(r => {
      const month = monthNames[new Date(r.createdAt).getMonth()]
      counts[month] = (counts[month] || 0) + 1
    })
    return [
      ['Mesec', 'Broj rezervacija'],
      ...Object.entries(counts)
    ]
  }

  // Rezervacije po kategoriji
  const categoryData = () => {
    const counts: Record<string, number> = {}
    reservations.forEach(r => {
      const cat = r.arrangement?.category?.name ?? 'Ostalo'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return [
      ['Kategorija', 'Broj rezervacija'],
      ...Object.entries(counts)
    ]
  }

  // Top 5 destinacija
  const topDestinations = () => {
    const counts: Record<string, number> = {}
    reservations.forEach(r => {
      const dest = r.arrangement?.destination ?? 'Nepoznato'
      counts[dest] = (counts[dest] || 0) + 1
    })
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
    return [['Destinacija', 'Rezervacije'], ...sorted]
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-500">Učitavanje statistika...</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">📊 Statistike</h1>
      <p className="text-gray-600 mb-8">Pregled rezervacija i analiza podataka</p>

      {/* Summary kartice */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{reservations.length}</p>
          <p className="text-sm text-blue-700 mt-1">Ukupno rezervacija</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600">
            {reservations.filter(r => r.status === 'CONFIRMED').length}
          </p>
          <p className="text-sm text-green-700 mt-1">Potvrđene</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">
            {reservations.filter(r => r.status === 'PENDING').length}
          </p>
          <p className="text-sm text-yellow-700 mt-1">Na čekanju</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-red-600">
            {reservations.filter(r => r.status === 'CANCELLED').length}
          </p>
          <p className="text-sm text-red-700 mt-1">Otkazane</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie chart - status */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Rezervacije po statusu</h2>
          <Chart
            chartType="PieChart"
            data={statusData()}
            options={{
              pieHole: 0.4,
              colors: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'],
              legend: { position: 'bottom' },
            }}
            width="100%"
            height="300px"
          />
        </div>

        {/* Bar chart - meseci */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Rezervacije po mesecu</h2>
          <Chart
            chartType="ColumnChart"
            data={monthData()}
            options={{
              colors: ['#8b5cf6'],
              legend: { position: 'none' },
              hAxis: { title: 'Mesec' },
              vAxis: { title: 'Broj rezervacija', minValue: 0 },
            }}
            width="100%"
            height="300px"
          />
        </div>

        {/* Bar chart - kategorije */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Rezervacije po kategoriji</h2>
          <Chart
            chartType="BarChart"
            data={categoryData()}
            options={{
              colors: ['#06b6d4'],
              legend: { position: 'none' },
              hAxis: { title: 'Broj rezervacija', minValue: 0 },
            }}
            width="100%"
            height="300px"
          />
        </div>

        {/* Bar chart - top destinacije */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Top 5 destinacija</h2>
          <Chart
            chartType="BarChart"
            data={topDestinations()}
            options={{
              colors: ['#f97316'],
              legend: { position: 'none' },
              hAxis: { title: 'Broj rezervacija', minValue: 0 },
            }}
            width="100%"
            height="300px"
          />
        </div>
      </div>
    </div>
  )
}