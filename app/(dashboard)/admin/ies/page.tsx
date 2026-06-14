'use client'

import { useIES, useProvincias } from '@/hooks'
import { useState } from 'react'
import { Building2, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { clsx } from 'clsx'

const badgeNatureza = {
  publica:         'bg-blue-50 text-blue-700 border border-blue-200',
  privada:         'bg-amber-50 text-amber-700 border border-amber-200',
  publica_privada: 'bg-purple-50 text-purple-700 border border-purple-200',
}

const labelNatureza = {
  publica:         'Pública',
  privada:         'Privada',
  publica_privada: 'Mista',
}

const labelTipo = {
  universidade:      'Universidade',
  instituto_superior: 'Instituto Superior',
  escola_superior:   'Escola Superior',
  academia:          'Academia',
}

export default function IESPage() {
  const [provinciaId, setProvinciaId] = useState<string>('')
  const [natureza, setNatureza]       = useState<string>('')
  const [busca, setBusca]             = useState<string>('')
  const { ies, loading, refetch } = useIES({
    provincia_id: provinciaId || undefined,
    natureza: (natureza as any) || undefined,
  })
  const { provincias } = useProvincias()

  // Filtrar por busca
  const iesFiltradas = ies.filter(i =>
    i.nome.toLowerCase().includes(busca.toLowerCase()) ||
    i.sigla.toLowerCase().includes(busca.toLowerCase())
  )

  async function handleDelete(id: string) {
    const ok = confirm('Tem a certeza que pretende eliminar esta instituição?')
    if (!ok) return
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { error } = await supabase.from('ies').delete().eq('id', id)
    if (error) {
      alert('Erro ao eliminar: ' + error.message)
    } else {
      refetch()
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Instituições de Ensino Superior</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5"> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/page.tsx
            Gestão de todas as IES registadas na plataforma
          </p>
        </div>
        <Link
          href="/admin/ies/nova"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg
                     font-medium text-xs sm:text-sm hover:bg-blue-700 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova Instituição</span>
          <span className="sm:hidden">Novo</span> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/page.tsx
        </Link>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Buscar</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" /> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/page.tsx
            <input
              type="text"
              placeholder="Nome ou sigla…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Província</label> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/page.tsx
            <select
              value={provinciaId}
              onChange={(e) => setProvinciaId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              {provincias.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Natureza</label> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/page.tsx
            <select
              value={natureza}
              onChange={(e) => setNatureza(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              <option value="publica">Pública</option>
              <option value="privada">Privada</option>
              <option value="publica_privada">Mista</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 sm:p-8 text-center text-gray-500">
            <div className="inline-block animate-spin">⟳</div> Carregando…
          </div>
        ) : iesFiltradas.length === 0 ? (
          <div className="p-6 sm:p-8 text-center text-gray-500">
            <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm sm:text-base">Nenhuma instituição encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Nome</th>
                  <th className="hidden sm:table-cell px-5 py-3 text-left text-xs font-semibold text-gray-700">Tipo</th>
                  <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Natureza</th>
                  <th className="hidden md:table-cell px-5 py-3 text-left text-xs font-semibold text-gray-700">Província</th>
                  <th className="hidden lg:table-cell px-5 py-3 text-left text-xs font-semibold text-gray-700">Fundação</th>
                  <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Ações</th> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/page.tsx
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {iesFiltradas.map((ies) => (
                  <tr key={ies.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-5 py-3 min-w-0">
                      <div>
                        <p className="font-medium text-gray-900 truncate text-sm">{ies.nome}</p>
                        <p className="text-xs text-gray-500 truncate">{ies.sigla}</p>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {labelTipo[ies.tipo as keyof typeof labelTipo]}
                    </td>
                    <td className="px-3 sm:px-5 py-3">
                      <span className={clsx(
                        'inline-block px-2 py-1 rounded text-xs font-medium whitespace-nowrap', 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/page.tsx
                        badgeNatureza[ies.natureza as keyof typeof badgeNatureza]
                      )}>
                        {labelNatureza[ies.natureza as keyof typeof labelNatureza]}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-5 py-4 text-sm text-gray-600">
                      {ies.provincia?.nome ?? '—'}
                    </td>
                    <td className="hidden lg:table-cell px-5 py-4 text-sm text-gray-600">
                      {ies.ano_fundacao ?? '—'}
                    </td>
                    <td className="px-3 sm:px-5 py-3 text-sm">
                      <div className="flex gap-1">
                        <Link href={`/admin/ies/nova?id=${ies.id}`} className="px-2 sm:px-3 py-1 bg-yellow-50 text-yellow-800 rounded-md border text-xs hover:bg-yellow-100">Editar</Link>
                        <button onClick={() => handleDelete(ies.id)} className="px-2 sm:px-3 py-1 bg-red-50 text-red-700 rounded-md border text-xs hover:bg-red-100">Eliminar</button>
                      </div>
                    </td> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/page.tsx
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Rodapé com contagem */}
        {!loading && iesFiltradas.length > 0 && (
          <div className="px-3 sm:px-5 py-2 sm:py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600"> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/page.tsx
            {iesFiltradas.length} de {ies.length} instituições
          </div>
        )}
      </div>
    </div>
  )
}
