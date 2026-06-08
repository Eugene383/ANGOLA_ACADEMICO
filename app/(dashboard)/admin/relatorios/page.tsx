// src/app/(dashboard)/admin/relatorios/page.tsx
import { BarChart3 } from 'lucide-react'

export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-500 mt-0.5">Relatórios e exportações de dados académicos</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-base font-semibold text-gray-800 mb-2">Módulo em desenvolvimento</h2>
        <p className="text-sm text-gray-400 max-w-sm mx-auto">
          Relatórios e exportações CSV/PDF estarão disponíveis em breve.
        </p>
      </div>
    </div>
  )
}
