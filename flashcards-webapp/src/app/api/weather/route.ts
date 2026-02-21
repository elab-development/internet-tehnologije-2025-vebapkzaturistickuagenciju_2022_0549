import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')

  if (!city) {
    return NextResponse.json({ error: 'Grad je obavezan' }, { status: 400 })
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=hr`
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'Grad nije pronađen' }, { status: 404 })
    }

    const data = await response.json()

    return NextResponse.json({
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Greška na serveru' }, { status: 500 })
  }
}