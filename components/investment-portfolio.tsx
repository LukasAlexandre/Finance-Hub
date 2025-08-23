"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"


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


type InvestmentPortfolioProps = {
  assets: Asset[]
}

export function InvestmentPortfolio({ assets }: InvestmentPortfolioProps) {
  // Mapear tipos para exibição
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "Ação": "Ações",
      "FII": "FIIs",
      "Renda Fixa": "Renda Fixa",
      "Criptomoeda": "Criptomoedas",
    };
    return labels[type] || type;
  };
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Ação": "bg-blue-100 text-blue-800",
      "FII": "bg-green-100 text-green-800",
      "Renda Fixa": "bg-purple-100 text-purple-800",
      "Criptomoeda": "bg-orange-100 text-orange-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  const totalPortfolioValue = assets.reduce((sum, a) => sum + (a.total || 0), 0);

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
            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{asset.ticker || asset.type}</h3>
                      {asset.ticker && (
                        <Badge variant="outline" className="text-xs">
                          {asset.ticker}
                        </Badge>
                      )}
                      <Badge variant="secondary" className={getTypeColor(asset.type)}>
                        {getTypeLabel(asset.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {asset.quantity} unidades • Preço atual: {formatCurrency(asset.price)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(asset.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

