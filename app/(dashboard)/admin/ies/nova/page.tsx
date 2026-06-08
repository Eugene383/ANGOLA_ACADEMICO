'use client'

import { useActionState } from 'react'
import { criarIESAction } from '@/lib/actions/admin.actions'
import { useProvincias } from '@/hooks'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NovaIESPage() {
  const [state, action, pending] = useActionState(criarIESAction, {})
  const { provincias } = useProvincias()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/ies" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Nova instituição</h1>
          <p className="text-sm text-gray-500">Registar nova IES na plataforma</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form action={action} className="space-y-5">
          {state.error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
              {state.error}
            </div>
          )}
          {state.success && (
            <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg border border-green-200">
              Instituição criada com sucesso!
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
              <input name="nome" type="text" required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Universidade Agostinho Neto" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sigla</label>
              <input name="sigla" type="text" required maxLength={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="UAN" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ano de fundação</label>
              <input name="ano_fundacao" type="number" min="1900" max="2024"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1962" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select name="tipo" required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar…</option>
                <option value="universidade">Universidade</option>
                <option value="instituto_superior">Instituto Superior</option>
                <option value="escola_superior">Escola Superior</option>
                <option value="academia">Academia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Natureza</label>
              <select name="natureza" required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar…</option>
                <option value="publica">Pública</option>
                <option value="privada">Privada</option>
                <option value="publica_privada">Mista</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Província</label>
              <select name="provincia_id" required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar…</option>
                {provincias.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input name="website" type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.ies.ao" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email institucional</label>
              <input name="email" type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="info@ies.ao" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60
                         text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              {pending ? 'A guardar…' : 'Criar instituição'}
            </button>
            <Link href="/admin/ies"
              className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-800 border
                         border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}