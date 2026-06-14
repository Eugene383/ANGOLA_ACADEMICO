import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Building2, BookOpen, Users, GraduationCap, MapPin, ArrowLeft } from 'lucide-react'

type ProvincePageProps = {
  params: Promise<{ id: string }>
}

type IesItem = {
  id: string
  nome: string
  sigla: string | null
  natureza: string | null
  activa: boolean
}

type CursoItem = {
  id: string
  nome: string
  regime: string | null
  activo: boolean
  ies: { id: string; nome: string; sigla: string | null } | null
  nivel: { id: string; nome: string } | null
  vagas?: { vagas_ofertadas: number; vagas_preenchidas: number }[]
  inscritos?: { total: number; masculino: number; feminino: number }[]
  graduados?: { total: number }[]
}

export default async function ProvinciaPage({ params }: ProvincePageProps) {
  // Next.js 14+ — params é uma Promise
  const { id: provinceId } = await params
  const supabase = await createClient()

  const { data: provincia, error: provinciaError } = await supabase
    .from('provincias')
    .select('id, nome, codigo')
    .eq('id', provinceId)
    .single()

  if (!provincia || provinciaError) notFound()

  const { data: ies, error: iesError } = await supabase
    .from('ies')
    .select('id, nome, sigla, natureza, activa')
    .eq('provincia_id', provinceId)
    .order('nome')

  if (iesError) console.error('Erro ao carregar IES:', iesError)

  const iesList = (ies ?? []) as IesItem[]
  const iesIds = iesList.map((item) => item.id)

  let cursoList: CursoItem[] = []

  if (iesIds.length > 0) {
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select(`
        id,
        nome,
        regime,
        activo,
        ies:ies(id,nome,sigla),
        nivel:niveis_ensino(id,nome),
        vagas(vagas_ofertadas,vagas_preenchidas),
        inscritos(total,masculino,feminino),
        graduados(total)
      `)
      .in('ies_id', iesIds)
      .order('nome')

    if (cursosError) console.error('Erro ao carregar cursos:', cursosError)
    cursoList = (cursos ?? []) as CursoItem[]
  }

  const totalIES = iesList.length
  const totalCursos = cursoList.length
  const totalVagasOfertadas = cursoList.reduce(
    (sum, curso) => sum + (curso.vagas?.reduce((s, item) => s + (item.vagas_ofertadas ?? 0), 0) ?? 0),
    0
  )
  const totalVagasPreenchidas = cursoList.reduce(
    (sum, curso) => sum + (curso.vagas?.reduce((s, item) => s + (item.vagas_preenchidas ?? 0), 0) ?? 0),
    0
  )
  const totalInscritos = cursoList.reduce(
    (sum, curso) => sum + (curso.inscritos?.reduce((s, item) => s + (item.total ?? 0), 0) ?? 0),
    0
  )
  const totalGraduados = cursoList.reduce(
    (sum, curso) => sum + (curso.graduados?.reduce((s, item) => s + (item.total ?? 0), 0) ?? 0),
    0
  )

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              Província {provincia.codigo}
            </p>
            <h1 className="text-3xl font-semibold text-gray-900">{provincia.nome}</h1>
            <p className="text-sm text-gray-500 mt-2">
              Dados consolidados sobre instituições, cursos, vagas, inscritos e graduados para esta província.
            </p>
          </div>

          <Link
            href="/explorar"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-blue-300 hover:text-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para explorar
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            { label: 'Instituições', value: totalIES.toLocaleString('pt-AO'), icon: Building2, cor: 'text-blue-600 bg-blue-50' },
            { label: 'Cursos activos', value: totalCursos.toLocaleString('pt-AO'), icon: BookOpen, cor: 'text-purple-600 bg-purple-50' },
            { label: 'Vagas ofertadas', value: totalVagasOfertadas.toLocaleString('pt-AO'), icon: GraduationCap, cor: 'text-amber-600 bg-amber-50' },
            { label: 'Vagas preenchidas', value: totalVagasPreenchidas.toLocaleString('pt-AO'), icon: Users, cor: 'text-green-600 bg-green-50' },
            { label: 'Inscritos', value: totalInscritos.toLocaleString('pt-AO'), icon: Users, cor: 'text-slate-700 bg-slate-50' },
            { label: 'Graduados', value: totalGraduados.toLocaleString('pt-AO'), icon: GraduationCap, cor: 'text-indigo-600 bg-indigo-50' },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.cor}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            {/* Tabela de IES */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Instituições na província ({totalIES})
              </h2>
              {iesList.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-100">
                        <th className="px-3 py-2 font-medium">Nome</th>
                        <th className="px-3 py-2 font-medium">Sigla</th>
                        <th className="px-3 py-2 font-medium">Natureza</th>
                        <th className="px-3 py-2 font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {iesList.map((item) => (
                        <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-3 text-gray-800 font-medium">{item.nome}</td>
                          <td className="px-3 py-3 text-gray-600">{item.sigla ?? '-'}</td>
                          <td className="px-3 py-3 text-gray-600">{item.natureza ?? '-'}</td>
                          <td className="px-3 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              item.activa ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {item.activa ? 'Activa' : 'Inativa'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 py-4">Nenhuma instituição encontrada para esta província.</p>
              )}
            </div>

            {/* Tabela de Cursos */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Cursos na província ({totalCursos})
              </h2>
              {cursoList.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-100">
                        <th className="px-3 py-2 font-medium">Curso</th>
                        <th className="px-3 py-2 font-medium">IES</th>
                        <th className="px-3 py-2 font-medium">Nível</th>
                        <th className="px-3 py-2 font-medium">Regime</th>
                        <th className="px-3 py-2 font-medium">Vagas</th>
                        <th className="px-3 py-2 font-medium">Inscritos</th>
                        <th className="px-3 py-2 font-medium">Graduados</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cursoList.map((curso) => {
                        const vagas = curso.vagas?.reduce((s, v) => s + (v.vagas_ofertadas ?? 0), 0) ?? 0
                        const inscritos = curso.inscritos?.reduce((s, i) => s + (i.total ?? 0), 0) ?? 0
                        const graduados = curso.graduados?.reduce((s, g) => s + (g.total ?? 0), 0) ?? 0
                        return (
                          <tr key={curso.id} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="px-3 py-3 text-gray-800 font-medium">{curso.nome}</td>
                            <td className="px-3 py-3 text-gray-600">{curso.ies?.sigla ?? curso.ies?.nome ?? '-'}</td>
                            <td className="px-3 py-3 text-gray-600">{curso.nivel?.nome ?? '-'}</td>
                            <td className="px-3 py-3 text-gray-600">{curso.regime ?? '-'}</td>
                            <td className="px-3 py-3 text-gray-600">{vagas > 0 ? vagas.toLocaleString('pt-AO') : '-'}</td>
                            <td className="px-3 py-3 text-gray-600">{inscritos > 0 ? inscritos.toLocaleString('pt-AO') : '-'}</td>
                            <td className="px-3 py-3 text-gray-600">{graduados > 0 ? graduados.toLocaleString('pt-AO') : '-'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 py-4">Nenhum curso activo encontrado para esta província.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Resumo */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo de dados</h2>
              <div className="space-y-3">
                {[
                  { label: 'Instituições', value: totalIES, cor: 'text-blue-600' },
                  { label: 'Cursos', value: totalCursos, cor: 'text-purple-600' },
                  { label: 'Vagas ofertadas', value: totalVagasOfertadas, cor: 'text-amber-600' },
                  { label: 'Vagas preenchidas', value: totalVagasPreenchidas, cor: 'text-green-600' },
                  { label: 'Total inscritos', value: totalInscritos, cor: 'text-slate-700' },
                  { label: 'Total graduados', value: totalGraduados, cor: 'text-indigo-600' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-600">{row.label}</span>
                    <span className={`text-sm font-semibold ${row.cor}`}>
                      {row.value.toLocaleString('pt-AO')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 mb-2">Dados Públicos</p>
              <p className="text-sm text-amber-700 leading-relaxed">
                Todos os dados nesta página são agregados publicamente e não incluem informações pessoais sensíveis de estudantes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
