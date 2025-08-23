"use client"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

import { InvestmentPortfolio } from "@/components/investment-portfolio"
import { InvestmentAllocation } from "@/components/investment-allocation"
import { InvestmentMetrics } from "@/components/investment-metrics"
import { InvestmentPerformance } from "@/components/investment-performance"
import { InvestmentAreaChart } from "@/components/charts/investment-area-chart"
import { ManualAssetInput } from "@/components/manual-asset-input"
import { useState, useEffect } from "react"


export default function InvestmentsPage() {
  const [showModal, setShowModal] = useState(false)
  const [lastAsset, setLastAsset] = useState<any>(null)
  const [assets, setAssets] = useState<any[]>([]);
  const fetchAssets = async () => {
    const res = await fetch('/api/assets');
    let data = await res.json();
    if (!Array.isArray(data)) data = [];
    setAssets(data);
  };
  useEffect(() => { fetchAssets(); }, []);
  useEffect(() => { if (lastAsset) fetchAssets(); }, [lastAsset]);

  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight font-serif">Investimentos</h2>
                <p className="text-muted-foreground">Acompanhe e gerencie seu portfólio de investimentos</p>
              </div>
              <button
                className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/80"
                onClick={() => setShowModal(true)}
              >
                Cadastrar Ativo
              </button>
            </div>

            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded shadow-lg p-6 relative">
                  <button className="absolute top-2 right-2 text-lg" onClick={() => setShowModal(false)}>&times;</button>
                  <ManualAssetInput onSave={asset => { setLastAsset(asset); setShowModal(false); }} />
                </div>
              </div>
            )}

            <InvestmentMetrics assets={assets} />

            <div className="grid gap-6 lg:grid-cols-2">
              <InvestmentAllocation assets={assets} />
              <InvestmentPerformance assets={assets} />
            </div>

            <InvestmentAreaChart assets={assets} />

            <InvestmentPortfolio assets={assets} />
          </div>
        </main>
      </div>
    </div>
  )
}
