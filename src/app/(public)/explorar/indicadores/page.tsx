import { createClient } from '@/lib/supabase/server'
import PublicDataExport from '@/components/PublicDataExport'

type IndicadorProvincia = {
  provincia: string
  total_ies: number
  total_cursos: number
  total_inscritos: number
  total_graduados: number
}

export default async function IndicadoresPage() {
  const supabase = await createClient()
  const { data: provincias = [] } = await supabase
    .from('provincias')
    .select(`
      id,
      nome,
      ies(
        id,
        natureza,
        cursos(
          id,
          inscritos(total, ano_lectivo_id),
          graduados(total, ano_lectivo_id)
        )
      )
    `)
    .order('nome')

  const rows = (provincias as any[]).map(p => {
    const iesList = p.ies ?? []
    const cursos = iesList.flatMap((ies: any) => ies.cursos ?? [])
    return {
      provincia: p.nome,
      total_ies: iesList.length,
      total_cursos: cursos.length,
      total_inscritos: cursos.reduce((sum: number, curso: any) => sum + (curso.inscritos?.reduce((s: number, i: any) => s + (i.total ?? 0), 0) ?? 0), 0),
      total_graduados: cursos.reduce((sum: number, curso: any) => sum + (curso.graduados?.reduce((s: number, g: any) => s + (g.total ?? 0), 0) ?? 0), 0),
    }
  }) as IndicadorProvincia[]

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Indicadores Nacionais</h1>
          <p className="text-sm text-gray-500 mt-2">
            Dados públicos agregados por província, incluindo IES, cursos, inscritos e graduados.
          </p>
        </div>

        <PublicDataExport
          title="Exportar indicadores nacionais"
          columns={[
            { key: 'provincia', label: 'Província' },
            { key: 'total_ies', label: 'Total de IES' },
            { key: 'total_cursos', label: 'Total de Cursos' },
            { key: 'total_inscritos', label: 'Total de Inscritos' },
            { key: 'total_graduados', label: 'Total de Graduados' },
          ]}
          rows={rows}
          csvFilename="indicadores-nacionais.csv"
          pdfFilename="indicadores-nacionais.pdf"
        />

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-gray-700">
                  <th className="px-3 py-2">Província</th>
                  <th className="px-3 py-2">Total de IES</th>
                  <th className="px-3 py-2">Total de Cursos</th>
                  <th className="px-3 py-2">Total de Inscritos</th>
                  <th className="px-3 py-2">Total de Graduados</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-3 text-gray-800">{row.provincia}</td>
                    <td className="px-3 py-3 text-gray-800">{row.total_ies}</td>
                    <td className="px-3 py-3 text-gray-800">{row.total_cursos}</td>
                    <td className="px-3 py-3 text-gray-800">{row.total_inscritos}</td>
                    <td className="px-3 py-3 text-gray-800">{row.total_graduados}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
