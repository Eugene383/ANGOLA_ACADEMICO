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
  
  const { ies, loading } = useIES({
    provincia_id: provinciaId || undefined,
    natureza: (natureza as any) || undefined,
  })
  const { provincias } = useProvincias()

  // Filtrar por busca
  const iesFiltradas = ies.filter(i =>
    i.nome.toLowerCase().includes(busca.toLowerCase()) ||
    i.sigla.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Instituições de Ensino Superior</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestão de todas as IES registadas na plataforma
          </p>
        </div>
        <Link
          href="/admin/ies/nova"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg
                     font-medium text-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Instituição
        </Link>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Província</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Natureza</label>
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
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="inline-block animate-spin">⟳</div> Carregando…
          </div>
        ) : iesFiltradas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma instituição encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700">Nome</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700">Tipo</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700">Natureza</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700">Província</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700">Fundação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {iesFiltradas.map((ies) => (
                  <tr key={ies.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{ies.nome}</p>
                        <p className="text-xs text-gray-500">{ies.sigla}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {labelTipo[ies.tipo as keyof typeof labelTipo]}
                    </td>
                    <td className="px-5 py-4">
                      <span className={clsx(
                        'inline-block px-2 py-1 rounded text-xs font-medium',
                        badgeNatureza[ies.natureza as keyof typeof badgeNatureza]
                      )}>
                        {labelNatureza[ies.natureza as keyof typeof labelNatureza]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {ies.provincia?.nome ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {ies.ano_fundacao ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Rodapé com contagem */}
        {!loading && iesFiltradas.length > 0 && (
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
            {iesFiltradas.length} de {ies.length} instituições
          </div>
        )}
      </div>
    </div>
  )
}
