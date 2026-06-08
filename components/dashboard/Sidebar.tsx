'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  GraduationCap,
} from 'lucide-react'

const navItems = [
  {
    label: 'Visão geral',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Instituições',
    href: '/admin/ies',
    icon: Building2,
  },
  {
    label: 'Cursos',
    href: '/admin/cursos',
    icon: BookOpen,
  },
  {
    label: 'Utilizadores',
    href: '/admin/utilizadores',
    icon: Users,
  },
  {
    label: 'Relatórios',
    href: '/admin/relatorios',
    icon: BarChart3,
  },
  {
    label: 'Definições',
    href: '/admin/definicoes',
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">AngolaAcadémico</p>
            <p className="text-xs text-gray-400">Administração</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(item => {
          const active = mounted && (pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href)))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className={clsx('w-4 h-4', active ? 'text-blue-600' : 'text-gray-400')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Rodapé */}
      <div className="px-3 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-400 px-3">v1.0.0 — MES Angola</p>
      </div>
    </aside>
  )
}