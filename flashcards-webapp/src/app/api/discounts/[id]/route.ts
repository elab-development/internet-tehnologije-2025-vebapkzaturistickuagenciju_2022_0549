import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.discount.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Popust obrisan' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Greška pri brisanju popusta' },
      { status: 500 }
    )
  }
}