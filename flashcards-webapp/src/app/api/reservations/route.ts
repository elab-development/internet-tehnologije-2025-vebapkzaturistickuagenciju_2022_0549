import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAuth } from '@/lib/auth'
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const where: any = {}

    if (userId) {
      where.userId = parseInt(userId)
    }

    const reservations = await prisma.reservation.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(reservations)
  } catch (error) {
    console.error('Greška pri dohvatanju rezervacija:', error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}


export async function POST(request: NextRequest) {
  try {
    const user = checkAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Morate biti prijavljeni' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userId, arrangementId } = body

    if (!userId || !arrangementId) {
      return NextResponse.json(
        { error: 'userId i arrangementId su obavezni' },
        { status: 400 }
      )
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!userExists) {
      return NextResponse.json(
        { error: 'Korisnik ne postoji' },
        { status: 404 }
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

    const reservation = await prisma.reservation.create({
      data: {
        userId,
        arrangementId,
        status: 'PENDING'
      },
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

    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    console.error('Greška pri kreiranju rezervacije:', error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}