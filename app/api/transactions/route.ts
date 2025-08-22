import { type NextRequest, NextResponse } from "next/server"
import { getPluggyAPI } from "@/lib/pluggy-api"
import { categorizeTransaction } from "@/lib/categories"
import type { CategorizedTransaction } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const accountId = searchParams.get("accountId")

    const pluggy = getPluggyAPI()

    if (!accountId) {
      console.log("[v0] Nenhum accountId fornecido, buscando todas as contas primeiro...")
      const accounts = await pluggy.getAccounts()
      console.log("[v0] Contas encontradas:", accounts.length)

      let allTransactions: any[] = []

      // Busca transações de cada conta
      for (const account of accounts) {
        try {
          console.log("[v0] Buscando transações da conta:", account.id)
          const accountTransactions = await pluggy.getTransactions(account.id, from || undefined, to || undefined)
          allTransactions = [...allTransactions, ...accountTransactions]
          console.log("[v0] Transações encontradas para conta", account.id, ":", accountTransactions.length)
        } catch (error) {
          console.error("[v0] Erro ao buscar transações da conta", account.id, ":", error)
          // Continue com as outras contas mesmo se uma falhar
        }
      }

      console.log("[v0] Total de transações encontradas:", allTransactions.length)

      // Categoriza as transações automaticamente
      const categorizedTransactions: CategorizedTransaction[] = allTransactions.map((transaction) => ({
        ...transaction,
        localCategory: categorizeTransaction(transaction.description, transaction.amount),
      }))

      return NextResponse.json(categorizedTransactions)
    }

    const transactions = await pluggy.getTransactions(accountId, from || undefined, to || undefined)

    // Categoriza as transações automaticamente
    const categorizedTransactions: CategorizedTransaction[] = transactions.map((transaction) => ({
      ...transaction,
      localCategory: categorizeTransaction(transaction.description, transaction.amount),
    }))

    return NextResponse.json(categorizedTransactions)
  } catch (error) {
    console.error("Erro ao buscar transações:", error)
    return NextResponse.json({ error: "Erro ao buscar transações" }, { status: 500 })
  }
}
