"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, PieChart, Calendar } from "lucide-react"

interface Asset {
  id: number;
  type: string;
  ticker?: string;
  quantity: number;
  price: number;
  total: number;
  purchaseDate: string;
  createdAt: string;
}

type InvestmentMetricsProps = {
  assets: Asset[]
}

export function InvestmentMetrics({ assets }: InvestmentMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Agrupar por tipo
  const allocation = [
    { name: "FIIs", value: assets.filter(a => a.type === "FII").reduce((sum, a) => sum + a.total, 0) },
    { name: "Renda Fixa", value: assets.filter(a => a.type === "Renda Fixa").reduce((sum, a) => sum + a.total, 0) },
    { name: "Ações", value: assets.filter(a => a.type === "Ação").reduce((sum, a) => sum + a.total, 0) },
    { name: "Criptomoedas", value: assets.filter(a => a.type === "Criptomoeda").reduce((sum, a) => sum + a.total, 0) },
  ];
  const totalInvestido = allocation.reduce((sum, a) => sum + a.value, 0);
  const diversification = totalInvestido > 0 ? Math.round((allocation[3].value / totalInvestido) * 100) : 0;

  // Meta de aporte: 0 de 1000
  const aporteAtual = 0;
  const aporteMeta = 1000;
  const aportePercent = 0;

  // Tempo médio: desde 03/2025 até mês atual
  const start = new Date(2025, 2, 1); // Março/2025 (mês 2)
  const now = new Date();
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1;
  if (months < 1) months = 1;

  const metrics = [
    {
      title: "Patrimônio total",
      value: formatCurrency(totalInvestido),
      description: "Soma de todos os ativos",
      icon: Target,
      color: "text-primary",
    },
    {
      title: "Rentabilidade Atual",
      value: "+12,63%",
      description: "Rentabilidade acumulada",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Diversificação",
      value: `${diversification}%`,
      description: "% do portfólio em dólar (cripto)",
      progress: diversification,
      icon: PieChart,
      color: "text-blue-600",
    },
    {
      title: "Meta de Aporte",
      value: `${aportePercent}%`,
      description: `${formatCurrency(aporteAtual)} de ${formatCurrency(aporteMeta)}`,
      progress: aportePercent,
      icon: Target,
      color: "text-primary",
    },
    {
      title: "Tempo Médio",
      value: `${months} meses`,
      description: "Tempo de carteira",
      icon: Calendar,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mb-2">{metric.description}</p>
            {typeof metric.progress === 'number' && <Progress value={metric.progress} className="h-2" />}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
