import { createClient } from '@/lib/supabase/server'
import PublicDataExport from '@/components/PublicDataExport'

export default async function CursosDashboardPage() {
  const supabase = await createClient()
  const userId = (await supabase.auth.getUser()).data.user?.id

  const { data: iesUsuarios = [] } = await supabase
    .from('ies_usuarios')
    .select('ies_id')
    .eq('user_id', userId)

  const iesIds = (iesUsuarios ?? []).map((item: any) => item.ies_id)

  const { data: cursos = [] } = await supabase
    .from('cursos')
    .select(`
      id,
      nome,
      regime,
      activo,
      ies:ies(id,nome),
      nivel:niveis_ensino(id,nome)
    `)
    .in('ies_id', iesIds)
    .order('nome')

  const rows = (cursos as any[]).map((curso) => ({
    Nome: curso.nome,
    IES: curso.ies?.nome ?? '-',
    Nível: curso.nivel?.nome ?? '-',
    Regime: curso.regime ?? '-',
    Estado: curso.activo ? 'Activo' : 'Inactivo',
  }))

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Cursos das minhas IES</h2>
        <p className="text-sm text-gray-500 mt-1">
          Lista de cursos associados às instituições que você gere.
        </p>
      </div>

      <PublicDataExport
        title="Exportar cursos das minhas IES"
        columns={[
          { key: 'Nome', label: 'Nome' },
          { key: 'IES', label: 'IES' },
          { key: 'Nível', label: 'Nível' },
          { key: 'Regime', label: 'Regime' },
          { key: 'Estado', label: 'Estado' },
        ]}
        rows={rows}
        csvFilename="cursos-minhas-ies.csv"
        pdfFilename="cursos-minhas-ies.pdf"
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">IES</th>
              <th className="px-4 py-3">Nível</th>
              <th className="px-4 py-3">Regime</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Nenhum curso encontrado para as suas IES.
                </td>
              </tr>
            ) : rows.map((curso, index) => (
              <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-gray-900">{curso.Nome}</td>
                <td className="px-4 py-4 text-gray-700">{curso.IES}</td>
                <td className="px-4 py-4 text-gray-700">{curso['Nível']}</td>
                <td className="px-4 py-4 text-gray-700">{curso.Regime}</td>
                <td className="px-4 py-4 text-gray-700">{curso.Estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
