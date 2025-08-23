"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react"
import { useEffect, useState } from "react"


interface OverviewData {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  totalInvestments: number
  monthlyChange: number
}

export function OverviewCards() {
  const [data, setData] = useState<OverviewData>({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalInvestments: 0,
    monthlyChange: 0,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchRealData = async () => {
    try {
      setRefreshing(true)
      console.log("[v0] Iniciando busca de dados reais...")

      // Buscar contas para calcular saldo total
      const accountsResponse = await fetch("/api/accounts")
      const accounts = await accountsResponse.json()
      console.log("[v0] Contas recebidas:", accounts)

      // Buscar transações do mês atual
      const currentDate = new Date()
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      const transactionsResponse = await fetch(
        `/api/transactions?from=${firstDayOfMonth.toISOString().split("T")[0]}&to=${lastDayOfMonth.toISOString().split("T")[0]}`,
      )
      const transactions = await transactionsResponse.json()
      console.log("[v0] Transações recebidas:", transactions)

      // Buscar investimentos
      const investmentsResponse = await fetch("/api/investments")
      const investments = await investmentsResponse.json()
      console.log("[v0] Investimentos recebidos:", investments)

      // Calcular métricas
      // Considerar apenas contas com subtype 'CHECKING_ACCOUNT' (corrente Nubank)
      const totalBalance = Array.isArray(accounts)
        ? accounts
            .filter((account: any) => account.subtype === 'CHECKING_ACCOUNT')
            .reduce((sum: number, account: any) => sum + (account.balance || 0), 0)
        : 0

      let totalIncome = 0
      let totalExpenses = 0

      if (Array.isArray(transactions)) {
        transactions.forEach((transaction: any) => {
          if (transaction.amount > 0) {
            totalIncome += transaction.amount
          } else {
            totalExpenses += Math.abs(transaction.amount)
          }
        })
      }

      const totalInvestments = Array.isArray(investments)
        ? investments.reduce((sum: number, investment: any) => sum + (investment.balance || investment.value || 0), 0)
        : 0

      // Calcular variação mensal (simulada por enquanto)
      const monthlyChange =
        totalIncome > totalExpenses
          ? ((totalIncome - totalExpenses) / totalExpenses) * 100
          : -(((totalExpenses - totalIncome) / totalIncome) * 100)

      console.log("[v0] Dados calculados:", {
        totalBalance,
        totalIncome,
        totalExpenses,
        totalInvestments,
        monthlyChange,
      })

      setData({
        totalBalance,
        totalIncome,
        totalExpenses,
        totalInvestments,
        monthlyChange: isNaN(monthlyChange) ? 0 : monthlyChange,
      })
    } catch (error) {
      console.error("[v0] Erro ao buscar dados reais:", error)
      // Em caso de erro, manter dados zerados
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchRealData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  let content
  if (loading) {
    content = (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-24 mb-2"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  } else {
    content = (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(data.totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`inline-flex items-center ${data.monthlyChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                {data.monthlyChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(data.monthlyChange)}% este mês
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(data.totalIncome)}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(data.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimentos</CardTitle>
            <PiggyBank className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(data.totalInvestments)}</div>
            <p className="text-xs text-muted-foreground">Patrimônio total</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end mb-2">
        <button
          className="px-3 py-1 rounded bg-primary text-white text-xs font-semibold hover:bg-primary/80 disabled:opacity-60"
          onClick={fetchRealData}
          disabled={refreshing}
        >
          {refreshing ? "Atualizando..." : "Atualizar Saldo"}
        </button>
      </div>
      {content}
    </div>
  )
}
