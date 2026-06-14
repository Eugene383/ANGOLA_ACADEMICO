import { clsx } from 'clsx'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  titulo: string
  valor: string | number
  subtitulo?: string
  icon: LucideIcon
  cor?: 'blue' | 'green' | 'purple' | 'amber'
  tendencia?: { valor: number; label: string }
}

const cores = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   badge: 'bg-blue-100 text-blue-700' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-600',  badge: 'bg-green-100 text-green-700' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
  amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  badge: 'bg-amber-100 text-amber-700' },
}

export default function StatCard({
  titulo, valor, subtitulo, icon: Icon, cor = 'blue', tendencia
}: StatCardProps) {
  const c = cores[cor]
  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-5">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className={clsx('w-8 sm:w-9 h-8 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0', c.bg)}>
          <Icon className={clsx('w-4 sm:w-5 h-4 sm:h-5', c.icon)} />
        </div>
        {tendencia && (
          <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap', c.badge)}>
            {tendencia.valor > 0 ? '+' : ''}{tendencia.valor}%
            <span className="hidden sm:inline"> {tendencia.label}</span>
          </span>
        )}
      </div>
      <p className="text-xl sm:text-2xl font-semibold text-gray-900 mb-0.5 break-words">
        {typeof valor === 'number' ? valor.toLocaleString('pt-AO') : valor}
      </p>
      <p className="text-xs sm:text-sm font-medium text-gray-700 line-clamp-2">{titulo}</p>
      {subtitulo && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{subtitulo}</p>}
    </div>
  )
}