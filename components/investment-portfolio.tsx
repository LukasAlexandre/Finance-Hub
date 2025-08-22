"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Investment {
  id: string
  name: string
  type: "stocks" | "funds" | "fixedIncome" | "crypto"
  symbol?: string
  quantity: number
  currentPrice: number
  totalValue: number
  purchasePrice: number
  purchaseValue: number
  profitLoss: number
  profitLossPercent: number
  lastUpdate: string
}

export function InvestmentPortfolio() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular dados de investimentos
    setTimeout(() => {
      const mockInvestments: Investment[] = [
        {
          id: "1",
          name: "Itaú Unibanco",
          type: "stocks",
          symbol: "ITUB4",
          quantity: 100,
          currentPrice: 32.5,
          totalValue: 3250,
          purchasePrice: 28.0,
          purchaseValue: 2800,
          profitLoss: 450,
          profitLossPercent: 16.07,
          lastUpdate: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          name: "Vale S.A.",
          type: "stocks",
          symbol: "VALE3",
          quantity: 50,
          currentPrice: 68.2,
          totalValue: 3410,
          purchasePrice: 72.0,
          purchaseValue: 3600,
          profitLoss: -190,
          profitLossPercent: -5.28,
          lastUpdate: "2024-01-15T10:30:00Z",
        },
        {
          id: "3",
          name: "Tesouro Selic 2029",
          type: "fixedIncome",
          quantity: 1,
          currentPrice: 12850.45,
          totalValue: 12850.45,
          purchasePrice: 12000.0,
          purchaseValue: 12000.0,
          profitLoss: 850.45,
          profitLossPercent: 7.09,
          lastUpdate: "2024-01-15T10:30:00Z",
        },
        {
          id: "4",
          name: "XP Allocation FIC FIM",
          type: "funds",
          quantity: 1000,
          currentPrice: 2.45,
          totalValue: 2450,
          purchasePrice: 2.2,
          purchaseValue: 2200,
          profitLoss: 250,
          profitLossPercent: 11.36,
          lastUpdate: "2024-01-15T10:30:00Z",
        },
        {
          id: "5",
          name: "Bitcoin",
          type: "crypto",
          symbol: "BTC",
          quantity: 0.05,
          currentPrice: 240000,
          totalValue: 12000,
          purchasePrice: 200000,
          purchaseValue: 10000,
          profitLoss: 2000,
          profitLossPercent: 20.0,
          lastUpdate: "2024-01-15T10:30:00Z",
        },
      ]
      setInvestments(mockInvestments)
      setLoading(false)
    }, 800)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      stocks: "Ações",
      funds: "Fundos",
      fixedIncome: "Renda Fixa",
      crypto: "Criptomoedas",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getTypeColor = (type: string) => {
    const colors = {
      stocks: "bg-blue-100 text-blue-800",
      funds: "bg-green-100 text-green-800",
      fixedIncome: "bg-purple-100 text-purple-800",
      crypto: "bg-orange-100 text-orange-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const totalPortfolioValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0)
  const totalProfitLoss = investments.reduce((sum, inv) => sum + inv.profitLoss, 0)
  const totalProfitLossPercent =
    totalPortfolioValue > 0 ? (totalProfitLoss / (totalPortfolioValue - totalProfitLoss)) * 100 : 0

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-32"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-5 bg-muted rounded w-24"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumo do Portfólio */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Portfólio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Patrimônio Total</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Lucro/Prejuízo</p>
              <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                {totalProfitLoss >= 0 ? "+" : ""}
                {formatCurrency(totalProfitLoss)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Rentabilidade</p>
              <p className={`text-2xl font-bold ${totalProfitLossPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                {totalProfitLossPercent >= 0 ? "+" : ""}
                {totalProfitLossPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Investimentos */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Investimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.map((investment) => (
              <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{investment.name}</h3>
                      {investment.symbol && (
                        <Badge variant="outline" className="text-xs">
                          {investment.symbol}
                        </Badge>
                      )}
                      <Badge variant="secondary" className={getTypeColor(investment.type)}>
                        {getTypeLabel(investment.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {investment.quantity} {investment.type === "crypto" ? "unidades" : "cotas"} • Preço atual:{" "}
                      {formatCurrency(investment.currentPrice)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold">{formatCurrency(investment.totalValue)}</p>
                  <div className="flex items-center space-x-2">
                    {investment.profitLoss >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${investment.profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {investment.profitLoss >= 0 ? "+" : ""}
                      {formatCurrency(investment.profitLoss)} ({investment.profitLossPercent >= 0 ? "+" : ""}
                      {investment.profitLossPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
