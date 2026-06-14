import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import PublicDataExport from '@/components/PublicDataExport'

type IesPageProps = {
  id: string
  nome: string
  sigla: string | null
  natureza: string | null
  activa: boolean
  provincia: { id: string; nome: string } | null
}

export default async function IesPage() {
  const supabase = await createClient()
  const { data: ies = [] } = await supabase
    .from('ies')
    .select(`
      id,
      nome,
      sigla,
      natureza,
      activa,
      provincia:provincias(id,nome)
    `)
    .order('nome')

  const rows = (ies as IesPageProps[]).map(item => ({
    Nome: item.nome,
    Sigla: item.sigla ?? '-',
    Natureza: item.natureza ?? '-',
    Província: item.provincia?.nome ?? '-',
    Estado: item.activa ? 'Activa' : 'Inativa',
  }))

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* Cabeçalho com botão Voltar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Instituições de Ensino Superior</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Lista pública de todas as IES registadas no sistema.
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
          title="Exportar IES públicas"
          columns={[
            { key: 'Nome', label: 'Nome' },
            { key: 'Sigla', label: 'Sigla' },
            { key: 'Natureza', label: 'Natureza' },
            { key: 'Província', label: 'Província' },
            { key: 'Estado', label: 'Estado' },
          ]}
          rows={rows}
          csvFilename="ies-publicas.csv"
          pdfFilename="ies-publicas.pdf"
        />

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-6 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-100">
                <th className="px-2 sm:px-3 py-2 sm:py-3 font-medium whitespace-nowrap">Nome</th>
                <th className="hidden sm:table-cell px-3 py-3 font-medium">Sigla</th>
                <th className="hidden md:table-cell px-3 py-3 font-medium">Natureza</th>
                <th className="px-2 sm:px-3 py-2 sm:py-3 font-medium">Província</th>
                <th className="hidden sm:table-cell px-3 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {(ies as IesPageProps[]).map(item => (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-2 sm:px-3 py-3 text-gray-800 font-medium whitespace-nowrap text-ellipsis overflow-hidden">{item.nome}</td>
                  <td className="hidden sm:table-cell px-3 py-3 text-gray-600">{item.sigla ?? '-'}</td>
                  <td className="hidden md:table-cell px-3 py-3 text-gray-600">{item.natureza ?? '-'}</td>
                  <td className="px-2 sm:px-3 py-3 text-gray-600 text-ellipsis overflow-hidden">
                    {item.provincia ? (
                      <Link href={`/explorar/provincia/${item.provincia.id}`} className="text-blue-600 hover:underline">
                        {item.provincia.nome}
                      </Link>
                    ) : '-'}
                  </td>
                  <td className="hidden sm:table-cell px-3 py-3">
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

      </div>
    </div>
  )
}
