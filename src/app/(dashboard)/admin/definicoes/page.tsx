// src/app/(dashboard)/admin/definicoes/page.tsx
import { Settings } from 'lucide-react'

export default function DefinicoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Definições</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configurações gerais da plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Anos lectivos */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Anos lectivos</h3>
          <p className="text-xs text-gray-500 mb-4">Gerir anos lectivos activos na plataforma</p>
          <div className="space-y-2">
            {['2023/2024', '2022/2023', '2021/2022'].map((ano, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{ano}</span>
                {i === 0 && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    Activo
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info plataforma */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Plataforma</h3>
          <p className="text-xs text-gray-500 mb-4">Informações gerais do sistema</p>
          <div className="space-y-3">
            {[
              { label: 'Versão',       value: '1.0.0' },
              { label: 'Ambiente',     value: 'Desenvolvimento' },
              { label: 'Base de dados', value: 'Supabase (PostgreSQL)' },
              { label: 'Framework',    value: 'Next.js 15' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{item.label}</span>
                <span className="text-xs font-medium text-gray-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
