"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface CategoryData {
  name: string
  value: number
  color: string
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function ExpensePieChart() {
  const [data, setData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExpenseData() {
      try {
        console.log("[v0] Buscando dados de gastos por categoria...")

        const currentDate = new Date()
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        const response = await fetch(
          `/api/transactions?from=${firstDayOfMonth.toISOString().split("T")[0]}&to=${lastDayOfMonth.toISOString().split("T")[0]}`,
        )
        const transactions = await response.json()
        console.log("[v0] Transações para gráfico:", transactions)

        const categoryTotals: { [key: string]: number } = {}
        const categoryColors: { [key: string]: string } = {
          Alimentação: "#ef4444",
          Transporte: "#3b82f6",
          "Contas Fixas": "#8b5cf6",
          "Cartão de Crédito": "#f59e0b",
          "Contas Flexíveis": "#10b981",
          Saúde: "#06b6d4",
          Lazer: "#ec4899",
          Educação: "#84cc16",
          Outros: "#6b7280",
        }

        if (Array.isArray(transactions)) {
          transactions.forEach((transaction: any) => {
            // Apenas gastos (valores negativos)
            if (transaction.amount < 0) {
              const category = transaction.localCategory || "Outros"
              const amount = Math.abs(transaction.amount)
              categoryTotals[category] = (categoryTotals[category] || 0) + amount
            }
          })
        }

        const chartData = Object.entries(categoryTotals)
          .map(([name, value]) => ({
            name,
            value,
            color: categoryColors[name] || "#6b7280",
          }))
          .sort((a, b) => b.value - a.value) // Ordenar por valor decrescente

        console.log("[v0] Dados do gráfico processados:", chartData)
        setData(chartData)
      } catch (error) {
        console.error("[v0] Erro ao buscar dados de gastos:", error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchExpenseData()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary font-bold">{formatCurrency(data.value)}</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Nenhum gasto encontrado neste período
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => <span style={{ color: entry.color }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
