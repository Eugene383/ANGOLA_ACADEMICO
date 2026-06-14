'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

const registerSchema = loginSchema.extend({
  nome:            z.string().min(2, 'Nome obrigatório'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords não coincidem',
  path: ['confirmPassword'],
})

export type FormState = {
  error?:   string
  success?: boolean
  debug?:   string  // apenas para desenvolvimento
}

export async function loginAction(
  _: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    email:    formData.get('email')    as string,
    password: formData.get('password') as string,
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()

  // 1. Autenticar
  const { data, error: authError } = await supabase.auth.signInWithPassword(parsed.data)
  if (authError) {
    console.error('[loginAction] authError:', authError.message)
    return { error: 'Credenciais inválidas. Verifica o email e a password.' }
  }

  // 2. Buscar perfil
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, nome')
    .eq('id', data.user.id)
    .single()

  console.log('[loginAction] user:', data.user.email)
  console.log('[loginAction] profile:', profile)
  console.log('[loginAction] profileError:', profileError?.message)

  // 3. Se não tem perfil → criar automaticamente como publico
  if (!profile || profileError) {
    console.warn('[loginAction] Perfil não encontrado, a criar...')
    await supabase.from('profiles').upsert({
      id:   data.user.id,
      nome: data.user.user_metadata?.nome ?? data.user.email?.split('@')[0] ?? 'Utilizador',
      role: 'publico',
    })
    // Após criar perfil, vai para explorar
    redirect('/explorar')
  }

  // 4. Redirigir conforme role
  console.log('[loginAction] role:', profile.role, '→ a redirigir...')

  if (profile.role === 'admin') {
    redirect('/admin')
  } else if (profile.role === 'gestor_ies') {
    redirect('/ies/dashboard')
  } else {
    redirect('/explorar')
  }
}

export async function registerAction(
  _: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    nome:            formData.get('nome')            as string,
    email:           formData.get('email')           as string,
    password:        formData.get('password')        as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const { data, error } = await supabase.auth.signUp({
    email:    parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { nome: parsed.data.nome },
      emailRedirectTo: `${appUrl}/auth/callback`,
    },
  })

  console.log('[registerAction] signUp data:', data?.user?.email)
  console.log('[registerAction] error:', error?.message)

  if (error) return { error: error.message }

  // Se o Supabase não exige confirmação de email, o utilizador já está autenticado
  // Criar perfil manualmente se o trigger não funcionou
  if (data.user && data.session) {
    const { error: profileError } = await supabase.from('profiles').upsert({
      id:   data.user.id,
      nome: parsed.data.nome,
      role: 'publico',
    })
    console.log('[registerAction] profile upsert error:', profileError?.message)

    // Já autenticado → redirigir directamente
    redirect('/explorar')
  }

  // Confirmação de email pendente
  return { success: true }
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
