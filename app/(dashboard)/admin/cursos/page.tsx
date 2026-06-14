// src/app/(dashboard)/admin/cursos/page.tsx
<<<<<<< HEAD:src/app/(dashboard)/admin/cursos/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Search, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useCursos } from '@/hooks/useCursos'
import { useAnosLectivos } from '@/hooks'
import { createClient } from '@/lib/supabase/client'
import type { CursoInsert } from '@/types/domain.types'

type CursoFormState = Partial<CursoInsert> & {
  ano_lectivo_id?: string
  vagas_ofertadas?: number
  vagas_preenchidas?: number
  inscritos_total?: number
  graduados_total?: number
}

export default function CursosPage() {
  const { cursos, loading, error, refetch } = useCursos()
  const { anosLectivos, anoActivo } = useAnosLectivos()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busca, setBusca] = useState<string>('')
  const [iesOptions, setIesOptions] = useState<any[]>([])
  const [areasOptions, setAreasOptions] = useState<any[]>([])
  const [niveisOptions, setNiveisOptions] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const [form, setForm] = useState<CursoFormState>({
    nome: '',
    ies_id: undefined,
    area_id: undefined,
    nivel_id: undefined,
    duracao_anos: 3,
    regime: 'presencial',
    activo: true,
    ano_lectivo_id: undefined,
    vagas_ofertadas: 0,
    vagas_preenchidas: 0,
    inscritos_total: 0,
    graduados_total: 0,
  })

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('ies').select('id, nome').eq('activa', true).order('nome'),
      supabase.from('areas_conhecimento').select('id, nome').is('parent_id', null).order('codigo_isced'),
      supabase.from('niveis_ensino').select('id, nome').order('nome'),
    ]).then(([ies, areas, niveis]) => {
      setIesOptions(ies.data ?? [])
      setAreasOptions(areas.data ?? [])
      setNiveisOptions(niveis.data ?? [])
    })
  }, [])

  useEffect(() => {
    if (anoActivo?.id && !form.ano_lectivo_id) {
      setForm(f => ({ ...f, ano_lectivo_id: anoActivo.id }))
    }
  }, [anoActivo, form.ano_lectivo_id])

  // Filtrar por busca localmente (nome do curso, sigla IES, área)
  const cursosFiltrados = cursos.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (c.ies?.nome ?? '').toLowerCase().includes(busca.toLowerCase()) ||
    (c.ies?.sigla ?? '').toLowerCase().includes(busca.toLowerCase()) ||
    (c.area?.nome ?? '').toLowerCase().includes(busca.toLowerCase())
  )

  const getMetricsForCourse = (course: any) => {
    const anoId = anoActivo?.id
    const vagas = course.vagas?.find((item: any) => item.ano_lectivo_id === anoId) ?? course.vagas?.[0]
    const inscritos = course.inscritos?.find((item: any) => item.ano_lectivo_id === anoId) ?? course.inscritos?.[0]
    const graduados = course.graduados?.find((item: any) => item.ano_lectivo_id === anoId) ?? course.graduados?.[0]

    return {
      vagasOfertadas: vagas?.vagas_ofertadas ?? 0,
      vagasPreenchidas: vagas?.vagas_preenchidas ?? 0,
      inscritosTotal: inscritos?.total ?? 0,
      graduadosTotal: graduados?.total ?? 0,
    }
  }

  async function saveCourseMetrics(cursoId: string, supabase: any) {
    const anoId = form.ano_lectivo_id || anoActivo?.id
    if (!anoId) return { success: true }

    // Helper: split total into masculino/feminino so that masculino + feminino === total
    const splitByGender = (total: number) => {
      const t = Number(total) || 0
      const masculino = Math.floor(t / 2)
      const feminino = t - masculino
      return { masculino, feminino }
    }

    const metrics = [
      {
        table: 'vagas',
        insertPayload: {
          curso_id: cursoId,
          ano_lectivo_id: anoId,
          vagas_ofertadas: form.vagas_ofertadas ?? 0,
          vagas_preenchidas: form.vagas_preenchidas ?? 0,
        },
        updatePayload: {
          vagas_ofertadas: form.vagas_ofertadas ?? 0,
          vagas_preenchidas: form.vagas_preenchidas ?? 0,
        },
      },
      {
        table: 'inscritos',
        insertPayload: (() => {
          const total = Number(form.inscritos_total) || 0
          const { masculino, feminino } = splitByGender(total)
          return {
            curso_id: cursoId,
            ano_lectivo_id: anoId,
            masculino,
            feminino,
            novos: 0,
            repetentes: 0,
            total,
          }
        })(),
        updatePayload: (() => {
          const total = Number(form.inscritos_total) || 0
          const { masculino, feminino } = splitByGender(total)
          return { masculino, feminino, total }
        })(),
      },
      {
        table: 'graduados',
        insertPayload: (() => {
          const total = Number(form.graduados_total) || 0
          const { masculino, feminino } = splitByGender(total)
          return {
            curso_id: cursoId,
            ano_lectivo_id: anoId,
            masculino,
            feminino,
            total,
          }
        })(),
        updatePayload: (() => {
          const total = Number(form.graduados_total) || 0
          const { masculino, feminino } = splitByGender(total)
          return { masculino, feminino, total }
        })(),
      },
    ]

    for (const item of metrics) {
      const { data: existing, error: selectError } = await supabase
        .from(item.table)
        .select('id')
        .eq('curso_id', cursoId)
        .eq('ano_lectivo_id', anoId)
        .maybeSingle()

      if (selectError) return { success: false, message: selectError.message }

      if (existing?.id) {
        const { error: updateError } = await supabase
          .from(item.table)
          .update(item.updatePayload)
          .eq('id', existing.id)

        if (updateError) return { success: false, message: updateError.message }
      } else {
        const { error: insertError } = await supabase.from(item.table).insert(item.insertPayload)
        if (insertError) return { success: false, message: insertError.message }
      }
    }

    return { success: true }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const supabase = createClient()
    const payload: CursoInsert = {
      nome: (form.nome ?? '').trim(),
      ies_id: form.ies_id as string,
      area_id: form.area_id as string,
      nivel_id: form.nivel_id as string,
      duracao_anos: form.duracao_anos as number,
      regime: (form.regime as any) ?? 'presencial',
      activo: form.activo ?? true,
    }

    if (!form.ano_lectivo_id && !anoActivo?.id) {
      setNotification({ type: 'error', message: 'Selecione o ano lectivo antes de guardar os valores de vagas, inscritos e graduados.' })
      setSubmitting(false)
      return
    }

    if (editingId) {
      const { error: updateError } = await supabase.from('cursos').update(payload).eq('id', editingId)
      if (updateError) {
        setNotification({ type: 'error', message: 'Erro ao atualizar curso: ' + updateError.message })
      } else {
        const metricsResult = await saveCourseMetrics(editingId, supabase)
        if (!metricsResult.success) {
          setNotification({ type: 'error', message: 'Curso atualizado, mas houve erro ao guardar métricas: ' + metricsResult.message })
        } else {
          setNotification({ type: 'success', message: 'Curso atualizado com sucesso.' })
          setShowForm(false)
          setEditingId(null)
          setForm({
            nome: '',
            ies_id: undefined,
            area_id: undefined,
            nivel_id: undefined,
            duracao_anos: 3,
            regime: 'presencial',
            activo: true,
            ano_lectivo_id: anoActivo?.id,
            vagas_ofertadas: 0,
            vagas_preenchidas: 0,
            inscritos_total: 0,
            graduados_total: 0,
          })
          refetch()
        }
      }
    } else {
      const { data: insertedData, error: insertError } = await supabase
        .from('cursos')
        .insert([payload])
        .select('id')
        .single()

      if (insertError || !insertedData) {
        setNotification({ type: 'error', message: 'Erro ao criar curso: ' + (insertError?.message ?? 'Não foi possível obter o ID do curso.') })
      } else {
        const metricsResult = await saveCourseMetrics(insertedData.id, supabase)
        if (!metricsResult.success) {
          setNotification({ type: 'error', message: 'Curso criado, mas houve erro ao guardar métricas: ' + metricsResult.message })
        } else {
          setNotification({ type: 'success', message: 'Curso criado com sucesso.' })
          setShowForm(false)
          setForm({
            nome: '',
            ies_id: undefined,
            area_id: undefined,
            nivel_id: undefined,
            duracao_anos: 3,
            regime: 'presencial',
            activo: true,
            ano_lectivo_id: anoActivo?.id,
            vagas_ofertadas: 0,
            vagas_preenchidas: 0,
            inscritos_total: 0,
            graduados_total: 0,
          })
          refetch()
        }
      }
    }

    setSubmitting(false)
  }

  async function handleEdit(c: any) {
    // Abrir o formulário imediatamente para feedback imediato; depois preencher com os dados do BD
    setEditingId(c.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    const supabase = createClient()
    const { data, error }: { data: any | null; error: any } = await supabase
      .from('cursos')
      .select(
        'id,nome,ies_id,area_id,nivel_id,duracao_anos,regime,activo,' +
        'vagas(vagas_ofertadas,vagas_preenchidas,ano_lectivo_id),' +
        'inscritos(total,ano_lectivo_id),' +
        'graduados(total,ano_lectivo_id)'
      )
      .eq('id', c.id)
      .single()

    if (error || !data) {
      setNotification({ type: 'error', message: 'Erro ao carregar dados do curso para edição.' })
      return
    }

    const course = data as {
      id: string
      nome: string
      ies_id: string
      area_id: string
      nivel_id: string
      duracao_anos: number
      regime: 'presencial' | 'a_distancia' | 'misto' | string
      activo: boolean
      vagas?: Array<{ vagas_ofertadas: number; vagas_preenchidas: number; ano_lectivo_id: string }>
      inscritos?: Array<{ total: number; ano_lectivo_id: string }>
      graduados?: Array<{ total: number; ano_lectivo_id: string }>
    }

    const currentAnoId = anoActivo?.id
    const selectedAnoId =
      course.vagas?.find(row => row.ano_lectivo_id === currentAnoId)?.ano_lectivo_id ??
      course.inscritos?.find(row => row.ano_lectivo_id === currentAnoId)?.ano_lectivo_id ??
      course.graduados?.find(row => row.ano_lectivo_id === currentAnoId)?.ano_lectivo_id ??
      course.vagas?.[0]?.ano_lectivo_id ??
      course.inscritos?.[0]?.ano_lectivo_id ??
      course.graduados?.[0]?.ano_lectivo_id ??
      currentAnoId

    const selectedVagas = course.vagas?.find((row) => row.ano_lectivo_id === selectedAnoId) ?? course.vagas?.[0]
    const selectedInscritos = course.inscritos?.find((row) => row.ano_lectivo_id === selectedAnoId) ?? course.inscritos?.[0]
    const selectedGraduados = course.graduados?.find((row) => row.ano_lectivo_id === selectedAnoId) ?? course.graduados?.[0]

    setForm({
      nome: course.nome ?? '',
      ies_id: course.ies_id,
      area_id: course.area_id,
      nivel_id: course.nivel_id,
      duracao_anos: course.duracao_anos ?? 3,
      regime: course.regime as 'presencial' | 'a_distancia' | 'misto',
      activo: course.activo ?? true,
      ano_lectivo_id: selectedAnoId,
      vagas_ofertadas: selectedVagas?.vagas_ofertadas ?? 0,
      vagas_preenchidas: selectedVagas?.vagas_preenchidas ?? 0,
      inscritos_total: selectedInscritos?.total ?? 0,
      graduados_total: selectedGraduados?.total ?? 0,
    })
  }

  async function handleDelete(id: string) {
    const ok = confirm('Tem a certeza que pretende eliminar este curso? Esta ação não pode ser desfeita.')
    if (!ok) return
    const supabase = createClient()
    const { error: delError } = await supabase.from('cursos').delete().eq('id', id)
    if (delError) {
      setNotification({ type: 'error', message: 'Erro ao eliminar curso: ' + delError.message })
    } else {
      setNotification({ type: 'success', message: 'Curso eliminado.' })
      refetch()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Cursos</h1>
          <p className="text-sm text-gray-600 mt-0.5">Gestão de cursos por IES e área do conhecimento</p>
        </div>
        <div className="inline-flex items-center gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            onClick={() => {
              const opening = !showForm
              if (opening) {
                setEditingId(null)
                setForm({
                  nome: '',
                  ies_id: undefined,
                  area_id: undefined,
                  nivel_id: undefined,
                  duracao_anos: 3,
                  regime: 'presencial',
                  activo: true,
                  ano_lectivo_id: anoActivo?.id,
                  vagas_ofertadas: 0,
                  vagas_preenchidas: 0,
                  inscritos_total: 0,
                  graduados_total: 0,
                })
              }
              setShowForm(opening)
            }}
          >
            {showForm ? 'Fechar' : 'Adicionar curso'}
          </button>
          <Link href="/admin/cursos" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            Ver todos <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {notification && (
        <div className={`rounded-xl p-4 text-sm font-medium ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {notification.message}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Nome do curso</label>
              <input
                required
                value={form.nome ?? ''}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                placeholder="Nome do curso"
                className="border px-3 py-2 rounded-lg text-gray-900 placeholder:text-gray-500 w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">IES</label>
              <select
                required
                value={form.ies_id ?? ''}
                onChange={e => setForm(f => ({ ...f, ies_id: e.target.value }))}
                className="border px-3 py-2 rounded-lg text-gray-900 w-full"
              >
                <option value="">Selecione a IES</option>
                {iesOptions.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Área</label>
              <select
                required
                value={form.area_id ?? ''}
                onChange={e => setForm(f => ({ ...f, area_id: e.target.value }))}
                className="border px-3 py-2 rounded-lg text-gray-900 w-full"
              >
                <option value="">Selecione a área</option>
                {areasOptions.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Nível de ensino</label>
              <select
                required
                value={form.nivel_id ?? ''}
                onChange={e => setForm(f => ({ ...f, nivel_id: e.target.value }))}
                className="border px-3 py-2 rounded-lg text-gray-900 w-full"
              >
                <option value="">Selecione o nível</option>
                {niveisOptions.map(n => <option key={n.id} value={n.id}>{n.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Duração (anos)</label>
              <input
                type="number"
                min={1}
                max={8}
                required
                value={form.duracao_anos ?? 3}
                onChange={e => setForm(f => ({ ...f, duracao_anos: Number(e.target.value) }))}
                className="border px-3 py-2 rounded-lg text-gray-900 placeholder:text-gray-500 w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Regime</label>
              <select
                value={form.regime ?? 'presencial'}
                onChange={e => setForm(f => ({ ...f, regime: e.target.value as any }))}
                className="border px-3 py-2 rounded-lg text-gray-900 w-full"
              >
                <option value="presencial">Presencial</option>
                <option value="semi-presencial">Semi-presencial</option>
                <option value="distancia">À distância</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Ano lectivo</label>
              <select
                required
                value={form.ano_lectivo_id ?? ''}
                onChange={e => setForm(f => ({ ...f, ano_lectivo_id: e.target.value }))}
                className="border px-3 py-2 rounded-lg text-gray-900 w-full"
              >
                <option value="">Selecione o ano</option>
                {anosLectivos.map(a => <option key={a.id} value={a.id}>{a.ano}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Vagas ofertadas</label>
              <input
                type="number"
                min={0}
                value={form.vagas_ofertadas ?? 0}
                onChange={e => setForm(f => ({ ...f, vagas_ofertadas: Number(e.target.value) }))}
                className="border px-3 py-2 rounded-lg text-gray-900 placeholder:text-gray-500 w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Vagas preenchidas</label>
              <input
                type="number"
                min={0}
                value={form.vagas_preenchidas ?? 0}
                onChange={e => setForm(f => ({ ...f, vagas_preenchidas: Number(e.target.value) }))}
                className="border px-3 py-2 rounded-lg text-gray-900 placeholder:text-gray-500 w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Inscritos</label>
              <input
                type="number"
                min={0}
                value={form.inscritos_total ?? 0}
                onChange={e => setForm(f => ({ ...f, inscritos_total: Number(e.target.value) }))}
                className="border px-3 py-2 rounded-lg text-gray-900 placeholder:text-gray-500 w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Graduados</label>
              <input
                type="number"
                min={0}
                value={form.graduados_total ?? 0}
                onChange={e => setForm(f => ({ ...f, graduados_total: Number(e.target.value) }))}
                className="border px-3 py-2 rounded-lg text-gray-900 placeholder:text-gray-500 w-full"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {submitting ? 'A gravar...' : (editingId ? 'Atualizar curso' : 'Criar curso')}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg border"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-800">Cursos</h2>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              {cursos.length}
            </span>
          </div>
          <Link href="/admin/cursos" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            Ver todas <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Busca */}
        <div className="px-5 py-3 border-b border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome, IES ou área..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="p-8 text-center text-gray-600">A carregar...</div>
          ) : error ? (
            <div className="p-4 text-red-600">Erro: {error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-700">
                    <th className="p-2">Nome</th>
                    <th className="p-2">IES</th>
                    <th className="p-2">Área</th>
                    <th className="p-2">Nível</th>
                    <th className="p-2">Duração (anos)</th>
                    <th className="p-2">Vagas ofertadas</th>
                    <th className="p-2">Vagas preenchidas</th>
                    <th className="p-2">Inscritos</th>
                    <th className="p-2">Graduados</th>
                    <th className="p-2">Regime</th>
                    <th className="p-2">Activo</th>
                    <th className="p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cursosFiltrados.map(c => {
                    const metrics = getMetricsForCourse(c)
                    return (
                      <tr key={c.id} className="border-t">
                        <td className="p-2 text-gray-800">{c.nome}</td>
                        <td className="p-2 text-gray-800">{c.ies?.nome}</td>
                        <td className="p-2 text-gray-800">{c.area?.nome}</td>
                        <td className="p-2 text-gray-800">{c.nivel?.nome}</td>
                        <td className="p-2 text-gray-800">{c.duracao_anos}</td>
                        <td className="p-2 text-gray-800">{metrics.vagasOfertadas}</td>
                        <td className="p-2 text-gray-800">{metrics.vagasPreenchidas}</td>
                        <td className="p-2 text-gray-800">{metrics.inscritosTotal}</td>
                        <td className="p-2 text-gray-800">{metrics.graduadosTotal}</td>
                        <td className="p-2 text-gray-800">{c.regime}</td>
                        <td className="p-2 text-gray-800">{c.activo ? 'Sim' : 'Não'}</td>
                        <td className="p-2 flex gap-2">
                          <button onClick={() => handleEdit(c)} className="px-3 py-1 text-sm bg-yellow-50 text-yellow-800 rounded-md border">Editar</button>
                          <button onClick={() => handleDelete(c.id)} className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded-md border">Eliminar</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {cursosFiltrados.length === 0 && (
                <div className="p-4 text-gray-600">Nenhum curso encontrado.</div>
              )}
            </div>
          )}
        </div>
=======
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function CursosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Cursos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gestão de cursos por IES e área do conhecimento</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-base font-semibold text-gray-800 mb-2">Módulo em desenvolvimento</h2>
        <p className="text-sm text-gray-400 max-w-sm mx-auto">
          A listagem e gestão de cursos estará disponível em breve.
        </p>
>>>>>>> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:app/(dashboard)/admin/cursos/page.tsx
      </div>
    </div>
  )
}
