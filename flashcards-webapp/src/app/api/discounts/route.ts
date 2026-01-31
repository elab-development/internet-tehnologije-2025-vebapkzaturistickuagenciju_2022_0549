import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const discounts = await prisma.discount.findMany({
      include: {
        arrangement: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(discounts)
  } catch (error) {
    console.error('Greška pri dohvatanju popusta:', error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, value, startDate, endDate, arrangementId } = body

    if (!type || !value || !startDate || !endDate || !arrangementId) {
      return NextResponse.json(
        { error: 'Sva polja su obavezna' },
        { status: 400 }
      )
    }

    const arrangement = await prisma.arrangement.findUnique({
      where: { id: arrangementId }
    })

    if (!arrangement) {
      return NextResponse.json(
        { error: 'Aranžman ne postoji' },
        { status: 404 }
      )
    }

    const discount = await prisma.discount.create({
      data: {
        type,
        value: parseFloat(value),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        arrangementId
      },
      include: {
        arrangement: true
      }
    })

    return NextResponse.json(discount, { status: 201 })
  } catch (error) {
    console.error('Greška pri kreiranju popusta:', error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}