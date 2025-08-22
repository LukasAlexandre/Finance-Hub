import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CategoryManager } from "@/components/category-manager"
import { KeywordManager } from "@/components/keyword-manager"
import { TransactionRecategorizer } from "@/components/transaction-recategorizer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CategoriesPage() {
  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-6">
            <Tabs defaultValue="categories" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="categories">Categorias</TabsTrigger>
                <TabsTrigger value="keywords">Palavras-chave</TabsTrigger>
                <TabsTrigger value="recategorize">Recategorizar</TabsTrigger>
              </TabsList>

              <TabsContent value="categories">
                <CategoryManager />
              </TabsContent>

              <TabsContent value="keywords">
                <KeywordManager />
              </TabsContent>

              <TabsContent value="recategorize">
                <TransactionRecategorizer />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
