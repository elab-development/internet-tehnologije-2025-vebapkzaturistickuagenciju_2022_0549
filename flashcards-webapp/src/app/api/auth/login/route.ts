import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'


export async function POST(request: NextRequest) {
  try {

    const body = await request.json()
    const { email, password } = body


    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email i lozinka su obavezni' },
        { status: 400 }
      )
    }


    const user = await prisma.user.findUnique({
      where: { email }
    })


    if (!user) {
      return NextResponse.json(
        { error: 'Pogrešan email ili lozinka' },
        { status: 401 }
      )
    }


    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Pogrešan email ili lozinka' },
        { status: 401 }
      )
    }


    return NextResponse.json(
      {
        message: 'Uspešna prijava',
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Greška pri prijavi:', error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}