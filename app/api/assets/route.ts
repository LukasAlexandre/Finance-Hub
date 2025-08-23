import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const assets = await prisma.asset.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(assets);
  } catch (e) {
    console.error('Erro ao buscar ativos:', e);
    return NextResponse.json({ error: 'Erro ao buscar ativos', details: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const asset = await prisma.asset.create({
      data: {
        type: data.type,
        ticker: data.ticker,
        quantity: Number(data.quantity),
        price: Number(data.price),
        total: Number(data.total),
        purchaseDate: new Date(data.purchaseDate),
      },
    });
    return NextResponse.json(asset);
  } catch (e) {
    console.error('Erro ao cadastrar ativo:', e);
    return NextResponse.json({ error: 'Erro ao cadastrar ativo', details: String(e) }, { status: 500 });
  }
}
