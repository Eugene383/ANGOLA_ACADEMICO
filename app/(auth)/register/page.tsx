'use client'

import { useActionState } from 'react'
import { registerAction } from '@/lib/actions/auth.actions'
import Link from 'next/link'
import { GraduationCap, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, {})
  const [showPass, setShowPass]    = useState(false)
  const [showPass2, setShowPass2]  = useState(false)

  if (state.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Conta criada!</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Se o Supabase exige confirmação de email, verifica a tua caixa de entrada.<br />
            Caso contrário, já podes entrar.
          </p>
          <Link
            href="/login"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold
                       py-2.5 rounded-xl text-sm transition-colors text-center"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
<<<<<<< HEAD:src/app/(auth)/register/page.tsx
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">  
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
=======
    <div className="min-h-screen flex bg-gray-50">
      {/* Painel esquerdo */}
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
              Junta-te à<br />plataforma nacional
            </h2>
            <p className="text-blue-100 text-base leading-relaxed">
              Cria a tua conta para acederes a funcionalidades avançadas, gerir dados da tua IES e acompanhar indicadores académicos.
            </p>
          </div>
          <p className="text-blue-200 text-sm">© 2026 AngolaAcadémico · MES Angola</p>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
>>>>>>> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(auth)/register/page.tsx
          <Link href="/" className="lg:hidden flex items-center gap-2 justify-center mb-8 hover:opacity-70 transition-opacity">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">AngolaAcadémico</span>
          </Link>

<<<<<<< HEAD:src/app/(auth)/register/page.tsx
          <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Criar conta</h1>
          <p className="text-gray-500 text-sm mb-7 text-center">Preenche os dados para te registares</p>
=======
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Criar conta</h1>
          <p className="text-gray-500 text-sm mb-7">Preenche os dados para te registares</p>
>>>>>>> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(auth)/register/page.tsx

          <form action={action} className="space-y-4">
            {state.error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">
                ❌ {state.error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
              <input
                name="nome"
                type="text"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                placeholder="João da Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                placeholder="o.teu@email.ao"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Mínimo 6 caracteres"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar password</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showPass2 ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Repetir password"
                />
                <button type="button" onClick={() => setShowPass2(!showPass2)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  A criar conta...
                </>
              ) : 'Criar conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Já tens conta?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
