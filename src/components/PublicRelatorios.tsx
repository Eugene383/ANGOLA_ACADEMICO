'use client'

import jsPDF from 'jspdf'
import 'jspdf-autotable'

type PublicRelatoriosProps = {
  totalIES: number
  totalCursos: number
  totalAreas: number
  totalProvincias: number
}

export default function PublicRelatorios({ totalIES, totalCursos, totalAreas, totalProvincias }: PublicRelatoriosProps) {
  function downloadCSV() {
    const header = ['Métrica', 'Valor']
    const rows = [
      ['Instituições activas', String(totalIES)],
      ['Cursos disponíveis', String(totalCursos)],
      ['Províncias cobertas', String(totalProvincias)],
      ['Áreas do conhecimento', String(totalAreas)],
    ]

    const content = [header, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'relatorio-publico.csv'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  function downloadPDF() {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Relatório Público AngolaAcadémico', 14, 20)
    doc.setFontSize(10)
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-AO')}`, 14, 28)

    const body = [
      ['Instituições activas', String(totalIES)],
      ['Cursos disponíveis', String(totalCursos)],
      ['Províncias cobertas', String(totalProvincias)],
      ['Áreas do conhecimento', String(totalAreas)],
    ]

    ;(doc as any).autoTable({
      head: [['Métrica', 'Valor']],
      body,
      startY: 36,
      styles: { fontSize: 10 },
      headStyles: { fillColor: '#2563eb', textColor: '#ffffff' },
      alternateRowStyles: { fillColor: '#f3f4f6' },
      margin: { left: 14, right: 14 },
    })

    doc.save('relatorio-publico-angolaacademico.pdf')
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">Exportar dados públicos</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
            Baixe um relatório resumido dos dados públicos do sistema em PDF ou CSV.
          </p>
        </div>

        <div className="flex flex-col xs:flex-row gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={downloadCSV}
            className="inline-flex items-center justify-center bg-slate-800 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-slate-900 font-medium"
          >
            CSV
          </button>
          <button
            type="button"
            onClick={downloadPDF}
            className="inline-flex items-center justify-center bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-700 font-medium"
          >
            PDF
          </button>
        </div>
      </div>
    </div>
  )
}
