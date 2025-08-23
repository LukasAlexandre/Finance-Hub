"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


import { useEffect, useState } from "react"
import investmentHistory from "@/lib/investment-history.json"
import { writeFile } from "fs"

interface InvestmentPoint {
  month: string
  stocks: number
  funds: number
  fixedIncome: number
}

export function InvestmentAreaChart() {

  const [data, setData] = useState<InvestmentPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInvestmentEvolution() {
      setLoading(true)
      try {
        // 1. Carregar histórico manual
        let manualHistory: InvestmentPoint[] = []
        try {
          manualHistory = Array.isArray(investmentHistory) ? investmentHistory : []
        } catch { manualHistory = [] }

        // 2. Buscar saldo atual dos investimentos
        const response = await fetch(`/api/investments`)
        const investments = await response.json()
        let current: InvestmentPoint = { month: '', stocks: 0, funds: 0, fixedIncome: 0 }
        const now = new Date()
        const currentMonth = `${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear().toString().slice(2)}`
        if (Array.isArray(investments)) {
          investments.forEach((inv: any) => {
            if (inv.type === 'STOCK' || inv.type === 'stock') current.stocks += inv.balance || inv.value || 0
            else if (inv.type === 'FUND' || inv.type === 'fund') current.funds += inv.balance || inv.value || 0
            else current.fixedIncome += inv.balance || inv.value || 0
          })
        }
        current.month = currentMonth

        // 3. Registrar snapshot automático no início do mês (simulação client-side)
        // Em produção, isso deveria ser feito via backend agendado
        let autoHistory: InvestmentPoint[] = []
        if (manualHistory.length > 0) {
          // Pega o último mês do histórico manual
          const lastManual = manualHistory[manualHistory.length - 1]
          // Se já existe registro do mês atual, não duplica
          if (!manualHistory.find(h => h.month === currentMonth)) {
            autoHistory = [...manualHistory, current]
          } else {
            autoHistory = [...manualHistory.filter(h => h.month !== currentMonth), current]
          }
        } else {
          autoHistory = [current]
        }

        setData(autoHistory)
      } catch (e) {
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchInvestmentEvolution()
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
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0)
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
          <hr className="my-2 border-border" />
          <p className="font-bold">Total: {formatCurrency(total)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução dos Investimentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="fixedIncome" stackId="a" fill="hsl(var(--chart-4))" name="Renda Fixa" />
              <Bar dataKey="funds" stackId="a" fill="hsl(var(--chart-2))" name="Fundos" />
              <Bar dataKey="stocks" stackId="a" fill="hsl(var(--chart-1))" name="Ações" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
