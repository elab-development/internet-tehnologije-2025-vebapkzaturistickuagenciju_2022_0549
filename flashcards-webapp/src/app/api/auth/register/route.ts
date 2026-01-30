import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'


export async function POST(request: NextRequest) {
  try {

    const body = await request.json()
    const { firstName, lastName, email, password } = body


    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Sva polja su obavezna' },
        { status: 400 }
      )
    }


    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Korisnik sa ovim emailom već postoji' },
        { status: 409 }
      )
    }


    const hashedPassword = await bcrypt.hash(password, 10)


    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })


    return NextResponse.json(
      {
        message: 'Korisnik uspešno registrovan',
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Greška pri registraciji:', error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}