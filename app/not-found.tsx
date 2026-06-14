import Link from 'next/link'
import { GraduationCap, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Página não encontrada</h2>
        <p className="text-gray-500 text-sm mb-8">
          A página que procuras não existe ou foi movida.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
                       px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
          <Link
            href="/explorar"
            className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-100
                       text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Explorar dados
          </Link>
        </div>
      </div>
    </div>
  )
}
