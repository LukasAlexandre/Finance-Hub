"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


import { useEffect, useState } from "react"

interface MonthData {
  month: string
  income: number
  expenses: number
}

export function IncomeExpenseChart() {

  const [data, setData] = useState<MonthData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchIncomeExpense() {
      setLoading(true)
      try {
        // Buscar todas as transações do ano atual
        const now = new Date()
        const from = `${now.getFullYear()}-01-01`
        const to = `${now.getFullYear()}-12-31`
        const response = await fetch(`/api/transactions?from=${from}&to=${to}`)
        const transactions = await response.json()

        // Agrupar por mês
        const monthMap: { [month: string]: { income: number; expenses: number } } = {}
        if (Array.isArray(transactions)) {
          transactions.forEach((tx: any) => {
            if (tx.amount != null && tx.date) {
              const [year, month] = tx.date.split("-")
              const key = `${month}/${year.slice(2)}`
              if (!monthMap[key]) monthMap[key] = { income: 0, expenses: 0 }
              if (tx.amount > 0) monthMap[key].income += tx.amount
              else monthMap[key].expenses += Math.abs(tx.amount)
            }
          })
        }
        // Ordenar por mês
        const points: MonthData[] = Object.entries(monthMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, { income, expenses }]) => ({ month, income, expenses }))
        setData(points)
      } catch (e) {
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchIncomeExpense()
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
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-bold">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receitas vs Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
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
              <Legend />
              <Bar dataKey="income" name="Receitas" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Gastos" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
