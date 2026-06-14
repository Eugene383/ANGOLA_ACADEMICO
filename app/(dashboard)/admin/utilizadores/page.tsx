import { createClient } from '@/lib/supabase/server'
import TabelaUtilizadores from '@/components/dashboard/TabelaUtilizadores'

export default async function UtilizadoresPage() {
  const supabase = await createClient()

  const { data: utilizadores } = await supabase
    .from('profiles')
    .select(`
      *,
      ies_usuarios(
        role,
        ies:ies(id, nome, sigla)
      )
    `)
    .order('created_at', { ascending: false })

  const { data: todasIES } = await supabase
    .from('ies')
    .select('id, nome, sigla')
    .eq('activa', true)
    .order('nome')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Utilizadores</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Gerir contas, roles e atribuições a instituições
        </p>
      </div>
      <TabelaUtilizadores
        utilizadores={utilizadores ?? []}
        todasIES={todasIES ?? []}
      />
    </div>
  )
}