import { NextRequest } from 'next/server'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}))

// Mock auth
jest.mock('@/lib/auth', () => ({
  createToken: jest.fn(() => 'mock-token'),
  verifyToken: jest.fn(),
}))

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/auth/login', () => {
    it('treba da vrati grešku ako email ili lozinka nisu poslati', async () => {
      const { POST } = await import('@/app/api/auth/login/route')
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: '', password: '' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })

    it('treba da vrati grešku ako korisnik ne postoji', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      const { POST } = await import('@/app/api/auth/login/route')
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'nepostoji@gmail.com', password: 'lozinka' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBeDefined()
    })

    it('treba da vrati grešku ako je lozinka pogrešna', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@gmail.com',
        password: 'hashed',
        role: 'CLIENT',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false)

      const { POST } = await import('@/app/api/auth/login/route')
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@gmail.com', password: 'pogresna' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(401)
    })

    it('treba da vrati token pri uspešnoj prijavi', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@gmail.com',
        password: 'hashed',
        role: 'CLIENT',
        firstName: 'Test',
        lastName: 'User',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true)

      const { POST } = await import('@/app/api/auth/login/route')
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@gmail.com', password: 'tacna' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.token).toBe('mock-token')
    })
  })

  describe('POST /api/auth/register', () => {
    it('treba da vrati grešku ako korisnik već postoji', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 })

      const { POST } = await import('@/app/api/auth/register/route')
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: 'postoji@gmail.com',
          password: 'lozinka123',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(409)
    })

    it('treba da kreira korisnika uspešno', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'novi@gmail.com',
        role: 'CLIENT',
      })

      const { POST } = await import('@/app/api/auth/register/route')
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: 'novi@gmail.com',
          password: 'lozinka123',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(201)
    })
  })
})