import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const amount = searchParams.get('amount')
  const from = searchParams.get('from') ?? 'EUR'

  if (!amount) {
    return NextResponse.json({ error: 'Iznos je obavezan' }, { status: 400 })
  }

  try {
    const apiKey = process.env.EXCHANGERATE_API_KEY
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'Greška pri dohvatanju kursa' }, { status: 500 })
    }

    const data = await response.json()
    const numAmount = parseFloat(amount)

    return NextResponse.json({
      base: from,
      amount: numAmount,
      conversions: {
        EUR: from === 'EUR' ? numAmount : (numAmount * data.conversion_rates.EUR).toFixed(2),
        USD: (numAmount * data.conversion_rates.USD).toFixed(2),
        GBP: (numAmount * data.conversion_rates.GBP).toFixed(2),
        RSD: (numAmount * data.conversion_rates.RSD).toFixed(2),
        CHF: (numAmount * data.conversion_rates.CHF).toFixed(2),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Greška na serveru' }, { status: 500 })
  }
}