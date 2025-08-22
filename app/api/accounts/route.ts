import { NextResponse } from "next/server"
import { getPluggyAPI } from "@/lib/pluggy-api"

export async function GET() {
  try {
    const pluggy = getPluggyAPI()
    const accounts = await pluggy.getAccounts()

    console.log("[v0] Contas retornadas pela API:")
    if (Array.isArray(accounts)) {
      accounts.forEach((account, index) => {
        console.log(`[v0] Conta ${index + 1}:`, {
          id: account.id,
          name: account.name,
          type: account.type,
          subtype: account.subtype,
          balance: account.balance,
          currencyCode: account.currencyCode,
        })
      })
      const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0)
      console.log(`[v0] Saldo total calculado: R$ ${totalBalance.toFixed(2)}`)
    } else {
      console.log("[v0] Accounts não é um array:", accounts)
    }

    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Erro ao buscar contas:", error)
    return NextResponse.json({ error: "Erro ao buscar contas" }, { status: 500 })
  }
}
