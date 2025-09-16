import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'
import z from 'zod'

export async function GET() {
  try {
    const jar = await cookies()
    const token = jar.get('financehub_token')?.value
    if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    const assets = await query(
      'SELECT * FROM assets WHERE user_id = ? ORDER BY created_at DESC',
      [payload.sub]
    )
    return NextResponse.json(assets)
  } catch (e) {
    console.error('Erro ao buscar ativos:', e)
    return NextResponse.json({ error: 'Erro ao buscar ativos' }, { status: 500 })
  }
}

const assetSchema = z.object({
  type: z.enum(['stock','fund','fixed_income','crypto','other']),
  ticker: z.string().min(1),
  quantity: z.number().positive(),
  price: z.number().positive(),
  purchaseDate: z.string().regex(/\d{4}-\d{2}-\d{2}/)
})

export async function POST(req: Request) {
  try {
    const jar = await cookies()
    const token = jar.get('financehub_token')?.value
    if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    const json = await req.json()
    const data = assetSchema.parse(json)
    await query('INSERT INTO assets (user_id, type, ticker, quantity, price, purchase_date) VALUES (?,?,?,?,?,?)', [
      payload.sub,
      data.type,
      data.ticker,
      data.quantity,
      data.price,
      data.purchaseDate
    ])
    const created = await queryOne('SELECT * FROM assets WHERE user_id = ? ORDER BY id DESC LIMIT 1', [payload.sub])
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: 'Dados inválidos', details: e.flatten() }, { status: 400 })
    console.error('Erro ao cadastrar ativo:', e)
    return NextResponse.json({ error: 'Erro ao cadastrar ativo' }, { status: 500 })
  }
}
