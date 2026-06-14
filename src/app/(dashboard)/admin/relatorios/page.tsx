"use client"

import React, { useEffect, useState } from 'react'
import { BarChart3, Download, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAnosLectivos, useIES } from '@/hooks'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Minimal JSX namespace declaration to satisfy TypeScript in this file
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

type RelatorioLinha = {
  ies: string
  provincia: string
  curso: string
  nivel: string
  regime: string
  vagas_ofertadas: number
  vagas_preenchidas: number
  inscritos: number
  graduados: number
}

export default function RelatoriosPage() {
  const [dados, setDados] = useState<RelatorioLinha[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const { anosLectivos, anoActivo } = useAnosLectivos()
  const { ies } = useIES()

  const [selectedAnoId, setSelectedAnoId] = useState<string | null>(anoActivo?.id ?? null)
  const [selectedIesId, setSelectedIesId] = useState<string>('')

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      const select = `
        id,
        nome,
        regime,
        nivel:niveis_ensino(id,nome),
        ies:ies(id,nome,provincia:provincias(id,nome)),
        vagas:vagas(vagas_ofertadas,vagas_preenchidas,ano_lectivo_id),
        inscritos:inscritos(total,ano_lectivo_id),
        graduados:graduados(total,ano_lectivo_id)
      `

      let query = supabase.from('cursos').select(select)
      if (selectedIesId) query = query.eq('ies_id', selectedIesId)

      const { data, error } = await query
      if (!mounted) return

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      const rows: RelatorioLinha[] = (data ?? []).map((item: any) => {
        const iesObj = item.ies ?? {}
        const provinciaObj = iesObj.provincia ?? {}

        const filtrarAno = (arr: any[] | undefined) =>
          (arr ?? []).filter(a => !selectedAnoId || a.ano_lectivo_id === selectedAnoId)

        const vagasOfertadas = filtrarAno(item.vagas).reduce((s: number, v: any) => s + (v.vagas_ofertadas ?? 0), 0)
        const vagasPreenchidas = filtrarAno(item.vagas).reduce((s: number, v: any) => s + (v.vagas_preenchidas ?? 0), 0)
        const inscritosTotal = filtrarAno(item.inscritos).reduce((s: number, v: any) => s + (v.total ?? 0), 0)
        const graduadosTotal = filtrarAno(item.graduados).reduce((s: number, v: any) => s + (v.total ?? 0), 0)

        return {
          ies: iesObj.nome ?? 'N/A',
          provincia: provinciaObj.nome ?? 'N/A',
          curso: item.nome ?? 'N/A',
          nivel: item.nivel?.nome ?? 'N/A',
          regime: item.regime ?? 'N/A',
          vagas_ofertadas: vagasOfertadas,
          vagas_preenchidas: vagasPreenchidas,
          inscritos: inscritosTotal,
          graduados: graduadosTotal,
        }
      })

      setDados(rows)
      setLoading(false)
    }

    load()

    return () => {
      mounted = false
    }
  }, [selectedAnoId, selectedIesId])

  function downloadCSV() {
    if (!dados || dados.length === 0) return

    const header = ['IES', 'Província', 'Curso', 'Nível', 'Regime', 'Vagas Ofertadas', 'Vagas Preenchidas', 'Inscritos', 'Graduados']
    const rows = dados.map(r => [r.ies, r.provincia, r.curso, r.nivel, r.regime, String(r.vagas_ofertadas), String(r.vagas_preenchidas), String(r.inscritos), String(r.graduados)])

    const content = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""') }"`).join(',')).join('\n')

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'relatorio-academico.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function downloadPDF() {
    if (!dados || dados.length === 0) return

    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Relatório Académico AngolaAcadémico', 14, 20)
    doc.setFontSize(10)
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-AO')}`, 14, 28)

    const body = dados.map(r => [r.ies, r.provincia, r.curso, r.nivel, r.regime, String(r.vagas_ofertadas), String(r.vagas_preenchidas), String(r.inscritos), String(r.graduados)])

    ;(doc as any).autoTable({
      head: [[ 'IES', 'Província', 'Curso', 'Nível', 'Regime', 'Vagas Ofertadas', 'Vagas Preenchidas', 'Inscritos', 'Graduados' ]],
      body,
      startY: 36,
      styles: { fontSize: 8 },
      headStyles: { fillColor: '#2563eb', textColor: '#ffffff' },
      alternateRowStyles: { fillColor: '#f3f4f6' },
      margin: { left: 14, right: 14 },
    })

    doc.save('relatorio-academico.pdf')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-500 mt-0.5">Relatórios e exportações de dados académicos</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">Relatório Académico</h2>
              <p className="text-sm text-gray-500">Exporta dados de cursos, vagas, inscritos e graduados.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Ano lectivo</label>
              <select value={selectedAnoId ?? ''} onChange={e => setSelectedAnoId(e.target.value || null)} className="px-3 py-2 border rounded-lg text-sm">
                <option value="">Todos</option>
                {anosLectivos.map(a => <option key={a.id} value={a.id}>{a.ano}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">IES</label>
              <select value={selectedIesId} onChange={e => setSelectedIesId(e.target.value)} className="px-3 py-2 border rounded-lg text-sm max-w-xs">
                <option value="">Todas</option>
                {ies.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button type="button" onClick={downloadCSV} disabled={loading || !!error} className="inline-flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900 disabled:bg-slate-300 disabled:text-slate-600">
                <FileText className="w-4 h-4" /> CSV
              </button>
              <button type="button" onClick={downloadPDF} disabled={loading || !!error} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-blue-200 disabled:text-slate-500">
                <Download className="w-4 h-4" /> PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {loading ? (
          <div className="p-8 text-center text-gray-600">A carregar dados...</div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">Erro ao carregar relatório: {error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-gray-700">
                  <th className="px-3 py-2">IES</th>
                  <th className="px-3 py-2">Província</th>
                  <th className="px-3 py-2">Curso</th>
                  <th className="px-3 py-2">Nível</th>
                  <th className="px-3 py-2">Regime</th>
                  <th className="px-3 py-2">Vagas ofertadas</th>
                  <th className="px-3 py-2">Vagas preenchidas</th>
                  <th className="px-3 py-2">Inscritos</th>
                  <th className="px-3 py-2">Graduados</th>
                </tr>
              </thead>
              <tbody>
                {dados.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-3 py-2 text-gray-800">{row.ies}</td>
                    <td className="px-3 py-2 text-gray-800">{row.provincia}</td>
                    <td className="px-3 py-2 text-gray-800">{row.curso}</td>
                    <td className="px-3 py-2 text-gray-800">{row.nivel}</td>
                    <td className="px-3 py-2 text-gray-800">{row.regime}</td>
                    <td className="px-3 py-2 text-gray-800">{row.vagas_ofertadas}</td>
                    <td className="px-3 py-2 text-gray-800">{row.vagas_preenchidas}</td>
                    <td className="px-3 py-2 text-gray-800">{row.inscritos}</td>
                    <td className="px-3 py-2 text-gray-800">{row.graduados}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {dados.length === 0 && <div className="p-4 text-gray-600">Nenhum dado disponível para exportar.</div>}
          </div>
        )}
      </div>
    </div>
  )
}
