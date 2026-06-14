'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { FormState } from './auth.actions'

// ── Criar IES ──────────────────────────────────────────────
const criarIESSchema = z.object({
  id:           z.string().uuid().optional(),
  nome:         z.string().min(3, 'Nome obrigatório'),
  sigla:        z.string().min(2).max(10),
  tipo:         z.enum(['universidade', 'instituto_superior', 'escola_superior', 'academia']),
  natureza:     z.enum(['publica', 'privada', 'publica_privada']),
  provincia_id: z.string().uuid('Selecciona uma província'),
  ano_fundacao: z.string().optional(),
  website:      z.string().url().optional().or(z.literal('')),
  email:        z.string().email().optional().or(z.literal('')),
})

export async function criarIESAction(
  _: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Sem permissão' }

  const raw = Object.fromEntries(formData)
  const parsed = criarIESSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const admin = createAdminClient()
  const payload = {
    nome: parsed.data.nome,
    sigla: parsed.data.sigla,
    tipo: parsed.data.tipo,
    natureza: parsed.data.natureza,
    provincia_id: parsed.data.provincia_id,
    ano_fundacao: parsed.data.ano_fundacao ? parseInt(parsed.data.ano_fundacao) : null,
    website: parsed.data.website || null,
    email: parsed.data.email || null,
  }

  const result = parsed.data.id
    ? await admin.from('ies').update(payload).eq('id', parsed.data.id)
    : await admin.from('ies').insert(payload)

  if (result.error) return { error: result.error.message }

  revalidatePath('/admin')
  revalidatePath('/admin/ies')
  return { success: true }
}

// ── Promover utilizador ────────────────────────────────────
export async function promoverUtilizadorAction(
  _: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = formData.get('userId') as string
  const role   = formData.get('role') as string

  if (!userId || !role) return { error: 'Dados inválidos' }

  const admin = createAdminClient()
  const { error } = await admin
    .from('profiles')
    .update({ role: role as any })
    .eq('id', userId)

  if (error) return { error: error.message }

  revalidatePath('/admin/utilizadores')
  return { success: true }
}

// ── Atribuir IES a utilizador ──────────────────────────────
export async function atribuirIESAction(
  _: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = formData.get('userId') as string
  const iesId  = formData.get('iesId')  as string

  if (!userId || !iesId) return { error: 'Dados inválidos' }

  const admin = createAdminClient()
  const { error } = await admin
    .from('ies_usuarios')
    .upsert({ user_id: userId, ies_id: iesId, role: 'editor' })

  if (error) return { error: error.message }

  revalidatePath('/admin/utilizadores')
  return { success: true }
}
