// Configuração da API do Pluggy
const PLUGGY_BASE_URL = "https://api.pluggy.ai"

interface PluggyConfig {
  clientId: string
  clientSecret: string
  itemId: string
}

type PluggyItem = {}

type PluggyAccount = {}

type PluggyTransaction = {}

class PluggyAPI {
  private config: PluggyConfig
  private accessToken: string | null = null
  private tokenExpiry: number | null = null

  constructor(config: PluggyConfig) {
    this.config = config
  }

  private async getAccessToken(): Promise<string> {
    // Verifica se o token ainda é válido
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      console.log("[v0] Tentando autenticação com Pluggy API...")

      // Primeiro, vamos tentar o formato original
      let response = await fetch(`${PLUGGY_BASE_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        }),
      })

      // Se não funcionar, vamos tentar outros formatos comuns
      if (!response.ok) {
        console.log("[v0] Primeiro formato falhou, tentando formato alternativo...")
        response = await fetch(`${PLUGGY_BASE_URL}/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CLIENT_ID: this.config.clientId,
            CLIENT_SECRET: this.config.clientSecret,
          }),
        })
      }

      // Se ainda não funcionar, vamos tentar com Basic Auth
      if (!response.ok) {
        console.log("[v0] Segundo formato falhou, tentando Basic Auth...")
        const credentials = btoa(`${this.config.clientId}:${this.config.clientSecret}`)
        response = await fetch(`${PLUGGY_BASE_URL}/auth`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
        })
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Erro na autenticação:", response.status, errorText)
        throw new Error(`Erro na autenticação: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("[v0] Autenticação bem-sucedida:", data)

      this.accessToken = data.accessToken || data.access_token || data.apiKey
      // Token expira em 2 horas conforme documentação
      this.tokenExpiry = Date.now() + (data.expiresIn || data.expires_in || 7200) * 1000

      if (!this.accessToken) {
        throw new Error("Token de acesso não encontrado na resposta")
      }

      return this.accessToken
    } catch (error) {
      console.error("[v0] Erro ao obter token de acesso:", error)
      throw error
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const token = await this.getAccessToken()
      console.log("[v0] Fazendo requisição para:", endpoint)
      console.log("[v0] Token sendo usado:", token.substring(0, 50) + "...")

      let response = await fetch(`${PLUGGY_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          "X-API-KEY": token, // Primeiro tenta com X-API-KEY
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      // Se não funcionar com X-API-KEY, tenta com Authorization sem Bearer
      if (!response.ok && response.status === 403) {
        console.log("[v0] Tentando com Authorization sem Bearer...")
        response = await fetch(`${PLUGGY_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            Authorization: token, // Sem "Bearer "
            "Content-Type": "application/json",
            ...options.headers,
          },
        })
      }

      // Se ainda não funcionar, tenta com Bearer
      if (!response.ok && response.status === 403) {
        console.log("[v0] Tentando com Bearer token...")
        response = await fetch(`${PLUGGY_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...options.headers,
          },
        })
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Erro na requisição:", response.status, errorText)
        throw new Error(`Erro na API: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("[v0] Resposta recebida com sucesso")
      return data
    } catch (error) {
      console.error("[v0] Erro na requisição:", error)
      throw error
    }
  }

  async getItem(): Promise<PluggyItem> {
    return this.makeRequest(`/items/${this.config.itemId}`)
  }

  async getAccounts(): Promise<PluggyAccount[]> {
    const response = await this.makeRequest(`/accounts?itemId=${this.config.itemId}`)
    console.log("[v0] Resposta completa das contas:", response)

    // A API retorna {total, totalPages, page, results}, mas precisamos apenas do array results
    if (response && response.results && Array.isArray(response.results)) {
      console.log("[v0] Retornando", response.results.length, "contas")
      return response.results
    }

    console.log("[v0] Nenhuma conta encontrada ou formato inesperado")
    return []
  }

  async getTransactions(accountId?: string, from?: string, to?: string, pageSize = 500): Promise<PluggyTransaction[]> {
    let endpoint = `/transactions?itemId=${this.config.itemId}&pageSize=${pageSize}`

    if (accountId) endpoint += `&accountId=${accountId}`
    if (from) endpoint += `&from=${from}`
    if (to) endpoint += `&to=${to}`

    const response = await this.makeRequest(endpoint)
    console.log("[v0] Resposta completa das transações:", response)

    // A API retorna {total, totalPages, page, results}, mas precisamos apenas do array results
    if (response && response.results && Array.isArray(response.results)) {
      console.log("[v0] Retornando", response.results.length, "transações")
      return response.results
    }

    console.log("[v0] Nenhuma transação encontrada ou formato inesperado")
    return []
  }

  async getInvestments(): Promise<any[]> {
    const response = await this.makeRequest(`/investments?itemId=${this.config.itemId}`)
    console.log("[v0] Resposta completa dos investimentos:", response)

    // A API retorna {total, totalPages, page, results}, mas precisamos apenas do array results
    if (response && response.results && Array.isArray(response.results)) {
      console.log("[v0] Retornando", response.results.length, "investimentos")
      return response.results
    }

    console.log("[v0] Nenhum investimento encontrado ou formato inesperado")
    return []
  }
}

// Instância singleton da API
let pluggyInstance: PluggyAPI | null = null

export function getPluggyAPI(): PluggyAPI {
  if (!pluggyInstance) {
    const config = {
      clientId: process.env.PLUGGY_CLIENT_ID!,
      clientSecret: process.env.PLUGGY_CLIENT_SECRET!,
      itemId: process.env.PLUGGY_ITEM_ID!,
    }

    if (!config.clientId || !config.clientSecret || !config.itemId) {
      throw new Error("Configurações do Pluggy não encontradas nas variáveis de ambiente")
    }

    pluggyInstance = new PluggyAPI(config)
  }

  return pluggyInstance
}
