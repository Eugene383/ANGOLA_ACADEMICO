import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function IesDashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, nome')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'gestor_ies' && profile.role !== 'admin')) {
    redirect('/login?error=sem-permissao')
  }

  const { data: iesRecords } = await supabase
    .from('ies_usuarios')
    .select(`
      ies(
        id,
        nome,
        sigla,
        natureza,
        activa,
        provincia:provincias(id,nome)
      )
    `)
    .eq('user_id', user.id)

  const iesList = (iesRecords ?? []).map((item: any) => item.ies).filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Painel do Gestor IES</h1>
          <p className="text-sm text-gray-500 mt-2">
            Bem-vindo, {profile?.nome ?? 'Gestor'} — aqui pode ver as suas instituições.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {iesList.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900">Nenhuma IES atribuída</h2>
              <p className="text-sm text-gray-500 mt-2">
                O seu utilizador não tem uma IES atribuída. Peça ao administrador para associar a sua conta a uma instituição.
              </p>
            </div>
          ) : (
            iesList.map((ies: any) => (
              <div key={ies.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Instituição</p>
                    <h2 className="text-2xl font-semibold text-gray-900">{ies.nome}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {ies.natureza ?? 'Natureza desconhecida'} · {ies.provincia?.nome ?? 'Província desconhecida'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/explorar/ies`}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Ver todas as IES públicas
                    </Link>
                    <Link
                      href={`/explorar/cursos`}
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Ver cursos públicos
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
