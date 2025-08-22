"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2 } from "lucide-react"
import { DEFAULT_CATEGORIES } from "@/lib/categories"
import type { TransactionCategory } from "@/lib/types"

export function CategoryManager() {
  const [categories, setCategories] = useState<TransactionCategory[]>(DEFAULT_CATEGORIES)
  const [editingCategory, setEditingCategory] = useState<TransactionCategory | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCategory, setNewCategory] = useState<Partial<TransactionCategory>>({
    name: "",
    color: "#3b82f6",
    type: "expense",
    subcategories: [],
  })

  const handleCreateCategory = () => {
    if (!newCategory.name) return

    const category: TransactionCategory = {
      id: newCategory.name.toLowerCase().replace(/\s+/g, "-"),
      name: newCategory.name,
      color: newCategory.color || "#3b82f6",
      type: newCategory.type || "expense",
      subcategories: newCategory.subcategories || [],
    }

    setCategories([...categories, category])
    setNewCategory({ name: "", color: "#3b82f6", type: "expense", subcategories: [] })
    setIsDialogOpen(false)
  }

  const handleEditCategory = (category: TransactionCategory) => {
    setEditingCategory(category)
    setNewCategory(category)
    setIsDialogOpen(true)
  }

  const handleUpdateCategory = () => {
    if (!editingCategory || !newCategory.name) return

    const updatedCategories = categories.map((cat) =>
      cat.id === editingCategory.id
        ? {
            ...cat,
            name: newCategory.name!,
            color: newCategory.color!,
            type: newCategory.type!,
            subcategories: newCategory.subcategories!,
          }
        : cat,
    )

    setCategories(updatedCategories)
    setEditingCategory(null)
    setNewCategory({ name: "", color: "#3b82f6", type: "expense", subcategories: [] })
    setIsDialogOpen(false)
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId))
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      expense: "Gasto",
      income: "Receita",
      investment: "Investimento",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getTypeColor = (type: string) => {
    const colors = {
      expense: "bg-red-100 text-red-800",
      income: "bg-green-100 text-green-800",
      investment: "bg-blue-100 text-blue-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-serif">Gerenciar Categorias</h2>
          <p className="text-muted-foreground">Configure suas categorias de gastos e receitas</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input
                  id="name"
                  value={newCategory.name || ""}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Ex: Alimentação"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={newCategory.type}
                  onValueChange={(value) => setNewCategory({ ...newCategory, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Gasto</SelectItem>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="investment">Investimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="color">Cor</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="color"
                    type="color"
                    value={newCategory.color || "#3b82f6"}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={newCategory.color || "#3b82f6"}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subcategories">Subcategorias (separadas por vírgula)</Label>
                <Textarea
                  id="subcategories"
                  value={newCategory.subcategories?.join(", ") || ""}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      subcategories: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Ex: Restaurantes, Supermercado, Delivery"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}>
                {editingCategory ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <Badge variant="secondary" className={getTypeColor(category.type)}>
                  {getTypeLabel(category.type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Subcategorias:</p>
                  <div className="flex flex-wrap gap-1">
                    {category.subcategories.map((sub) => (
                      <Badge key={sub} variant="outline" className="text-xs">
                        {sub}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
