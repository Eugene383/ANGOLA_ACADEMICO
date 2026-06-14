'use client'

import jsPDF from 'jspdf'
import 'jspdf-autotable'

type Column = {
  key: string
  label: string
}

type PublicDataExportProps = {
  title: string
  columns: Column[]
  rows: Array<Record<string, string | number | undefined>>
  csvFilename: string
  pdfFilename: string
}

export default function PublicDataExport({ title, columns, rows, csvFilename, pdfFilename }: PublicDataExportProps) {
  function downloadCSV() {
    const header = columns.map(column => column.label)
    const dataRows = rows.map(row => columns.map(column => String(row[column.key] ?? '')))
    const content = [header, ...dataRows]
      .map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = csvFilename
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  function downloadPDF() {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(title, 14, 20)
    doc.setFontSize(10)
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-AO')}`, 14, 28)

    const body = rows.map(row => columns.map(column => String(row[column.key] ?? '')))

    ;(doc as any).autoTable({
      head: [columns.map(column => column.label)],
      body,
      startY: 36,
      styles: { fontSize: 9 },
      headStyles: { fillColor: '#2563eb', textColor: '#ffffff' },
      alternateRowStyles: { fillColor: '#f3f4f6' },
      margin: { left: 14, right: 14 },
    })

    doc.save(pdfFilename)
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">{title}</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
            Baixe um relatório com os dados exibidos nesta página.
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
