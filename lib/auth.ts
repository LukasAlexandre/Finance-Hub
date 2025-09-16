import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { queryOne } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

export interface User {
  id: number
  name: string
  email: string
  password_hash: string
  created_at: string
}

export function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash)
}

export function signToken(user: { id: number; email: string }) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' })
}

export function verifyToken(token: string): { sub: number; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return queryOne<User>('SELECT * FROM users WHERE email = ?', [email])
}

export async function findUserById(id: number): Promise<User | null> {
  return queryOne<User>('SELECT * FROM users WHERE id = ?', [id])
}
