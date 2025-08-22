import { NextResponse } from "next/server"
import { getPluggyAPI } from "@/lib/pluggy-api"

export async function GET() {
  try {
    const pluggy = getPluggyAPI()
    const investments = await pluggy.getInvestments()

    return NextResponse.json(investments)
  } catch (error) {
    console.error("Erro ao buscar investimentos:", error)
    return NextResponse.json({ error: "Erro ao buscar investimentos" }, { status: 500 })
  }
}
