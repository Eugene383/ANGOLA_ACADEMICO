export type UserRole = 'admin' | 'gestor_ies' | 'publico'

export interface Profile {
  id: string
  nome: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  profile: Profile
}