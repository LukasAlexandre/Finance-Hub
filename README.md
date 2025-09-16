💰 Finance Hub

Finance Hub é uma plataforma de organização financeira moderna que conecta suas contas bancárias via Open Finance e Pluggy, categorizando transações de forma automática.
Com dashboards interativos, gráficos dinâmicos e relatórios inteligentes, você transforma dados em insights práticos para uma gestão eficiente do dinheiro.

🚀 Funcionalidades

🔗 Integração com Open Finance e Pluggy – importação automática de transações bancárias.

📊 Dashboards interativos – visão clara das entradas, saídas e investimentos.

🗂️ Categorização automática de despesas e receitas (fixas, variáveis, cartão, etc.).

📅 Relatórios diários, semanais e mensais.

🎨 Design moderno e minimalista – interface fluida e de alta performance.

📱 Responsividade total – uso otimizado em desktop e mobile.

🖥️ Tecnologias Utilizadas

Frontend: React + Next.js + TailwindCSS

Componentes UI: Radix UI, shadcn/ui

Autenticação & APIs: Pluggy, Open Finance

Backend: Node.js + Express (quando aplicável)

Deploy: Vercel

🌓 Tema (Light / Dark)

O projeto agora suporta alternância de tema usando a biblioteca `next-themes`:

- Provider configurado em `app/layout.tsx` envolvendo a aplicação.
- Variáveis CSS para ambos os temas definidas em `app/globals.css` (blocos `:root` e `.dark`).
- Botão de alternância (`ThemeToggle`) inserido no header (`components/dashboard-header.tsx`).

Como funciona:
1. O `ThemeProvider` aplica a classe `dark` no `<html>` quando o usuário seleciona o modo escuro.
2. As variáveis CSS mudam automaticamente e Tailwind usa essas cores via tokens (`bg-background`, `text-foreground`, etc.).
3. A preferência é persistida em `localStorage` e respeita o sistema (`prefers-color-scheme`) se o usuário não escolher manualmente.

Adicionar o toggle em outro lugar:
```tsx
import { ThemeToggle } from "@/components/theme-toggle"
// ... dentro do JSX
<ThemeToggle />
```

Forçar tema inicial:
Altere `defaultTheme` em `app/layout.tsx` para `"dark"`, `"light"` ou mantenha `"system"`.

