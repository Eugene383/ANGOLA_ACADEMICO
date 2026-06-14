'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Building2, Users, BookOpen, GraduationCap, TrendingUp, Globe, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Imagens de carrossel — estudantes africanos (Unsplash, licença livre)
const carouselImages = [
  {
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80',
    caption: 'Estudantes no campus universitário',
  },
  {
    url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&q=80',
    caption: 'Aprendizagem e crescimento académico',
  },
  {
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80',
    caption: 'O futuro do ensino superior em Angola',
  },
  {
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80',
    caption: 'Conhecimento que transforma vidas',
  },
]

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [iesPreview, setIesPreview] = useState<any[]>([])
  const [cursosPreview, setCursosPreview] = useState<any[]>([])
  const [loadingPreview, setLoadingPreview] = useState(true)

  // Verificar sessão — mas NÃO redirecionar automaticamente
  useEffect(() => {
    setMounted(true)
    const supabase = createClient()

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        setIsLoggedIn(true)
        setUserRole(profile?.role ?? 'publico')
      } else {
        setIsLoggedIn(false)
        setUserRole(null)
      }
    }

    checkSession()

    // Listener para mudanças de sessão (logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsLoggedIn(false)
        setUserRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Carregar preview de IES e cursos
  useEffect(() => {
    const supabase = createClient()
    async function loadPreview() {
      setLoadingPreview(true)
      const [iesRes, cursosRes] = await Promise.all([
        supabase.from('ies').select('id,nome,sigla').order('nome').limit(6),
        supabase.from('cursos').select('id,nome,ies(id,nome),nivel:niveis_ensino(nome)').eq('activo', true).order('nome').limit(6),
      ])
      setIesPreview(iesRes.data ?? [])
      setCursosPreview(cursosRes.data ?? [])
      setLoadingPreview(false)
    }
    loadPreview()
  }, [])

  // Auto-avançar carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(i => (i + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const prevSlide = () => setCarouselIndex(i => (i - 1 + carouselImages.length) % carouselImages.length)
  const nextSlide = () => setCarouselIndex(i => (i + 1) % carouselImages.length)

  // Link do botão principal conforme estado de sessão
  const dashboardHref =
    userRole === 'admin' ? '/admin'
    : userRole === 'gestor_ies' ? '/ies/dashboard'
    : isLoggedIn ? '/explorar'
    : '/login'

  const stats = [
    { label: 'Instituições Activas', value: '350+', icon: Building2 },
    { label: 'Cursos Disponíveis', value: '5K+', icon: BookOpen },
    { label: 'Estudantes Inscritos', value: '500K+', icon: Users },
    { label: 'Graduados (Anual)', value: '50K+', icon: GraduationCap },
  ]

  const features = [
    { icon: Globe, title: 'Cobertura Nacional', description: 'Dados de todas as 18 províncias de Angola', color: 'from-blue-600 to-blue-400' },
    { icon: TrendingUp, title: 'Equidade de Género', description: 'Acompanhamento de feminização com meta de 50%', color: 'from-pink-600 to-pink-400' },
    { icon: Users, title: 'Gestão Institucional', description: 'Ferramentas para universidades gerirem os seus dados', color: 'from-green-600 to-green-400' },
    { icon: BookOpen, title: 'Catálogo de Cursos', description: 'Exploração de 5000+ cursos com filtros por área e nível', color: 'from-purple-600 to-purple-400' },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm sm:text-lg truncate">AngolaAcadémico</span>
          </div>
          <div className="flex gap-2 sm:gap-3 items-center flex-shrink-0">
            {isLoggedIn ? (
              <Link
                href={dashboardHref}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Painel
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition">
                  Entrar
                </Link>
                <Link href="/login" className="sm:hidden px-3 py-2 text-xs font-medium text-slate-300 hover:text-white transition">
                  Entrar
                </Link>
                <Link href="/register" className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                  Registar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero com Carrossel ── */}
      <section className="relative h-screen min-h-[500px] sm:min-h-[600px] flex items-center justify-center overflow-hidden">

        {/* Slides de fundo */}
        {carouselImages.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === carouselIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={img.url}
              alt={img.caption}
              className="w-full h-full object-cover"
            />
            {/* Overlay escuro para legibilidade */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/90" />
          </div>
        ))}

        {/* Controlos do carrossel */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-8 sm:w-10 h-8 sm:h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-8 sm:w-10 h-8 sm:h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition backdrop-blur-sm"
        >
          <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>

        {/* Pontos indicadores */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {carouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCarouselIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === carouselIndex ? 'bg-white w-6' : 'bg-white/40'}`}
            />
          ))}
        </div>

        {/* Conteúdo Hero */}
        <div className="relative z-10 text-center px-3 sm:px-4 max-w-4xl mx-auto pt-16 sm:pt-0">
          <div className="mb-4 sm:mb-6 inline-block px-3 sm:px-4 py-2 bg-blue-600/30 border border-blue-500/50 rounded-full backdrop-blur-sm">
            <p className="text-xs sm:text-sm font-semibold text-blue-300">Bem-vindo à Plataforma Nacional</p>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg leading-tight">
            Angola Académico
          </h1>

          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-slate-200 mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Plataforma integrada de dados do ensino superior em Angola. Mapeamento completo de cursos, vagas, inscritos e indicadores académicos.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href={dashboardHref}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold transition transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              {isLoggedIn ? 'Ir para o painel' : 'Aceder à Plataforma'}
            </Link>
            <Link
              href="/explorar"
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/40 hover:border-blue-400 text-white hover:text-blue-300 rounded-lg font-semibold transition backdrop-blur-sm text-sm sm:text-base"
            >
              Explorar Dados
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg sm:rounded-2xl p-4 sm:p-8 text-center hover:border-blue-500/50 transition">
              <stat.icon className="w-8 sm:w-10 h-8 sm:h-10 mx-auto mb-2 sm:mb-4 text-blue-400" />
              <p className="text-xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 line-clamp-1">{stat.value}</p>
              <p className="text-slate-400 text-xs sm:text-sm line-clamp-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Instituições e Cursos em destaque ── */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-slate-900/60">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Instituições e Cursos em destaque</h2>
          {loadingPreview ? (
            <div className="p-6 text-slate-400 text-center">A carregar...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Instituições</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {iesPreview.map(ies => (
                    <div key={ies.id} className="bg-slate-800/40 border border-slate-700 rounded-lg p-3 sm:p-4">
                      <p className="font-semibold text-white text-sm sm:text-base line-clamp-2">{ies.nome}</p>
                      {ies.sigla && <p className="text-slate-400 text-xs sm:text-sm">{ies.sigla}</p>}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Cursos</h3>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {cursosPreview.map(cr => (
                    <div key={cr.id} className="bg-slate-800/40 border border-slate-700 rounded-lg p-3 sm:p-4">
                      <p className="font-semibold text-white text-sm sm:text-base line-clamp-2">{cr.nome}</p>
                      <p className="text-slate-400 text-xs sm:text-sm line-clamp-1">{cr.ies?.nome ?? ''}{cr.nivel?.nome ? ` · ${cr.nivel.nome}` : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 sm:mt-8">
            <Link href="/explorar" className="px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium inline-block">
              Ver todos os dados públicos
            </Link>
          </div>
        </div>
      </section>

      {/* ── Recursos ── */}
      <section className="py-16 sm:py-24 px-3 sm:px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold text-center mb-3 sm:mb-4">Recursos da Plataforma</h2>
          <p className="text-slate-400 text-center mb-10 sm:mb-16 max-w-2xl mx-auto text-sm sm:text-base">
            Ferramentas completas para explorar, gerir e compreender o ensino superior em Angola
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-slate-800/50 border border-slate-700 rounded-lg sm:rounded-2xl p-6 sm:p-8 hover:border-blue-500/50 hover:bg-slate-800/80 transition"
              >
                <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition`}>
                  <feature.icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 sm:py-10 px-3 sm:px-4 border-t border-slate-800 text-center text-slate-500 text-xs sm:text-sm">
        © {new Date().getFullYear()} AngolaAcadémico · Plataforma Nacional de Dados do Ensino Superior
      </footer>

    </div>
  )
}
