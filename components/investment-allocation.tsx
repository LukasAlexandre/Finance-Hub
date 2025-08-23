"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


const allocationColors = {
  "FIIs": "#06b6d4",
  "Renda Fixa": "#8b5cf6",
  "Ações": "#0891b2",
  "Criptomoedas": "#f59e0b",
};

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

type InvestmentAllocationProps = {
  assets: Asset[]
}

export function InvestmentAllocation({ assets }: InvestmentAllocationProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Agrupar por tipo
  type AllocationItem = { name: string; value: number; percentage: number };
  const rawData = [
    { name: "FIIs", value: assets.filter(a => a.type === "FII").reduce((sum, a) => sum + a.total, 0) },
    { name: "Renda Fixa", value: assets.filter(a => a.type === "Renda Fixa").reduce((sum, a) => sum + a.total, 0) },
    { name: "Ações", value: assets.filter(a => a.type === "Ação").reduce((sum, a) => sum + a.total, 0) },
    { name: "Criptomoedas", value: assets.filter(a => a.type === "Criptomoeda").reduce((sum, a) => sum + a.total, 0) },
  ];
  const total = rawData.reduce((sum, a) => sum + a.value, 0);
  const allocationData: AllocationItem[] = rawData.map(a => ({ ...a, percentage: total > 0 ? (a.value / total) * 100 : 0 }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary font-bold">{formatCurrency(data.value)}</p>
          <p className="text-sm text-muted-foreground">{data.payload.percentage.toFixed(1)}% do portfólio</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alocação de Ativos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ percentage }) => `${percentage.toFixed(1)}%`}
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={allocationColors[entry.name as keyof typeof allocationColors] || '#ccc'} />
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

        <div className="mt-4 space-y-2">
          {allocationData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: allocationColors[item.name as keyof typeof allocationColors] || '#ccc' }} />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{formatCurrency(item.value)}</p>
                <p className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
