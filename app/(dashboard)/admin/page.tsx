import { createClient } from '@/lib/supabase/server'
import StatCard from '@/components/dashboard/StatCard'
import TabelaIES from '@/components/dashboard/TabelaIES'
import GraficoProvincias from '@/components/dashboard/GraficoProvincias'
import { Building2, BookOpen, Users, GraduationCap, TrendingUp } from 'lucide-react'

async function getEstatisticasNacionais(supabase: Awaited<ReturnType<typeof createClient>>) {
  const [
    { count: totalIES },
    { count: totalCursos },
    { data: inscritos },
    { data: graduados },
    { data: anoActivo },
  ] = await Promise.all([
    supabase.from('ies').select('*', { count: 'exact', head: true }).eq('activa', true),
    supabase.from('cursos').select('*', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('inscritos').select('total, masculino, feminino'),
    supabase.from('graduados').select('total'),
    supabase.from('anos_lectivos').select('id').eq('activo', true).single(),
  ])

  const totalInscritos  = inscritos?.reduce((s, i) => s + i.total, 0) ?? 0
  const totalFeminino   = inscritos?.reduce((s, i) => s + i.feminino, 0) ?? 0
  const totalGraduados  = graduados?.reduce((s, g) => s + g.total, 0) ?? 0
  const taxaFeminizacao = totalInscritos > 0
    ? ((totalFeminino / totalInscritos) * 100).toFixed(1)
    : '0.0'

  return { totalIES, totalCursos, totalInscritos, totalGraduados, taxaFeminizacao }
}

async function getDadosPorProvincia(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from('provincias')
    .select(`
      nome, codigo,
      ies(
        id,
        cursos(
          inscritos(total)
        )
      )
    `)
    .order('nome')

  return (data ?? []).map((p: any) => ({
    nome: p.nome,
    codigo: p.codigo,
    totalIES: p.ies?.length ?? 0,
    totalInscritos: p.ies?.reduce((s: number, i: any) =>
      s + (i.cursos?.reduce((sc: number, c: any) =>
        sc + (c.inscritos?.reduce((si: number, ins: any) =>
          si + ins.total, 0) ?? 0), 0) ?? 0), 0) ?? 0,
  }))
}

export default async function AdminPage() {
  const supabase = await createClient()
  const [stats, dadosProvincia] = await Promise.all([
    getEstatisticasNacionais(supabase),
    getDadosPorProvincia(supabase),
  ])

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Visão geral nacional</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Indicadores consolidados do ensino superior em Angola
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          titulo="Instituições activas"
          valor={stats.totalIES ?? 0}
          icon={Building2}
          cor="blue"
          subtitulo="IES licenciadas"
        />
        <StatCard
          titulo="Cursos activos"
          valor={stats.totalCursos ?? 0}
          icon={BookOpen}
          cor="purple"
          subtitulo="Em todas as IES"
        />
        <StatCard
          titulo="Total de inscritos"
          valor={stats.totalInscritos}
          icon={Users}
          cor="green"
          subtitulo="Todos os anos lectivos"
        />
        <StatCard
          titulo="Total de graduados"
          valor={stats.totalGraduados}
          icon={GraduationCap}
          cor="amber"
          subtitulo="Todos os anos lectivos"
        />
      </div>

      {/* Taxa de feminização */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-pink-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">{stats.taxaFeminizacao}%</p>
            <p className="text-sm text-gray-600">Taxa de feminização</p>
          </div>
          <div className="ml-auto">
            <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-400 rounded-full transition-all"
                style={{ width: `${stats.taxaFeminizacao}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">
              Meta: 50%
            </p>
          </div>
        </div>
      </div>

      {/* Tabela + Gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TabelaIES />
        <GraficoProvincias dados={dadosProvincia} />
      </div>
    </div>
  )
}