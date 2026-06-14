'use client'

import { useActionState } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { criarIESAction } from '@/lib/actions/admin.actions'
import { createClient } from '@/lib/supabase/client' 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/nova/page.tsx
import { useProvincias } from '@/hooks'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NovaIESPage() {
  const [state, action, pending] = useActionState(criarIESAction, {})
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    sigla: '',
    ano_fundacao: '',
    tipo: '',
    natureza: '',
    provincia_id: '',
    website: '',
    email: '',
  })
  const [loadingIes, setLoadingIes] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const { provincias } = useProvincias()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id') ?? ''
  const editMode = Boolean(editId)

  useEffect(() => {
    if (!editId) {
      setFormData({
        id: '',
        nome: '',
        sigla: '',
        ano_fundacao: '',
        tipo: '',
        natureza: '',
        provincia_id: '',
        website: '',
        email: '',
      })
      setLoadError(null)
      setLoadingIes(false)
      return
    }

    setLoadingIes(true)
    setLoadError(null)
    const supabase = createClient()

    supabase
      .from('ies')
      .select('id,nome,sigla,ano_fundacao,tipo,natureza,provincia_id,website,email')
      .eq('id', editId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setLoadError('Não foi possível carregar os dados da instituição.')
          setLoadingIes(false)
          return
        }

        setFormData({
          id: data.id,
          nome: data.nome ?? '',
          sigla: data.sigla ?? '',
          ano_fundacao: data.ano_fundacao?.toString() ?? '',
          tipo: data.tipo ?? '',
          natureza: data.natureza ?? '',
          provincia_id: data.provincia_id ?? '',
          website: data.website ?? '',
          email: data.email ?? '',
        })
        setLoadingIes(false)
      })
  }, [editId])

  return (
    <div className="max-w-2xl space-y-6 px-3 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Link href="/admin/ies" className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Nova instituição</h1> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/nova/page.tsx
          <p className="text-sm text-gray-500">Registar nova IES na plataforma</p>
        </div>
      </div>

      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
        <form action={action} className="space-y-5">
          {state.error && (
            <div className="bg-red-50 text-red-700 text-sm px-3 sm:px-4 py-3 rounded-lg border border-red-200"> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/nova/page.tsx
              {state.error}
            </div>
          )}
          {state.success && (
            <div className="bg-green-50 text-green-700 text-sm px-3 sm:px-4 py-3 rounded-lg border border-green-200"> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/nova/page.tsx
              Instituição criada com sucesso!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="hidden" name="id" value={formData.id || editId} />

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
              <input
                name="nome"
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Universidade Agostinho Neto"
              /> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/nova/page.tsx
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sigla</label>
              <input
                name="sigla"
                type="text"
                required
                maxLength={10}
                value={formData.sigla}
                onChange={(e) => setFormData((prev) => ({ ...prev, sigla: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="UAN"
              /> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/nova/page.tsx
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ano de fundação</label>
              <input
                name="ano_fundacao"
                type="number"
                min="1900"
                max="2024"
                value={formData.ano_fundacao}
                onChange={(e) => setFormData((prev) => ({ ...prev, ano_fundacao: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1962"
              /> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/nova/page.tsx
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                name="tipo"
                required
                value={formData.tipo}
                onChange={(e) => setFormData((prev) => ({ ...prev, tipo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              > 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/nova/page.tsx
                <option value="">Seleccionar…</option>
                <option value="universidade">Universidade</option>
                <option value="instituto_superior">Instituto Superior</option>
                <option value="escola_superior">Escola Superior</option>
                <option value="academia">Academia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Natureza</label>
              <select
                name="natureza"
                required
                value={formData.natureza}
                onChange={(e) => setFormData((prev) => ({ ...prev, natureza: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              > 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/nova/page.tsx
                <option value="">Seleccionar…</option>
                <option value="publica">Pública</option>
                <option value="privada">Privada</option>
                <option value="publica_privada">Mista</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Província</label>
              <select
                name="provincia_id"
                required
                value={formData.provincia_id}
                onChange={(e) => setFormData((prev) => ({ ...prev, provincia_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar…</option>
                {provincias.map((p) => ( 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/nova/page.tsx
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                name="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.ies.ao"
              /> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/nova/page.tsx
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email institucional</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="info@ies.ao"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2"> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/nova/page.tsx
            <button
              type="submit"
              disabled={pending}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60
                         text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors w-full sm:w-auto"
            >
              {pending ? 'A guardar…' : editMode ? 'Salvar alterações' : 'Criar instituição'}
            </button>
            <Link href="/admin/ies"
              className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-800 border
                         border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/ies/nova/page.tsx
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}