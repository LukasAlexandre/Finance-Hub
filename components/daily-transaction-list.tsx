"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, CalendarIcon, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { DEFAULT_CATEGORIES } from "@/lib/categories"
import type { CategorizedTransaction, DailyBalance } from "@/lib/types"

export function DailyTransactionList() {
  const [transactions, setTransactions] = useState<CategorizedTransaction[]>([])
  const [dailyBalances, setDailyBalances] = useState<DailyBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadTransactions()
  }, [dateRange, filterCategory, filterType])

  const loadTransactions = async () => {
    setLoading(true)
    try {
      // Simular dados de transações agrupadas por dia
      const mockTransactions: CategorizedTransaction[] = [
        {
          id: "1",
          description: "Supermercado Extra",
          descriptionRaw: "SUPERMERCADO EXTRA",
          amount: -156.78,
          date: "2024-01-15",
          currencyCode: "BRL",
          balance: 2843.22,
          category: "food",
          accountId: "acc1",
          providerCode: "nubank",
          status: "posted",
          localCategory: "food",
        },
        {
          id: "2",
          description: "Salário",
          descriptionRaw: "SALARIO EMPRESA XYZ",
          amount: 5500.0,
          date: "2024-01-15",
          currencyCode: "BRL",
          balance: 8343.22,
          category: "income",
          accountId: "acc1",
          providerCode: "nubank",
          status: "posted",
          localCategory: "income",
        },
        {
          id: "3",
          description: "Uber",
          descriptionRaw: "UBER TRIP",
          amount: -23.5,
          date: "2024-01-14",
          currencyCode: "BRL",
          balance: 2866.72,
          category: "transport",
          accountId: "acc1",
          providerCode: "nubank",
          status: "posted",
          localCategory: "transport",
        },
        {
          id: "4",
          description: "Netflix",
          descriptionRaw: "NETFLIX SUBSCRIPTION",
          amount: -29.9,
          date: "2024-01-14",
          currencyCode: "BRL",
          balance: 2890.22,
          category: "entertainment",
          accountId: "acc1",
          providerCode: "nubank",
          status: "posted",
          localCategory: "flexible",
        },
        {
          id: "5",
          description: "PIX Recebido",
          descriptionRaw: "PIX RECEBIDO JOAO SILVA",
          amount: 250.0,
          date: "2024-01-14",
          currencyCode: "BRL",
          balance: 2920.12,
          category: "transfer",
          accountId: "acc1",
          providerCode: "nubank",
          status: "posted",
          localCategory: "income",
        },
        {
          id: "6",
          description: "Farmácia Drogasil",
          descriptionRaw: "FARMACIA DROGASIL",
          amount: -45.6,
          date: "2024-01-13",
          currencyCode: "BRL",
          balance: 2670.12,
          category: "health",
          accountId: "acc1",
          providerCode: "nubank",
          status: "posted",
          localCategory: "health",
        },
        {
          id: "7",
          description: "Posto Shell",
          descriptionRaw: "POSTO SHELL",
          amount: -89.5,
          date: "2024-01-13",
          currencyCode: "BRL",
          balance: 2715.72,
          category: "transport",
          accountId: "acc1",
          providerCode: "nubank",
          status: "posted",
          localCategory: "transport",
        },
        {
          id: "8",
          description: "Restaurante Outback",
          descriptionRaw: "OUTBACK STEAKHOUSE",
          amount: -125.8,
          date: "2024-01-12",
          currencyCode: "BRL",
          balance: 2805.22,
          category: "food",
          accountId: "acc1",
          providerCode: "nubank",
          status: "posted",
          localCategory: "food",
        },
      ]

      setTransactions(mockTransactions)

      // Agrupar transações por dia
      const grouped = groupTransactionsByDay(mockTransactions)
      setDailyBalances(grouped)

      // Expandir os primeiros 3 dias por padrão
      const firstThreeDays = grouped.slice(0, 3).map((day) => day.date)
      setExpandedDays(new Set(firstThreeDays))

      setLoading(false)
    } catch (error) {
      console.error("Erro ao carregar transações:", error)
      setLoading(false)
    }
  }

  const groupTransactionsByDay = (transactions: CategorizedTransaction[]): DailyBalance[] => {
    const grouped = transactions.reduce(
      (acc, transaction) => {
        const date = transaction.date
        if (!acc[date]) {
          acc[date] = {
            date,
            income: 0,
            expenses: 0,
            balance: 0,
            transactions: [],
          }
        }

        acc[date].transactions.push(transaction)
        if (transaction.amount > 0) {
          acc[date].income += transaction.amount
        } else {
          acc[date].expenses += Math.abs(transaction.amount)
        }
        acc[date].balance = acc[date].income - acc[date].expenses

        return acc
      },
      {} as Record<string, DailyBalance>,
    )

    return Object.values(grouped).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const filteredDailyBalances = dailyBalances.filter((day) => {
    if (searchTerm) {
      const hasMatchingTransaction = day.transactions.some((t) =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      if (!hasMatchingTransaction) return false
    }

    if (filterCategory !== "all") {
      const hasMatchingCategory = day.transactions.some((t) => t.localCategory === filterCategory)
      if (!hasMatchingCategory) return false
    }

    if (filterType !== "all") {
      const hasMatchingType = day.transactions.some((t) => {
        if (filterType === "income") return t.amount > 0
        if (filterType === "expense") return t.amount < 0
        return true
      })
      if (!hasMatchingType) return false
    }

    return true
  })

  const paginatedDays = filteredDailyBalances.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredDailyBalances.length / itemsPerPage)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: ptBR })
  }

  const getCategoryName = (categoryId: string) => {
    const category = DEFAULT_CATEGORIES.find((cat) => cat.id === categoryId)
    return category?.name || "Outros"
  }

  const getCategoryColor = (categoryId: string) => {
    const category = DEFAULT_CATEGORIES.find((cat) => cat.id === categoryId)
    return category?.color || "#6b7280"
  }

  const toggleDayExpansion = (date: string) => {
    const newExpanded = new Set(expandedDays)
    if (newExpanded.has(date)) {
      newExpanded.delete(date)
    } else {
      newExpanded.add(date)
    }
    setExpandedDays(newExpanded)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-48"></div>
              <div className="h-4 bg-muted rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-4 bg-muted rounded w-40"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {DEFAULT_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Gastos</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("justify-start text-left font-normal")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange(range || {})}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Lista de transações por dia */}
      <div className="space-y-4">
        {paginatedDays.map((day) => (
          <Card key={day.date}>
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleDayExpansion(day.date)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{formatDate(day.date)}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                      Entradas: {formatCurrency(day.income)}
                    </span>
                    <span className="flex items-center">
                      <TrendingDown className="h-4 w-4 mr-1 text-red-600" />
                      Saídas: {formatCurrency(day.expenses)}
                    </span>
                    <span className={`font-medium ${day.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                      Saldo: {formatCurrency(day.balance)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{day.transactions.length} transações</Badge>
                  {expandedDays.has(day.date) ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </div>
            </CardHeader>

            {expandedDays.has(day.date) && (
              <CardContent>
                <Separator className="mb-4" />
                <div className="space-y-3">
                  {day.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: `${getCategoryColor(transaction.localCategory)}20`,
                            color: getCategoryColor(transaction.localCategory),
                          }}
                        >
                          {getCategoryName(transaction.localCategory)}
                        </Badge>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.providerCode}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {transaction.amount >= 0 ? "+" : ""}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">Saldo: {formatCurrency(transaction.balance)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      {filteredDailyBalances.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma transação encontrada para os filtros selecionados</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
