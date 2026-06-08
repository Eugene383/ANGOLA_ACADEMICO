import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'AngolaAcadémico — Plataforma de Dados do Ensino Superior',
    template: '%s | AngolaAcadémico',
  },
  description:
    'Plataforma integrada de dados do ensino superior em Angola. Mapeamento de cursos, vagas, inscritos, graduados e indicadores académicos por IES e província.',
  keywords: ['ensino superior', 'Angola', 'universidades', 'cursos', 'MES', 'académico'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  )
}
