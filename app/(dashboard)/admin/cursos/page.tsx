// src/app/(dashboard)/admin/cursos/page.tsx
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function CursosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Cursos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gestão de cursos por IES e área do conhecimento</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-base font-semibold text-gray-800 mb-2">Módulo em desenvolvimento</h2>
        <p className="text-sm text-gray-400 max-w-sm mx-auto">
          A listagem e gestão de cursos estará disponível em breve.
        </p>
      </div>
    </div>
  )
}
