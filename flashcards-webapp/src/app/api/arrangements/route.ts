import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const destination = searchParams.get('destination')
    const categoryId = searchParams.get('categoryId')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    const where: any = {}

    if (destination) {
      where.destination = {
        contains: destination,
        mode: 'insensitive'
      }
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId)
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    const arrangements = await prisma.arrangement.findMany({
      where,
      include: {
        category: true,
        discounts: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(arrangements)
  } catch (error) {
    console.error('Greška pri dohvatanju aranžmana:', error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      destination,
      description,
      price,
      startDate,
      endDate,
      numberOfNights,
      imageUrl,
      categoryId
    } = body

    if (!destination || !description || !price || !startDate || !endDate || !numberOfNights || !categoryId) {
      return NextResponse.json(
        { error: 'Sva obavezna polja moraju biti popunjena' },
        { status: 400 }
      )
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Kategorija ne postoji' },
        { status: 404 }
      )
    }


    const arrangement = await prisma.arrangement.create({
      data: {
        destination,
        description,
        price: parseFloat(price),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        numberOfNights: parseInt(numberOfNights),
        imageUrl,
        categoryId
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(arrangement, { status: 201 })
  } catch (error) {
    console.error('Greška pri kreiranju aranžmana:', error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}