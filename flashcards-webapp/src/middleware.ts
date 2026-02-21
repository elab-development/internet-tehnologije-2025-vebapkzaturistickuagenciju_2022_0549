import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT = 100
const WINDOW_MS = 60 * 1000

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // ✅ 1. Security Headers (XSS, Clickjacking, MIME sniffing zaštita)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://www.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://openweathermap.org https://v6.exchangerate-api.com; frame-src https://www.google.com;"
  )

  // ✅ 2. CORS
  const origin = request.headers.get('origin')
  const allowedOrigins = ['http://localhost:3000']

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers })
  }

  // ✅ 3. Rate Limiting (samo za API rute)
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown'
    const now = Date.now()
    const record = rateLimitMap.get(ip)

    if (!record || now - record.lastReset > WINDOW_MS) {
      rateLimitMap.set(ip, { count: 1, lastReset: now })
    } else {
      record.count++
      if (record.count > RATE_LIMIT) {
        return NextResponse.json(
          { error: 'Previše zahteva. Pokušajte ponovo za minut.' },
          { status: 429 }
        )
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}