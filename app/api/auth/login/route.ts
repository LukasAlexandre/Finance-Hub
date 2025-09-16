import { NextResponse } from 'next/server'
import { findUserByEmail, verifyPassword, signToken } from '@/lib/auth'
import z from 'zod'

const schema = z.object({ email: z.string().email(), password: z.string().min(1) })

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = schema.parse(json)
    const user = await findUserByEmail(parsed.email)
    if (!user) return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    if (!verifyPassword(parsed.password, user.password_hash)) return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })

    const token = signToken({ id: user.id, email: user.email })

    const res = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
    res.cookies.set('financehub_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    })
    return res
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }
    console.error('Erro login', e)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
