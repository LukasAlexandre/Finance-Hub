"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, CreditCard, TrendingUp, PieChart, Calendar, Target, Settings } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Transações", href: "/transactions", icon: CreditCard },
  { name: "Investimentos", href: "/investments", icon: TrendingUp },
  { name: "Categorias", href: "/categories", icon: PieChart },
  { name: "Planejamento", href: "/planning", icon: Calendar },
  { name: "Metas", href: "/goals", icon: Target },
]

export function DashboardSidebar() {
  const [currentPage, setCurrentPage] = useState("Dashboard")
  const router = useRouter()

  const handleNavigation = (item: (typeof navigation)[0]) => {
    setCurrentPage(item.name)
    router.push(item.href)
  }

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant={currentPage === item.name ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                currentPage === item.name
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
              onClick={() => handleNavigation(item)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Button>
          ))}
        </nav>

        <div className="px-2 mt-auto">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground">
            <Settings className="mr-3 h-5 w-5" />
            Configurações
          </Button>
        </div>
      </div>
    </div>
  )
}
