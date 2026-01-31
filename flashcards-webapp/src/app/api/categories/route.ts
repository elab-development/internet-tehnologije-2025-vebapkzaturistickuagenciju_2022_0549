import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { arrangements: true }
        }
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Greška pri hvatanju kategorija:', error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Naziv kategorije je obavezan' },
        { status: 400 }
      )
    }

    const existingCategory = await prisma.category.findUnique({
      where: { name }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Kategorija sa ovim nazivom već postoji' },
        { status: 409 }
      )
    }

    const category = await prisma.category.create({
      data: { name }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Greška pri kreiranju kategorije:', error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}