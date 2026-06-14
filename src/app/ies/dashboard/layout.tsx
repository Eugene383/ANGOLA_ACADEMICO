import Link from 'next/link'
import { signOutAction } from '@/lib/actions/auth.actions'

export default function IesDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Painel de Gestor IES</p>
            <h1 className="text-2xl font-semibold text-slate-900">Aceda às suas instituições e cursos</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex flex-wrap items-center gap-2">
              <Link
                href="/ies/dashboard"
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >Resumo</Link>
              <Link
                href="/ies/dashboard/ies"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >Minhas IES</Link>
              <Link
                href="/ies/dashboard/cursos"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >Cursos</Link>
            </nav>
            <form action={signOutAction} className="m-0">
              <button
                type="submit"
                className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{children}</main>
    </div>
  )
}
