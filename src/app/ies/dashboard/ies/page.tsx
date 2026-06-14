import { createClient } from '@/lib/supabase/server'
import PublicDataExport from '@/components/PublicDataExport'

export default async function IesManagerPage() {
  const supabase = await createClient()
  const { data: iesUsuarios = [] } = await supabase
    .from('ies_usuarios')
    .select(`
      ies(
        id,
        nome,
        sigla,
        natureza,
        activa,
        provincia:provincias(id,nome),
        website,
        tipo
      )
    `)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

  const iesList = (iesUsuarios ?? []).map((item: any) => item.ies).filter(Boolean)

  const rows = iesList.map((ies: any) => ({
    Nome: ies.nome,
    Sigla: ies.sigla ?? '-',
    Natureza: ies.natureza ?? '-',
    Província: ies.provincia?.nome ?? '-',
    Tipo: ies.tipo ?? '-',
    Estado: ies.activa ? 'Activa' : 'Inativa',
    Website: ies.website ?? '-',
  }))

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Minhas instituições</h2>
        <p className="text-sm text-gray-500 mt-1">
          Aqui estão as instituições que lhe foram atribuídas como gestor.
        </p>
      </div>

      <PublicDataExport
        title="Exportar IES atribuídas"
        columns={[
          { key: 'Nome', label: 'Nome' },
          { key: 'Sigla', label: 'Sigla' },
          { key: 'Natureza', label: 'Natureza' },
          { key: 'Província', label: 'Província' },
          { key: 'Tipo', label: 'Tipo' },
          { key: 'Estado', label: 'Estado' },
          { key: 'Website', label: 'Website' },
        ]}
        rows={rows}
        csvFilename="ies-atribuida.csv"
        pdfFilename="ies-atribuida.pdf"
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Sigla</th>
              <th className="px-4 py-3">Natureza</th>
              <th className="px-4 py-3">Província</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Website</th>
            </tr>
          </thead>
          <tbody>
            {iesList.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Nenhuma IES atribuída à sua conta.
                </td>
              </tr>
            ) : iesList.map((ies: any) => (
              <tr key={ies.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 font-medium text-gray-900">{ies.nome}</td>
                <td className="px-4 py-4 text-gray-700">{ies.sigla ?? '-'}</td>
                <td className="px-4 py-4 text-gray-700">{ies.natureza ?? '-'}</td>
                <td className="px-4 py-4 text-gray-700">{ies.provincia?.nome ?? '-'}</td>
                <td className="px-4 py-4 text-gray-700">{ies.tipo ?? '-'}</td>
                <td className="px-4 py-4 text-gray-700">{ies.activa ? 'Activa' : 'Inativa'}</td>
                <td className="px-4 py-4 text-blue-600">
                  {ies.website ? (
                    <a href={ies.website} target="_blank" rel="noreferrer" className="hover:underline">
                      Ver site
                    </a>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
