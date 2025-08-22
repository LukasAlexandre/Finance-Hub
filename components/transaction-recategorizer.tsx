"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { DEFAULT_CATEGORIES } from "@/lib/categories"
import type { CategorizedTransaction } from "@/lib/types"

export function TransactionRecategorizer() {
  const [transactions, setTransactions] = useState<CategorizedTransaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<CategorizedTransaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de transações
    setTimeout(() => {
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
          description: "Posto Shell",
          descriptionRaw: "POSTO SHELL",
          amount: -89.5,
          date: "2024-01-14",
          currencyCode: "BRL",
          balance: 2933.72,
          category: "transport",
          accountId: "acc1",
          providerCode: "nubank",
          status: "posted",
          localCategory: "transport",
        },
        {
          id: "3",
          description: "Compra Online",
          descriptionRaw: "COMPRA ONLINE LOJA XYZ",
          amount: -299.99,
          date: "2024-01-13",
          currencyCode: "BRL",
          balance: 3233.71,
          category: "shopping",
          accountId: "acc1",
          providerCode: "nubank",
          status: "posted",
          localCategory: "flexible", // Categorizada incorretamente
        },
      ]
      setTransactions(mockTransactions)
      setFilteredTransactions(mockTransactions)
      setLoading(false)
    }, 800)
  }, [])

  useEffect(() => {
    let filtered = transactions

    if (searchTerm) {
      filtered = filtered.filter((t) => t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((t) => t.localCategory === filterCategory)
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchTerm, filterCategory])

  const handleRecategorize = (transactionId: string, newCategory: string) => {
    const updatedTransactions = transactions.map((t) =>
      t.id === transactionId ? { ...t, localCategory: newCategory } : t,
    )
    setTransactions(updatedTransactions)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Math.abs(value))
  }

  const getCategoryName = (categoryId: string) => {
    const category = DEFAULT_CATEGORIES.find((cat) => cat.id === categoryId)
    return category?.name || "Outros"
  }

  const getCategoryColor = (categoryId: string) => {
    const category = DEFAULT_CATEGORIES.find((cat) => cat.id === categoryId)
    return category?.color || "#6b7280"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recategorizar Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="h-6 w-20 bg-muted rounded"></div>
                  <div>
                    <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </div>
                </div>
                <div className="h-8 w-32 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-serif">Recategorizar Transações</h2>
        <p className="text-muted-foreground">Ajuste a categorização das suas transações manualmente</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
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
            <div className="w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
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
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transações ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
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
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString("pt-BR")} •{" "}
                      <span className={transaction.amount >= 0 ? "text-green-600" : "text-red-600"}>
                        {transaction.amount >= 0 ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="w-48">
                  <Select
                    value={transaction.localCategory}
                    onValueChange={(value) => handleRecategorize(transaction.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEFAULT_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma transação encontrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
