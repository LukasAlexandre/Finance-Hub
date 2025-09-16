import { NextResponse } from 'next/server'
import { hashPassword, findUserByEmail } from '@/lib/auth'
import { query } from '@/lib/db'
import z from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = schema.parse(json)

    const existing = await findUserByEmail(parsed.email)
    if (existing) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 })
    }

    const password_hash = hashPassword(parsed.password)
    await query('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [parsed.name, parsed.email, password_hash])

    return NextResponse.json({ success: true })
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: e.flatten() }, { status: 400 })
    }
    console.error('Erro register', e)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
