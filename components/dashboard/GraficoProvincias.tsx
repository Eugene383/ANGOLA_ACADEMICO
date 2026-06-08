'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { BarChart3 } from 'lucide-react'

interface DadoProvincia {
  nome: string
  codigo: string
  totalIES: number
  totalInscritos: number
}

export default function GraficoProvincias({ dados }: { dados: DadoProvincia[] }) {
  const top10 = [...dados]
    .sort((a, b) => b.totalInscritos - a.totalInscritos)
    .slice(0, 10)
    .map(d => ({ ...d, nome: d.codigo }))

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-gray-400" />
        <h2 className="text-sm font-semibold text-gray-800">Inscritos por província</h2>
        <span className="text-xs text-gray-400">(top 10)</span>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={top10} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="nome"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
              formatter={(v) => [v != null ? Number(v).toLocaleString('pt-AO') : '0', 'Inscritos']}
            />
            <Bar dataKey="totalInscritos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}