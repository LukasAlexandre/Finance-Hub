"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import { CATEGORY_KEYWORDS, DEFAULT_CATEGORIES } from "@/lib/categories"

export function KeywordManager() {
  const [keywords, setKeywords] = useState(CATEGORY_KEYWORDS)
  const [newKeyword, setNewKeyword] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const handleAddKeyword = () => {
    if (!newKeyword.trim() || !selectedCategory) return

    setKeywords({
      ...keywords,
      [selectedCategory]: [...(keywords[selectedCategory] || []), newKeyword.trim().toLowerCase()],
    })
    setNewKeyword("")
  }

  const handleRemoveKeyword = (category: string, keyword: string) => {
    setKeywords({
      ...keywords,
      [category]: keywords[category].filter((k) => k !== keyword),
    })
  }

  const getCategoryName = (categoryId: string) => {
    const category = DEFAULT_CATEGORIES.find((cat) => cat.id === categoryId)
    return category?.name || categoryId
  }

  const getCategoryColor = (categoryId: string) => {
    const category = DEFAULT_CATEGORIES.find((cat) => cat.id === categoryId)
    return category?.color || "#3b82f6"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-serif">Palavras-chave para Categorização</h2>
        <p className="text-muted-foreground">Configure palavras-chave para categorização automática de transações</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Palavra-chave</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="keyword">Palavra-chave</Label>
              <Input
                id="keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Ex: supermercado, uber, netflix"
                onKeyPress={(e) => e.key === "Enter" && handleAddKeyword()}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="category">Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
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
            <div className="flex items-end">
              <Button onClick={handleAddKeyword}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(keywords).map(([categoryId, categoryKeywords]) => (
          <Card key={categoryId}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getCategoryColor(categoryId) }} />
                <CardTitle className="text-lg">{getCategoryName(categoryId)}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categoryKeywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="flex items-center space-x-1">
                    <span>{keyword}</span>
                    <button
                      onClick={() => handleRemoveKeyword(categoryId, keyword)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {categoryKeywords.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhuma palavra-chave configurada</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
