'use client'

import { useState } from 'react'
import { promoverUtilizadorAction, atribuirIESAction } from '@/lib/actions/admin.actions'
import { Users, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

const badgeRole: Record<string, string> = {
  admin:      'bg-red-50 text-red-700',
  gestor_ies: 'bg-blue-50 text-blue-700',
  publico:    'bg-gray-100 text-gray-600',
}

export default function TabelaUtilizadores({ utilizadores, todasIES }: any) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handlePromover(userId: string, role: string) {
    setLoadingId(userId)
    const fd = new FormData()
    fd.append('userId', userId)
    fd.append('role', role)
    await promoverUtilizadorAction({}, fd)
    setLoadingId(null)
  }

  async function handleAtribuirIES(userId: string, iesId: string) {
    if (!iesId) return
    setLoadingId(userId)
    const fd = new FormData()
    fd.append('userId', userId)
    fd.append('iesId', iesId)
    await atribuirIESAction({}, fd)
    setLoadingId(null)
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-200 flex items-center gap-2">
        <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <h2 className="text-sm font-semibold text-gray-800">Utilizadores registados</h2>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex-shrink-0">
          {utilizadores.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-3 sm:px-5 py-3 text-xs font-medium text-gray-500 whitespace-nowrap">Utilizador</th>
              <th className="text-left px-2 sm:px-4 py-3 text-xs font-medium text-gray-500 whitespace-nowrap">Role</th>
              <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-medium text-gray-500 whitespace-nowrap">IES atribuídas</th>
              <th className="text-left px-2 sm:px-4 py-3 text-xs font-medium text-gray-500 whitespace-nowrap">Atribuir IES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {utilizadores.map((u: any) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-5 py-3">
                  <p className="font-medium text-gray-800 truncate">{u.nome ?? '—'}</p>
                  <p className="text-xs text-gray-400">{u.id.slice(0, 8)}…</p>
                </td>
                <td className="px-2 sm:px-4 py-3">
                  <select
                    defaultValue={u.role}
                    disabled={loadingId === u.id}
                    onChange={e => handlePromover(u.id, e.target.value)}
                    className={clsx(
                      'text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer w-full sm:w-auto',
                      badgeRole[u.role],
                      'focus:outline-none focus:ring-1 focus:ring-blue-500'
                    )}
                  >
                    <option value="publico">Público</option>
                    <option value="gestor_ies">Gestor IES</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="hidden sm:table-cell px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {u.ies_usuarios?.map((iu: any) => (
                      <span key={iu.ies?.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {iu.ies?.sigla}
                      </span>
                    ))}
                    {u.ies_usuarios?.length === 0 && (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                </td>
                <td className="px-2 sm:px-4 py-3">
                  <select
                    disabled={loadingId === u.id}
                    onChange={e => handleAtribuirIES(u.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5
                               text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-auto"
                  >
                    <option value="">Seleccionar…</option>
                    {todasIES.map((i: any) => (
                      <option key={i.id} value={i.id}>{i.sigla} — {i.nome}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}