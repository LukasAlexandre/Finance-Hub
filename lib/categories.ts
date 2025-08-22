import type { TransactionCategory } from "./types"

// Categorias predefinidas para classificação automática
export const DEFAULT_CATEGORIES: TransactionCategory[] = [
  {
    id: "food",
    name: "Alimentação",
    color: "#ef4444",
    type: "expense",
    subcategories: ["Restaurantes", "Supermercado", "Delivery", "Lanchonetes"],
  },
  {
    id: "transport",
    name: "Transporte",
    color: "#3b82f6",
    type: "expense",
    subcategories: ["Combustível", "Uber/Taxi", "Transporte Público", "Estacionamento"],
  },
  {
    id: "bills",
    name: "Contas Fixas",
    color: "#8b5cf6",
    type: "expense",
    subcategories: ["Energia", "Água", "Internet", "Telefone", "Aluguel", "Condomínio"],
  },
  {
    id: "credit-card",
    name: "Cartão de Crédito",
    color: "#f59e0b",
    type: "expense",
    subcategories: ["Fatura", "Anuidade", "Juros"],
  },
  {
    id: "flexible",
    name: "Contas Flexíveis",
    color: "#10b981",
    type: "expense",
    subcategories: ["Streaming", "Academia", "Assinaturas", "Cursos"],
  },
  {
    id: "unnecessary",
    name: "Gastos Desnecessários",
    color: "#ef4444",
    type: "expense",
    subcategories: ["Impulso", "Entretenimento", "Compras Supérfulas"],
  },
  {
    id: "health",
    name: "Saúde",
    color: "#06b6d4",
    type: "expense",
    subcategories: ["Médico", "Farmácia", "Plano de Saúde", "Exames"],
  },
  {
    id: "income",
    name: "Receitas",
    color: "#22c55e",
    type: "income",
    subcategories: ["Salário", "Freelance", "Vendas", "Outros"],
  },
  {
    id: "investments",
    name: "Investimentos",
    color: "#6366f1",
    type: "investment",
    subcategories: ["Ações", "Fundos", "Renda Fixa", "Criptomoedas"],
  },
]

// Palavras-chave para classificação automática
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  food: [
    "restaurante",
    "lanchonete",
    "pizzaria",
    "hamburgueria",
    "ifood",
    "uber eats",
    "rappi",
    "supermercado",
    "padaria",
    "açougue",
    "hortifruti",
    "mercado",
    "extra",
    "carrefour",
    "pao de acucar",
    "big",
    "walmart",
  ],
  transport: [
    "uber",
    "taxi",
    "99",
    "combustivel",
    "posto",
    "shell",
    "petrobras",
    "ipiranga",
    "ale",
    "metro",
    "onibus",
    "estacionamento",
    "zona azul",
  ],
  bills: [
    "energia",
    "luz",
    "cemig",
    "copel",
    "celpe",
    "agua",
    "saneamento",
    "internet",
    "vivo",
    "tim",
    "claro",
    "oi",
    "net",
    "aluguel",
    "condominio",
  ],
  "credit-card": ["fatura", "cartao", "anuidade", "juros", "financiamento"],
  flexible: [
    "netflix",
    "spotify",
    "amazon prime",
    "disney",
    "globoplay",
    "academia",
    "smartfit",
    "bioritmo",
    "assinatura",
    "curso",
  ],
  health: [
    "farmacia",
    "drogaria",
    "medico",
    "clinica",
    "hospital",
    "laboratorio",
    "plano de saude",
    "unimed",
    "bradesco saude",
    "amil",
  ],
  income: ["salario", "pix recebido", "transferencia recebida", "deposito"],
  investments: ["investimento", "aplicacao", "resgate", "dividendo", "juros"],
}

export function categorizeTransaction(description: string, amount: number): string {
  const desc = description.toLowerCase()

  // Se é uma entrada de dinheiro, provavelmente é receita
  if (amount > 0) {
    for (const keyword of CATEGORY_KEYWORDS.income) {
      if (desc.includes(keyword)) {
        return "income"
      }
    }
    return "income" // Default para valores positivos
  }

  // Para gastos, verifica as palavras-chave
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === "income") continue // Já verificado acima

    for (const keyword of keywords) {
      if (desc.includes(keyword)) {
        return category
      }
    }
  }

  // Default para gastos não categorizados
  return "flexible"
}
