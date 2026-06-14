'use client'

import { signOutAction } from '@/lib/actions/auth.actions'
import { LogOut, User } from 'lucide-react'

interface HeaderProps {
  user: { email: string; nome?: string | null; role?: string | null }
}

export default function Header({ user }: HeaderProps) {
  return (
<<<<<<< HEAD:src/components/dashboard/Header.tsx
    <header className="h-14 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between flex-shrink-0">
      <div />
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2">
=======
    <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
>>>>>>> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:components/dashboard/Header.tsx
          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800 leading-tight">
              {user.nome ?? user.email}
            </p>
            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
          </div>
        </div>
<<<<<<< HEAD:src/components/dashboard/Header.tsx
        
        {/* Mobile: Icon only */}
        <div className="sm:hidden">
          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
        </div>

=======
>>>>>>> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:components/dashboard/Header.tsx
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
<<<<<<< HEAD:src/components/dashboard/Header.tsx
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
=======
          >
            <LogOut className="w-4 h-4" />
            Sair
>>>>>>> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:components/dashboard/Header.tsx
          </button>
        </form>
      </div>
    </header>
  )
}