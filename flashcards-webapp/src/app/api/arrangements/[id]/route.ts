import { checkAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const arrangement = await prisma.arrangement.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        discounts: true,
        reservations: true
      }
    })

    if (!arrangement) {
      return NextResponse.json(
        { error: 'Aranžman nije pronađen' },
        { status: 404 }
      )
    }

    return NextResponse.json(arrangement)
  } catch (error) {
    console.error('Greška pri dohvatanju aranžmana:', error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = checkAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Morate biti prijavljeni' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    const existingArrangement = await prisma.arrangement.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingArrangement) {
      return NextResponse.json(
        { error: 'Aranžman nije pronađen' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (body.destination) updateData.destination = body.destination
    if (body.description) updateData.description = body.description
    if (body.price) updateData.price = parseFloat(body.price)
    if (body.startDate) updateData.startDate = new Date(body.startDate)
    if (body.endDate) updateData.endDate = new Date(body.endDate)
    if (body.numberOfNights) updateData.numberOfNights = parseInt(body.numberOfNights)
    if (body.imageUrl) updateData.imageUrl = body.imageUrl
    if (body.categoryId) updateData.categoryId = body.categoryId

    const arrangement = await prisma.arrangement.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        category: true
      }
    })

    return NextResponse.json(arrangement)
  } catch (error) {
    console.error('Greška pri izmeni aranžmana:', error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = checkAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Morate biti prijavljeni' },
        { status: 401 }
      )
    }

    const { id } = await params

    const existingArrangement = await prisma.arrangement.findUnique({
      where: { id: parseInt(id) },
      include: { reservations: true }
    })

    if (!existingArrangement) {
      return NextResponse.json(
        { error: 'Aranžman nije pronađen' },
        { status: 404 }
      )
    }

    const activeReservations = existingArrangement.reservations.filter(
      r => r.status === 'PENDING' || r.status === 'CONFIRMED'
    )

    if (activeReservations.length > 0) {
      return NextResponse.json(
        { error: 'Ne možete obrisati aranžman sa aktivnim rezervacijama' },
        { status: 409 }
      )
    }

    await prisma.discount.deleteMany({
      where: { arrangementId: parseInt(id) }
    })

    await prisma.arrangement.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Aranžman uspešno obrisan' })
  } catch (error) {
    console.error('Greška pri brisanju aranžmana:', error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}