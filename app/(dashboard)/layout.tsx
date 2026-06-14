import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardWrapper from '@/components/dashboard/DashboardWrapper'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  // Sem sessão → login
  if (userError || !user) {
    redirect('/login')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, nome, role, created_at')
    .eq('id', user.id)
    .single()

  // Perfil não existe → tentar criar e redirigir
  if (profileError || !profile) {
    console.error('[DashboardLayout] Profile not found for user:', user.id)
    // Tentar criar perfil automaticamente
    await supabase.from('profiles').upsert({
      id:   user.id,
      nome: user.user_metadata?.nome ?? user.email?.split('@')[0] ?? 'Utilizador',
      role: 'publico',
    })
    redirect('/explorar')
  }

  // Não é admin → sem acesso
  if (profile.role !== 'admin') {
    console.warn('[DashboardLayout] Access denied for role:', profile.role)
    redirect('/login?error=sem-permissao')
  }

  return (
    <DashboardWrapper user={{
      email: user.email!,
      nome:  profile.nome,
      role:  profile.role,
    }}>
      {children}
    </DashboardWrapper>
  )
}
