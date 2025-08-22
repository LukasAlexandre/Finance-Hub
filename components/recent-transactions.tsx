"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import type { CategorizedTransaction } from "@/lib/types"

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<CategorizedTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular dados de transações recentes
    setTimeout(() => {
      setTransactions([
        {
          id: "1",
          description: "Supermercado Extra",
          descriptionRaw: "SUPERMERCADO EXTRA",
          amount: -156.78,
          date: "2024-01-15",
          currencyCode: "BRL",
          balance: 2843.22,
          category: "food",
          accountId: "acc1",
          providerCode: "nubank",
          status: "posted",
          localCategory: "food",
        },
        {
          id: "2",
          description: "Salário",
          descriptionRaw: "SALARIO EMPRESA XYZ",
          amount: 5500.0,
          date: "2024-01-15",
          currencyCode: "BRL",
          balance: 8343.22,
          category: "income",
          accountId: "acc1",
          providerCode: "nubank",
          status: "posted",
          localCategory: "income",
        },
        {
          id: "3",
          description: "Uber",
          descriptionRaw: "UBER TRIP",
          amount: -23.5,
          date: "2024-01-14",
          currencyCode: "BRL",
          balance: 2866.72,
          category: "transport",
          accountId: "acc1",
          providerCode: "nubank",
          status: "posted",
          localCategory: "transport",
        },
        {
          id: "4",
          description: "Netflix",
          descriptionRaw: "NETFLIX SUBSCRIPTION",
          amount: -29.9,
          date: "2024-01-14",
          currencyCode: "BRL",
          balance: 2890.22,
          category: "entertainment",
          accountId: "acc1",
          providerCode: "nubank",
          status: "posted",
          localCategory: "flexible",
        },
        {
          id: "5",
          description: "Farmácia Drogasil",
          descriptionRaw: "FARMACIA DROGASIL",
          amount: -45.6,
          date: "2024-01-13",
          currencyCode: "BRL",
          balance: 2920.12,
          category: "health",
          accountId: "acc1",
          providerCode: "nubank",
          status: "posted",
          localCategory: "health",
        },
      ])
      setLoading(false)
    }, 800)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Math.abs(value))
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: "bg-red-100 text-red-800",
      transport: "bg-blue-100 text-blue-800",
      health: "bg-cyan-100 text-cyan-800",
      flexible: "bg-green-100 text-green-800",
      income: "bg-emerald-100 text-emerald-800",
      bills: "bg-purple-100 text-purple-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      food: "Alimentação",
      transport: "Transporte",
      health: "Saúde",
      flexible: "Flexível",
      income: "Receita",
      bills: "Contas",
    }
    return names[category] || "Outros"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                  <div>
                    <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-muted rounded w-16 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Badge variant="secondary" className={getCategoryColor(transaction.localCategory)}>
                    {getCategoryName(transaction.localCategory)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {transaction.amount >= 0 ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
