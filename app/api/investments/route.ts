import { NextResponse } from "next/server"
import { getPluggyAPI } from "@/lib/pluggy-api"

export async function GET(req: Request) {
  try {
    const pluggy = getPluggyAPI()
    const { searchParams } = new URL(req.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    // No Pluggy, não há filtro de data na API de investimentos, mas pode ser útil para filtrar manualmente
    let investments = await pluggy.getInvestments()
    if (from || to) {
      investments = investments.filter((inv: any) => {
        if (!inv.date) return false
        const d = new Date(inv.date)
        if (from && d < new Date(from)) return false
        if (to && d > new Date(to)) return false
        return true
      })
    }
    return NextResponse.json(investments)
  } catch (error) {
    console.error("Erro ao buscar investimentos:", error)
    return NextResponse.json({ error: "Erro ao buscar investimentos" }, { status: 500 })
  }
}
