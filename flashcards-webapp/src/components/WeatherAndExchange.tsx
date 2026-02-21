'use client'

import { useState, useEffect } from 'react'

interface WeatherData {
  city: string
  country: string
  temperature: number
  feelsLike: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
}

interface ExchangeData {
  base: string
  amount: number
  conversions: {
    EUR: string
    USD: string
    GBP: string
    RSD: string
    CHF: string
  }
}

interface Props {
  destination: string
  price: number
}

export default function WeatherAndExchange({ destination, price }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [exchange, setExchange] = useState<ExchangeData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [exchangeLoading, setExchangeLoading] = useState(true)

  // Izvuci samo naziv grada (pre crtice)
const cityMap: Record<string, string> = {
  'Santorini': 'Santorini',
  'Antalija': 'Antalya',
  'Ibiza': 'Ibiza',
  'Dubrovnik': 'Dubrovnik',
  'Hurgada': 'Hurghada',
  'Kopaonik': 'Kopaonik',
  'Pariz': 'Paris',
  'Rim': 'Rome',
  'Barselona': 'Barcelona',
  'Prag': 'Prague',
  'Beč': 'Vienna',
  'Budimpešta': 'Budapest',
  'Island': 'Reykjavik',
  'Tara': 'Bajina Basta',
}

const rawCity = destination.includes('-') 
  ? destination.split('-')[1].trim() 
  : destination.split('-')[0].trim()

const city = cityMap[rawCity] ?? rawCity
  useEffect(() => {
    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setWeather(data)
      })
      .finally(() => setWeatherLoading(false))

    fetch(`/api/exchange?amount=${price}&from=EUR`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setExchange(data)
      })
      .finally(() => setExchangeLoading(false))
  }, [city, price])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Vremenska prognoza */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">🌤 Trenutno vreme</h3>
        {weatherLoading ? (
          <p className="text-gray-500 text-sm">Učitavanje...</p>
        ) : weather ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
                className="w-12 h-12"
              />
              <div>
                <p className="text-3xl font-bold text-blue-900">{weather.temperature}°C</p>
                <p className="text-sm text-blue-700 capitalize">{weather.description}</p>
              </div>
            </div>
            <p className="text-sm text-blue-700">Osećaj: {weather.feelsLike}°C</p>
            <p className="text-sm text-blue-700">Vlažnost: {weather.humidity}%</p>
            <p className="text-sm text-blue-700">Vetar: {weather.windSpeed} m/s</p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Vreme nije dostupno za ovu destinaciju.</p>
        )}
      </div>

      {/* Kurs valuta */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-green-800 mb-3">💱 Cena u valutama</h3>
        {exchangeLoading ? (
          <p className="text-gray-500 text-sm">Učitavanje...</p>
        ) : exchange ? (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-green-700 font-medium">EUR</span>
              <span className="font-bold text-green-900">{exchange.conversions.EUR} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700 font-medium">USD</span>
              <span className="font-bold text-green-900">{exchange.conversions.USD} $</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700 font-medium">GBP</span>
              <span className="font-bold text-green-900">{exchange.conversions.GBP} £</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700 font-medium">RSD</span>
              <span className="font-bold text-green-900">{exchange.conversions.RSD} din</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700 font-medium">CHF</span>
              <span className="font-bold text-green-900">{exchange.conversions.CHF} Fr</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Kurs nije dostupan.</p>
        )}
      </div>
    </div>
  )
}