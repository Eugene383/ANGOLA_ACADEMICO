import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import PublicDataExport from '@/components/PublicDataExport'

type CursoPageProps = {
  id: string
  nome: string
  regime: string | null
  activo: boolean
  ies: { id: string; nome: string } | null
  nivel: { id: string; nome: string } | null
}

export default async function CursosPage() {
  const supabase = await createClient()
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
    .eq('activo', true)
    .order('nome')

  const rows = (cursos as CursoPageProps[]).map(item => ({
    Nome: item.nome,
    IES: item.ies?.nome ?? '-',
    Nível: item.nivel?.nome ?? '-',
    Regime: item.regime ?? '-',
    Estado: item.activo ? 'Activo' : 'Inactivo',
  }))

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* Cabeçalho com botão Voltar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Cursos Públicos</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Lista pública de todos os cursos activos no sistema.
            </p>
          </div>
          <Link
            href="/ies/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-sm hover:border-blue-300 hover:text-blue-700 transition self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao painel
          </Link>
        </div>

        <PublicDataExport
          title="Exportar cursos públicos"
          columns={[
            { key: 'Nome', label: 'Nome' },
            { key: 'IES', label: 'IES' },
            { key: 'Nível', label: 'Nível' },
            { key: 'Regime', label: 'Regime' },
            { key: 'Estado', label: 'Estado' },
          ]}
          rows={rows}
          csvFilename="cursos-publicos.csv"
          pdfFilename="cursos-publicos.pdf"
        />

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-6 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-100">
                <th className="px-2 sm:px-3 py-2 sm:py-3 font-medium whitespace-nowrap">Nome</th>
                <th className="px-2 sm:px-3 py-2 sm:py-3 font-medium whitespace-nowrap">IES</th>
                <th className="hidden sm:table-cell px-3 py-3 font-medium">Nível</th>
                <th className="hidden md:table-cell px-3 py-3 font-medium">Regime</th>
                <th className="hidden sm:table-cell px-3 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {(cursos as CursoPageProps[]).map(item => (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-2 sm:px-3 py-3 text-gray-800 font-medium whitespace-nowrap text-ellipsis overflow-hidden">{item.nome}</td>
                  <td className="px-2 sm:px-3 py-3 text-gray-600 whitespace-nowrap text-ellipsis overflow-hidden">{item.ies?.nome ?? '-'}</td>
                  <td className="hidden sm:table-cell px-3 py-3 text-gray-600">{item.nivel?.nome ?? '-'}</td>
                  <td className="hidden md:table-cell px-3 py-3 text-gray-600">{item.regime ?? '-'}</td>
                  <td className="hidden sm:table-cell px-3 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      {item.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
