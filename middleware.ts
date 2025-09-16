import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

// Rotas públicas API
const PUBLIC_API = [
  '/api/auth/register',
  '/api/auth/login',
  '/api/quote'
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Permitir arquivos estáticos e _next
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/assets')) {
    return NextResponse.next()
  }

  // API pública
  if (PUBLIC_API.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Páginas de auth sempre acessíveis (se já logado podemos redirecionar depois se quiser)
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    const token = req.cookies.get('financehub_token')?.value
    if (token && verifyToken(token)) {
      // usuário já autenticado pode continuar (ou redirecionar para dashboard)
      return NextResponse.next()
    }
    return NextResponse.next()
  }

  // Qualquer rota /api ou página protegida requer token
  if (pathname.startsWith('/api') || pathname.startsWith('/transactions') || pathname.startsWith('/investments') || pathname.startsWith('/categories')) {
    const token = req.cookies.get('financehub_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }
    // Seguir
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/transactions/:path*', '/investments/:path*', '/categories/:path*', '/login', '/register']
}
