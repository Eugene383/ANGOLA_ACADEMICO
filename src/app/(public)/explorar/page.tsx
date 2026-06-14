import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Search, Building2, BookOpen, Users, GraduationCap, MapPin, ArrowRight } from 'lucide-react'
import PublicRelatorios from '@/components/PublicRelatorios'

type ExplorarPageProps = {
  searchParams?: Promise<{ q?: string }>
}

export default async function ExplorarPage({ searchParams }: ExplorarPageProps) {
  const supabase = await createClient()
  // Next.js 14+ — searchParams também é Promise
  const resolvedParams = await searchParams
  const searchTerm = (resolvedParams?.q ?? '').trim()

  const [
    { count: totalIES },
    { count: totalCursos },
    { data: provincias },
    { data: areas },
  ] = await Promise.all([
    supabase.from('ies').select('*', { count: 'exact', head: true }).eq('activa', true),
    supabase.from('cursos').select('*', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('provincias').select('id, nome, codigo').order('nome'),
    supabase.from('areas_conhecimento').select('id, nome, codigo_isced').is('parent_id', null).order('codigo_isced'),
  ])

  // Pesquisa: IES por nome/sigla
  let iesSearch: any[] = []
  // Pesquisa: Cursos por nome do curso (join separado para IES por nome)
  let cursosSearch: any[] = []

  if (searchTerm) {
    // Buscar IES que correspondem à pesquisa
    const { data: iesResult } = await supabase
      .from('ies')
      .select('id, nome, sigla, natureza, activa, provincia:provincias(id,nome)')
      .eq('activa', true)
      .or(`nome.ilike.%${searchTerm}%,sigla.ilike.%${searchTerm}%`)
      .order('nome')

    iesSearch = iesResult ?? []

    // Buscar cursos por nome do curso
    const { data: cursosPorNome } = await supabase
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
      .eq('activo', true)
      .ilike('nome', `%${searchTerm}%`)
      .order('nome')

    // Buscar IES que correspondem ao termo e depois os seus cursos
    const iesMatchIds = iesSearch.map((i: any) => i.id)
    let cursosDasIes: any[] = []

    if (iesMatchIds.length > 0) {
      const { data: cursosIes } = await supabase
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
        .eq('activo', true)
        .in('ies_id', iesMatchIds)
        .order('nome')

      cursosDasIes = cursosIes ?? []
    }

    // Juntar e remover duplicados por id
    const todosOsCursos = [...(cursosPorNome ?? []), ...cursosDasIes]
    const seen = new Set<string>()
    cursosSearch = todosOsCursos.filter((c: any) => {
      if (seen.has(c.id)) return false
      seen.add(c.id)
      return true
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Explorar o ensino superior em Angola
          </h1>
          <p className="text-gray-500 mb-8 text-base">
            Dados públicos de instituições, cursos, vagas e indicadores académicos.
          </p>

          {/* Barra de pesquisa */}
          <form action="/explorar" method="get" className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="q"
                defaultValue={searchTerm}
                type="text"
                placeholder="Pesquisar cursos ou instituições..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Pesquisar
            </button>
          </form>
          {searchTerm ? (
            <div className="mt-6 text-sm text-gray-600">
              Resultados para <span className="font-semibold text-gray-900">"{searchTerm}"</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Stats rápidos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Instituições activas', value: totalIES ?? 0, icon: Building2, cor: 'text-blue-600 bg-blue-50' },
            { label: 'Cursos disponíveis',   value: totalCursos ?? 0, icon: BookOpen, cor: 'text-purple-600 bg-purple-50' },
            { label: 'Províncias cobertas',  value: (provincias ?? []).length, icon: MapPin, cor: 'text-green-600 bg-green-50' },
            { label: 'Áreas do conhecimento', value: areas?.length ?? 0, icon: GraduationCap, cor: 'text-amber-600 bg-amber-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${s.cor}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-900">{s.value.toLocaleString('pt-AO')}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <PublicRelatorios
            totalIES={totalIES ?? 0}
            totalCursos={totalCursos ?? 0}
            totalAreas={areas?.length ?? 0}
            totalProvincias={(provincias ?? []).length}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2">
            {/* Províncias */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm font-semibold text-gray-800">Explorar por província</h2>
                </div>
              </div>
              <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {(provincias ?? []).map((p) => (
                  <Link
                    key={p.id}
                    href={`/explorar/provincia/${p.id}`}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg border border-gray-100
                               hover:border-blue-300 hover:bg-blue-50 transition-colors group text-center"
                  >
                    <span className="text-sm font-bold text-gray-700 group-hover:text-blue-700">
                      {p.codigo}
                    </span>
                    <span className="text-xs text-gray-400 group-hover:text-blue-500 leading-tight">
                      {p.nome}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Resultados de pesquisa */}
            {searchTerm ? (
              <div className="bg-white rounded-xl border border-gray-200 mt-6 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultados da pesquisa</h2>
                <div className="space-y-8">

                  {/* IES */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      Instituições
                      <span className="text-xs font-normal text-gray-400 ml-1">({iesSearch.length})</span>
                    </h3>
                    {iesSearch.length ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                          <thead>
                            <tr className="text-gray-500 border-b border-gray-100">
                              <th className="px-3 py-2 font-medium">Nome</th>
                              <th className="px-3 py-2 font-medium">Sigla</th>
                              <th className="px-3 py-2 font-medium">Natureza</th>
                              <th className="px-3 py-2 font-medium">Província</th>
                            </tr>
                          </thead>
                          <tbody>
                            {iesSearch.map((item: any) => (
                              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="px-3 py-3 text-gray-800 font-medium">{item.nome}</td>
                                <td className="px-3 py-3 text-gray-600">{item.sigla ?? '-'}</td>
                                <td className="px-3 py-3 text-gray-600">{item.natureza ?? '-'}</td>
                                <td className="px-3 py-3 text-gray-600">{(item.provincia as any)?.nome ?? '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Nenhuma instituição corresponde à pesquisa.</p>
                    )}
                  </div>

                  {/* Cursos */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-500" />
                      Cursos
                      <span className="text-xs font-normal text-gray-400 ml-1">({cursosSearch.length})</span>
                    </h3>
                    {cursosSearch.length ? (
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
                            </tr>
                          </thead>
                          <tbody>
                            {cursosSearch.map((curso: any) => {
                              const vagas = curso.vagas?.reduce((s: number, v: any) => s + (v.vagas_ofertadas ?? 0), 0) ?? 0
                              const inscritos = curso.inscritos?.reduce((s: number, i: any) => s + (i.total ?? 0), 0) ?? 0
                              return (
                                <tr key={curso.id} className="border-t border-gray-100 hover:bg-gray-50">
                                  <td className="px-3 py-3 text-gray-800 font-medium">{curso.nome}</td>
                                  <td className="px-3 py-3 text-gray-600">{curso.ies?.nome ?? '-'}</td>
                                  <td className="px-3 py-3 text-gray-600">{curso.nivel?.nome ?? '-'}</td>
                                  <td className="px-3 py-3 text-gray-600">{curso.regime ?? '-'}</td>
                                  <td className="px-3 py-3 text-gray-600">{vagas > 0 ? vagas : '-'}</td>
                                  <td className="px-3 py-3 text-gray-600">{inscritos > 0 ? inscritos : '-'}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Nenhum curso corresponde à pesquisa.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Áreas do conhecimento */}
            <div className="bg-white rounded-xl border border-gray-200 mt-6">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-800">Áreas do conhecimento</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {(areas ?? []).map((a) => (
                  <Link
                    key={a.id}
                    href={`/explorar/area/${a.id}`}
                    className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-400 w-6">{a.codigo_isced}</span>
                      <span className="text-sm text-gray-700 group-hover:text-blue-700">{a.nome}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Painel lateral */}
          <div className="space-y-4">
            {/* Acesso rápido */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Acesso rápido</h3>
              <div className="space-y-2">
                {[
                  { label: 'Ver todas as IES',   href: '/explorar/ies',       icon: Building2 },
                  { label: 'Ver todos os cursos', href: '/explorar/cursos',    icon: BookOpen  },
                  { label: 'Indicadores nacionais', href: '/explorar/indicadores', icon: Users },
                ].map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50
                               text-sm text-gray-600 hover:text-gray-900 transition-colors group"
                  >
                    <item.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                    {item.label}
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto group-hover:text-blue-500" />
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA login */}
            <div className="bg-blue-600 rounded-xl p-5 text-white">
              <h3 className="font-semibold mb-2 text-sm">És gestor de uma IES?</h3>
              <p className="text-xs text-blue-100 mb-4 leading-relaxed">
                Regista-te para submeter dados da tua instituição e aceder a ferramentas de gestão.
              </p>
              <Link
                href="/register"
                className="block text-center bg-white text-blue-700 font-semibold text-sm
                           px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Criar conta
              </Link>
            </div>

            {/* Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs text-amber-800 font-semibold mb-1">Dados públicos</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Todos os dados disponíveis aqui são públicos e não contêm informação pessoal de estudantes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
