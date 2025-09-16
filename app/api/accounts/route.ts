import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'
import z from 'zod'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  try {
  const jar = await cookies()
  const token = jar.get('financehub_token')?.value
    if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    const accounts = await query<any>(
      'SELECT a.*, (a.initial_balance + IFNULL(SUM(t.amount),0)) AS current_balance FROM accounts a LEFT JOIN transactions t ON t.account_id = a.id WHERE a.user_id = ? GROUP BY a.id ORDER BY a.created_at DESC',
      [payload.sub]
    )
    return NextResponse.json(accounts)
  } catch (e) {
    console.error('Erro GET /accounts', e)
    return NextResponse.json({ error: 'Erro ao buscar contas' }, { status: 500 })
  }
}

const accountSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['checking','savings','wallet','investment','credit','other']).default('checking'),
  initialBalance: z.number().optional().default(0)
})

export async function POST(req: Request) {
  try {
  const jar = await cookies()
  const token = jar.get('financehub_token')?.value
    if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    const json = await req.json()
    const data = accountSchema.parse(json)
    await query('INSERT INTO accounts (user_id, name, type, initial_balance) VALUES (?,?,?,?)', [payload.sub, data.name, data.type, data.initialBalance ?? 0])
    const created = await queryOne<any>('SELECT * FROM accounts WHERE user_id = ? ORDER BY id DESC LIMIT 1', [payload.sub])
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: 'Dados inválidos', details: e.flatten() }, { status: 400 })
    console.error('Erro POST /accounts', e)
    return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 })
  }
}
