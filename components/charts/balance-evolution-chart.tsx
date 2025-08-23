"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


import { useEffect, useState } from "react"

interface BalancePoint {
  date: string
  balance: number
}

export function BalanceEvolutionChart() {

  const [data, setData] = useState<BalancePoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBalanceEvolution() {
      setLoading(true)
      try {
        // Buscar todas as transações do ano atual
        const now = new Date()
        const from = `${now.getFullYear()}-01-01`
        const to = `${now.getFullYear()}-12-31`
        const response = await fetch(`/api/transactions?from=${from}&to=${to}`)
        const transactions = await response.json()

        // Agrupar por dia e pegar o saldo do fim do dia
        const dailyMap: { [date: string]: number } = {}
        if (Array.isArray(transactions)) {
          transactions.forEach((tx: any) => {
            if (tx.balance != null && tx.date) {
              dailyMap[tx.date] = tx.balance
            }
          })
        }
        // Ordenar por data
        const points: BalancePoint[] = Object.entries(dailyMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, balance]) => ({ date: date.slice(5).split("-").reverse().join("/"), balance }))
        setData(points)
      } catch (e) {
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchBalanceEvolution()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução do Saldo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
