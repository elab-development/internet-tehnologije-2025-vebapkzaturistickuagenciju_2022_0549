import { NextRequest } from 'next/server'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    arrangement: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

jest.mock('@/lib/auth', () => ({
  verifyToken: jest.fn(() => ({ id: 1, role: 'ADMIN' })),
}))

import { prisma } from '@/lib/prisma'

const mockArrangement = {
  id: 1,
  destination: 'Grčka - Santorini',
  description: 'Opis',
  price: 1200,
  startDate: new Date('2026-07-01'),
  endDate: new Date('2026-07-08'),
  numberOfNights: 7,
  imageUrl: null,
  categoryId: 1,
  isActive: true,
  capacity: 20,
  category: { name: 'More' },
  discounts: [],
}

describe('Arrangements API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/arrangements', () => {
    it('treba da vrati listu aranžmana', async () => {
      (prisma.arrangement.findMany as jest.Mock).mockResolvedValue([mockArrangement])

      const { GET } = await import('@/app/api/arrangements/route')
      const request = new NextRequest('http://localhost:3000/api/arrangements')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data) || Array.isArray(data.arrangements)).toBe(true)
    })

    it('treba da filtrira po kategoriji', async () => {
      (prisma.arrangement.findMany as jest.Mock).mockResolvedValue([mockArrangement])

      const { GET } = await import('@/app/api/arrangements/route')
      const request = new NextRequest('http://localhost:3000/api/arrangements?categoryId=1')

      const response = await GET(request)
      expect(response.status).toBe(200)
    })
  })

  describe('GET /api/arrangements/:id', () => {
    it('treba da vrati aranžman po ID', async () => {
      (prisma.arrangement.findUnique as jest.Mock).mockResolvedValue(mockArrangement)

      const { GET } = await import('@/app/api/arrangements/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/arrangements/1')

      const response = await GET(request, { params: Promise.resolve({ id: '1' }) })
      expect(response.status).toBe(200)
    })

    it('treba da vrati 404 ako aranžman ne postoji', async () => {
      (prisma.arrangement.findUnique as jest.Mock).mockResolvedValue(null)

      const { GET } = await import('@/app/api/arrangements/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/arrangements/999')

      const response = await GET(request, { params: Promise.resolve({ id: '999' }) })
      expect(response.status).toBe(404)
    })
  })
})