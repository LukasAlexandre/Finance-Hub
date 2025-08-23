"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Dados reais do histórico manual + saldo automático
import investmentHistory from "@/lib/investment-history.json"

// Corrige tipagem do window para __CURRENT_INVESTMENTS__
declare global {
  interface Window {
    __CURRENT_INVESTMENTS__?: { stocks: number; funds: number; fixedIncome: number }
  }
}
const now = new Date()
const currentMonth = `${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear().toString().slice(2)}`
// Buscar saldo atual dos investimentos (mock para exemplo, ajuste para buscar real se necessário)
const currentInvestments = typeof window !== 'undefined' && window.__CURRENT_INVESTMENTS__
  ? window.__CURRENT_INVESTMENTS__
  : { stocks: 0, funds: 0, fixedIncome: 0 }

// Garante meses de 04/25 até 08/25
const monthsToShow = ["04/25", "05/25", "06/25", "07/25", "08/25"]
const history = [
  ...investmentHistory.filter(h => monthsToShow.includes(h.month)),
]
// CDI e rentabilidade reais mês a mês (em porcentagem)
const cdiPercents = [1.02, 2.08, 3.25, 4.38, 5.71] // 04/25 a 08/25
const rentabilidadePercents = [3.30, 6.79, 9.19, 12.29, 12.63] // 04/25 a 08/25
const performanceData = monthsToShow.map((month, i) => ({
  month,
  "Rentabilidade": rentabilidadePercents[i],
  "CDI": cdiPercents[i],
}))

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

type InvestmentPerformanceProps = {
  assets: Asset[]
}

export function InvestmentPerformance({ assets }: InvestmentPerformanceProps) {
  const formatPercent = (value: number) => `${value.toFixed(2)}%`

  // Calcular evolução do patrimônio mês a mês a partir dos ativos
  // Considera o valor total dos ativos cuja data de compra <= mês
  const monthsToShow = ["04/25", "05/25", "06/25", "07/25", "08/25"];
  const monthLabels = ["2025-04", "2025-05", "2025-06", "2025-07", "2025-08"];
  const patrimonioPorMes = monthLabels.map((ym, i) => {
    const [year, month] = ym.split("-");
    const ativosNoMes = assets.filter(a => {
      const d = new Date(a.purchaseDate);
      return d.getFullYear() < Number(year) || (d.getFullYear() === Number(year) && d.getMonth() + 1 <= Number(month));
    });
    const total = ativosNoMes.reduce((sum, a) => sum + a.total, 0);
    return { month: monthsToShow[i], Patrimonio: total };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatPercent(entry.value)}
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
        <CardTitle>Evolução do Patrimônio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={patrimonioPorMes} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
              />
              <Tooltip formatter={v => `R$ ${v.toLocaleString('pt-BR')}`} />
              <Bar dataKey="Patrimonio" name="Patrimônio" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
