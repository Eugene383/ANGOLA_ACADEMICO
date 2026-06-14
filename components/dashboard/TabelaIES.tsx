'use client'

import { useIES } from '@/hooks'
import { useProvincias } from '@/hooks'
import { useState } from 'react'
import { Building2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { clsx } from 'clsx'

const badgeNatureza = {
  publica:         'bg-blue-50 text-blue-700',
  privada:         'bg-amber-50 text-amber-700',
  publica_privada: 'bg-purple-50 text-purple-700',
}

const labelNatureza = {
  publica:         'Pública',
  privada:         'Privada',
  publica_privada: 'Mista',
}

export default function TabelaIES() {
  const [provinciaId, setProvinciaId] = useState<string>('')
  const [natureza, setNatureza]       = useState<string>('')
  const { ies, loading } = useIES({
    provincia_id: provinciaId || undefined,
    natureza: (natureza as any) || undefined,
  })
  const { provincias } = useProvincias()

  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200">
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <h2 className="text-sm font-semibold text-gray-800">Instituições</h2>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {ies.length}
          </span>
        </div>
        <Link
          href="/admin/ies"
          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
        >
          Ver todas <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Filtros */}
      <div className="px-4 sm:px-5 py-3 border-b border-gray-100 flex flex-col sm:flex-row gap-2">
        <select
          value={provinciaId}
          onChange={e => setProvinciaId(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600
             focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1"
        >
          <option value="">Todas as províncias</option>
          {provincias.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
        <select
          value={natureza}
          onChange={e => setNatureza(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600
                     focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1"
        >
          <option value="">Todas as naturezas</option>
          <option value="publica">Pública</option>
          <option value="privada">Privada</option>
          <option value="publica_privada">Mista</option>
        </select>
      </div>

      {/* Lista */}
      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="px-4 sm:px-5 py-6 sm:py-8 text-center text-sm text-gray-400">A carregar...</div>
        ) : ies.length === 0 ? (
          <div className="px-4 sm:px-5 py-6 sm:py-8 text-center text-sm text-gray-400">
            Nenhuma instituição encontrada
          </div>
        ) : (
          ies.slice(0, 8).map(i => (
            <div key={i.id} className="px-4 sm:px-5 py-3 flex items-center justify-between hover:bg-gray-50 gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{i.nome}</p>
                <p className="text-xs text-gray-400 truncate">{i.sigla} · {i.provincia.nome}</p>
              </div>
              <span className={clsx(
                'text-xs font-medium px-2 py-0.5 rounded-full ml-2 flex-shrink-0 whitespace-nowrap',
                badgeNatureza[i.natureza]
              )}>
                {labelNatureza[i.natureza]}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}