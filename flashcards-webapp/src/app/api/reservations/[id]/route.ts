import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        arrangement: {
          include: {
            category: true
          }
        }
      }
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Rezervacija nije pronađena' },
        { status: 404 }
      )
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Greška pri dohvatanju rezervacije:', error)
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
    const { id } = await params
    const body = await request.json()
    const { status } = body


    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Nevažeći status. Dozvoljeni: PENDING, CONFIRMED, CANCELLED, COMPLETED' },
        { status: 400 }
      )
    }


    const existingReservation = await prisma.reservation.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingReservation) {
      return NextResponse.json(
        { error: 'Rezervacija nije pronađena' },
        { status: 404 }
      )
    }

    const reservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        arrangement: true
      }
    })

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Greška pri promeni statusa:', error)
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
    const { id } = await params

    const existingReservation = await prisma.reservation.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingReservation) {
      return NextResponse.json(
        { error: 'Rezervacija nije pronađena' },
        { status: 404 }
      )
    }

    await prisma.reservation.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Rezervacija uspešno obrisana' })
  } catch (error) {
    console.error('Greška pri brisanju rezervacije:', error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}