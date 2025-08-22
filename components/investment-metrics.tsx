"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, PieChart, Calendar } from "lucide-react"

export function InvestmentMetrics() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const metrics = [
    {
      title: "Rentabilidade Anual",
      value: "+12.8%",
      description: "Últimos 12 meses",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Diversificação",
      value: "85%",
      description: "4 classes de ativos",
      progress: 85,
      icon: PieChart,
      color: "text-blue-600",
    },
    {
      title: "Meta de Aporte",
      value: "92%",
      description: "R$ 2.760 de R$ 3.000",
      progress: 92,
      icon: Target,
      color: "text-primary",
    },
    {
      title: "Tempo Médio",
      value: "18 meses",
      description: "Tempo de investimento",
      icon: Calendar,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mb-2">{metric.description}</p>
            {metric.progress && <Progress value={metric.progress} className="h-2" />}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
