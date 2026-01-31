import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tajna-lozinka-123'

export function createToken(user: { id: number; email: string; role: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}


export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}