import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { firstName, lastName, email, password, role, status } = body

    const updateData: Record<string, string> = {}
    
    if (firstName) updateData.firstName = firstName
    if (lastName) updateData.lastName = lastName
    if (email) updateData.email = email
    if (role) updateData.role = role
    if (status) updateData.status = status
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData
    })

    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: 'Greška pri ažuriranju' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = parseInt(id)

    await prisma.reservation.deleteMany({
      where: { userId: userId }
    })

    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ message: 'Korisnik obrisan' })
  } catch {
    return NextResponse.json({ error: 'Greška pri brisanju' }, { status: 500 })
  }
}