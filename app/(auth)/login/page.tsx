'use client'

import { useActionState } from 'react'
import { loginAction } from '@/lib/actions/auth.actions'
import Link from 'next/link'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, {})
  const [showPass, setShowPass] = useState(false)

  // Ler parâmetro ?error= da URL
  const errorParam = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('error')
    : null

  const errorMessages: Record<string, string> = {
    'sem-permissao': 'Não tens permissão para aceder a essa página.',
    'auth':          'Erro na autenticação. Tenta novamente.',
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Painel esquerdo — decorativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg">AngolaAcadémico</span>
          </Link>

          <div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Plataforma de Dados<br />do Ensino Superior
            </h2>
            <p className="text-blue-100 text-base leading-relaxed mb-8">
              Mapeamento completo de cursos, vagas, inscritos e graduados das 18 províncias de Angola.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: '350+',  l: 'Instituições' },
                { n: '5K+',   l: 'Cursos' },
                { n: '500K+', l: 'Estudantes' },
                { n: '18',    l: 'Províncias' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 rounded-xl px-4 py-3">
                  <p className="text-2xl font-bold text-white">{s.n}</p>
                  <p className="text-blue-200 text-sm">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-blue-200 text-sm">
            © 2026 AngolaAcadémico · MES Angola
          </p>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <Link href="/" className="lg:hidden flex items-center gap-2 justify-center mb-8 hover:opacity-70 transition-opacity">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">AngolaAcadémico</span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Entrar</h1>
          <p className="text-gray-500 text-sm mb-7">
            Acede à tua conta da plataforma
          </p>

          {/* Erro do query param */}
          {errorParam && errorMessages[errorParam] && (
            <div className="bg-amber-50 text-amber-800 text-sm px-4 py-3 rounded-xl border border-amber-200 mb-5">
              ⚠️ {errorMessages[errorParam]}
            </div>
          )}

          <form action={action} className="space-y-4">
            {state.error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">
                ❌ {state.error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           bg-white transition-shadow"
                placeholder="o.teu@email.ao"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             bg-white transition-shadow"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye    className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60
                         text-white font-semibold py-2.5 rounded-xl text-sm transition-colors
                         flex items-center justify-center gap-2 mt-2"
            >
              {pending ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  A entrar...
                </>
              ) : 'Entrar na plataforma'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Não tens conta?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Criar conta
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/explorar" className="text-xs text-gray-400 hover:text-gray-600">
              Explorar dados sem conta →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
