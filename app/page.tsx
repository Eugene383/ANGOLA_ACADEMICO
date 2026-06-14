'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Users, BookOpen, GraduationCap, TrendingUp, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // Verificar se o utilizador está autenticado
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Buscar role do utilizador
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        const role = profile?.role ?? 'publico'

        // Redirecionar conforme o role
        if (role === 'admin') {
          router.push('/admin')
        } else if (role === 'gestor_ies') {
          router.push('/ies/dashboard')
        } else {
          router.push('/')
        }
      }
    }
    
    checkAuth()
  }, [router])

  // Mock data - integrar com API real
  const stats = [
    { label: 'Instituições Activas', value: '350+', icon: Building2, color: 'blue' },
    { label: 'Cursos Disponíveis', value: '5K+', icon: BookOpen, color: 'purple' },
    { label: 'Estudantes Inscritos', value: '500K+', icon: Users, color: 'green' },
    { label: 'Graduados (Anual)', value: '50K+', icon: GraduationCap, color: 'orange' },
  ]

  const features = [
    {
      icon: Globe,
      title: 'Cobertura Nacional',
      description: 'Dados de todas as 18 províncias de Angola em tempo real',
      color: 'from-blue-600 to-blue-400'
    },
    {
      icon: TrendingUp,
      title: 'Equidade de Género',
      description: 'Acompanhamento de feminização com meta de 50% de estudantes mulheres',
      color: 'from-pink-600 to-pink-400'
    },
    {
      icon: Users,
      title: 'Gestão Institucional',
      description: 'Ferramentas para universidades e institutos gerenciarem seus dados',
      color: 'from-green-600 to-green-400'
    },
    {
      icon: BookOpen,
      title: 'Catálogo de Cursos',
      description: 'Exploração completa de 5000+ cursos com filtros por área e nível',
      color: 'from-purple-600 to-purple-400'
    },
  ]

  const highlights = [
    { label: 'Equidade de Género', value: '48%', target: '50%', color: 'from-pink-100 to-pink-50' },
    { label: 'Cursos Presenciais', value: '3.2K', total: '5K', color: 'from-blue-100 to-blue-50' },
    { label: 'Instituições Públicas', value: '180', total: '350', color: 'from-green-100 to-green-50' },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">AngolaAcadémico</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              Registar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 relative">
        <div className="max-w-6xl mx-auto text-center">
          {/* Animated background elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-40 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
          </div>

          <div className="mb-8 inline-block px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-full">
            <p className="text-sm font-semibold text-blue-300">Bem-vindo à Plataforma Nacional</p>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Angola Académico
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Plataforma integrada de dados do ensino superior em Angola. Mapeamento completo de cursos, vagas, inscritos e indicadores académicos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/login"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold transition transform hover:scale-105"
            >
              Aceder à Plataforma
            </Link>
            <Link
              href="/explorar"
              className="px-8 py-4 border-2 border-slate-500 hover:border-blue-400 text-white hover:text-blue-300 rounded-lg font-semibold transition"
            >
              Explorar Dados
            </Link>
          </div>
        </div>

        {/* Main Stats */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center hover:border-blue-500/50 transition">
                <stat.icon className="w-10 h-10 mx-auto mb-4 text-blue-400" />
                <p className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Indicadores Principais</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-8 border border-white/10`}
              >
                <p className="text-slate-600 font-semibold text-sm mb-4">{item.label}</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-slate-800">{item.value}</span>
                  {item.target && <span className="text-sm text-slate-600">/ Meta: {item.target}</span>}
                  {item.total && <span className="text-sm text-slate-600">de {item.total} total</span>}
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                    style={{ width: item.target ? '96%' : '64%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Recursos da Plataforma</h2>
          <p className="text-slate-400 text-center mb-16 max-w-2xl mx-auto">
            Ferramentas completas para explorar, gerenciar e compreender o ensino superior em Angola
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-blue-500/50 hover:bg-slate-800/80 transition"
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data by Province Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-800/50 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Cobertura Geográfica Completa</h2>
          <p className="text-slate-400 mb-16 max-w-2xl">
            Angola Académico cobre as 18 províncias do país com dados de instituições, cursos e indicadores educacionais.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Mapa visual em texto */}
            <div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Cabinda', ies: 3, color: 'from-blue-500 to-blue-600' },
                    { name: 'Zaire', ies: 2, color: 'from-purple-500 to-purple-600' },
                    { name: 'Uíge', ies: 4, color: 'from-pink-500 to-pink-600' },
                    { name: 'Kwanza N.', ies: 5, color: 'from-green-500 to-green-600' },
                    { name: 'Bengo', ies: 6, color: 'from-cyan-500 to-cyan-600' },
                    { name: 'Luanda', ies: 120, color: 'from-red-500 to-red-600' },
                    { name: 'Kwanza S.', ies: 8, color: 'from-yellow-500 to-yellow-600' },
                    { name: 'Malanje', ies: 7, color: 'from-indigo-500 to-indigo-600' },
                    { name: 'Moxico', ies: 2, color: 'from-orange-500 to-orange-600' },
                    { name: 'Cuando C.', ies: 3, color: 'from-teal-500 to-teal-600' },
                    { name: 'Huambo', ies: 15, color: 'from-fuchsia-500 to-fuchsia-600' },
                    { name: 'Bié', ies: 6, color: 'from-rose-500 to-rose-600' },
                    { name: 'Huila', ies: 12, color: 'from-lime-500 to-lime-600' },
                    { name: 'Namibe', ies: 4, color: 'from-violet-500 to-violet-600' },
                    { name: 'Benguela', ies: 14, color: 'from-sky-500 to-sky-600' },
                    { name: 'L. Norte', ies: 5, color: 'from-emerald-500 to-emerald-600' },
                    { name: 'L. Sul', ies: 3, color: 'from-amber-500 to-amber-600' },
                    { name: 'Cunene', ies: 2, color: 'from-cyan-500 to-cyan-600' },
                  ].map((prov) => (
                    <div key={prov.name} className={`bg-gradient-to-br ${prov.color} rounded-lg p-4 cursor-pointer hover:shadow-lg transition group`}>
                      <p className="text-white font-semibold text-sm">{prov.name}</p>
                      <p className="text-white/80 text-xs mt-1">{prov.ies} IES</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/30 rounded-2xl p-8">
                <p className="text-blue-400 text-sm font-semibold mb-2">COBERTURA NACIONAL</p>
                <h3 className="text-4xl font-bold mb-2">18</h3>
                <p className="text-slate-400">Províncias com dados atualizados</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-transparent border border-purple-500/30 rounded-2xl p-8">
                <p className="text-purple-400 text-sm font-semibold mb-2">INSTITUIÇÕES</p>
                <h3 className="text-4xl font-bold mb-2">350+</h3>
                <p className="text-slate-400">IES públicas e privadas registadas</p>
              </div>

              <div className="bg-gradient-to-br from-pink-600/20 to-transparent border border-pink-500/30 rounded-2xl p-8">
                <p className="text-pink-400 text-sm font-semibold mb-2">ALCANCE</p>
                <h3 className="text-4xl font-bold mb-2">500K+</h3>
                <p className="text-slate-400">Estudantes mapeados no sistema</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-semibold mb-2">FUNCIONALIDADES PRINCIPAIS</p>
            <h2 className="text-5xl font-bold">Tudo que precisa<br />em um único lugar</h2>
          </div>

          {/* Feature 1 - Left Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 aspect-square flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent"></div>
              <svg className="w-full h-full text-blue-400 opacity-20" viewBox="0 0 200 200" fill="none" stroke="currentColor">
                <circle cx="100" cy="100" r="80" strokeWidth="1"/>
                <circle cx="100" cy="100" r="60" strokeWidth="1"/>
                <circle cx="100" cy="100" r="40" strokeWidth="1"/>
                <line x1="100" y1="20" x2="100" y2="180" strokeWidth="1"/>
                <line x1="20" y1="100" x2="180" y2="100" strokeWidth="1"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-semibold text-slate-300">Dados Verificados</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-blue-400 text-sm font-semibold mb-3">EXPLORADOR DE DADOS</p>
              <h3 className="text-3xl font-bold mb-6">Pesquise instituições e cursos</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Aceda a uma base de dados completa com todas as instituições de ensino superior, seus cursos, regimes de funcionamento e localização geográfica. Filtros avançados permitem encontrar exatamente o que procura.
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Pesquisa por nome, código ou localização</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Filtros por tipo, natureza e regime</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Comparação entre instituições</span>
                </li>
              </ul>
              <a href="/explorar" className="mt-8 inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                Explorar →
              </a>
            </div>
          </div>

          {/* Feature 2 - Right Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <p className="text-purple-400 text-sm font-semibold mb-3">INDICADORES NACIONAIS</p>
              <h3 className="text-3xl font-bold mb-6">Acompanhe indicadores em tempo real</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Visualize estatísticas consolidadas do ensino superior: número de instituições, cursos ativos, estudantes inscritos e graduados. Acompanhe a taxa de feminização com dados atualizados.
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Estatísticas em tempo real</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Taxa de feminização monitorizada</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Dados desagregados por província</span>
                </li>
              </ul>
              <a href="/admin" className="mt-8 inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition">
                Dashboard →
              </a>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 aspect-square flex items-center justify-center overflow-hidden relative order-first lg:order-last">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-transparent"></div>
              <svg className="w-full h-full text-purple-400 opacity-20" viewBox="0 0 200 200" fill="none" stroke="currentColor">
                <rect x="30" y="150" width="20" height="20" strokeWidth="1"/>
                <rect x="60" y="120" width="20" height="50" strokeWidth="1"/>
                <rect x="90" y="90" width="20" height="80" strokeWidth="1"/>
                <rect x="120" y="100" width="20" height="70" strokeWidth="1"/>
                <rect x="150" y="130" width="20" height="40" strokeWidth="1"/>
                <line x1="20" y1="170" x2="180" y2="170" strokeWidth="2"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-sm font-semibold text-slate-300">Análises Avançadas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 - Left Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 aspect-square flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-transparent"></div>
              <svg className="w-full h-full text-pink-400 opacity-20" viewBox="0 0 200 200" fill="none" stroke="currentColor">
                <path d="M 50 150 Q 100 50, 150 150" strokeWidth="2"/>
                <circle cx="50" cy="150" r="5" fill="currentColor"/>
                <circle cx="100" cy="50" r="5" fill="currentColor"/>
                <circle cx="150" cy="150" r="5" fill="currentColor"/>
                <line x1="20" y1="170" x2="180" y2="170" strokeWidth="2"/>
                <line x1="20" y1="40" x2="20" y2="170" strokeWidth="2"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-pink-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-sm font-semibold text-slate-300">Crescimento</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-pink-400 text-sm font-semibold mb-3">GESTÃO INSTITUCIONAL</p>
              <h3 className="text-3xl font-bold mb-6">Ferramentas para gestores</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Gestores de instituições podem registar novos cursos, atualizar dados de matrículas, graduados e acompanhar indicadores específicos da sua IES. Acesso controlado e seguro.
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Registro e atualização de cursos</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Gestão de dados de matrículas</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Relatórios personalizados</span>
                </li>
              </ul>
              <a href="/ies/dashboard" className="mt-8 inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition">
                Gestor IES →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-pink-600/10 border border-blue-500/50 rounded-3xl p-16 text-center overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-5"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-6">
                Comece a Explorar<br />Dados Agora
              </h2>
              <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Acede à plataforma para explorar instituições, cursos e indicadores. Gerencie seus dados de forma segura e eficiente.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Entrar na Plataforma
                </Link>
                <Link
                  href="/register"
                  className="px-8 py-4 border-2 border-blue-400 text-blue-300 hover:bg-blue-400/10 rounded-lg font-semibold transition"
                >
                  Criar Conta Grátis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-16 pb-16 border-b border-slate-800/50">
            {/* Column 1 - Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">AngolaAcadémico</span>
              </div>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Plataforma nacional oficial de dados do ensino superior em Angola.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition" title="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition" title="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.637 9.949 9.949 0 01-2.828.856 4.947 4.947 0 002.165-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition" title="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                </a>
              </div>
            </div>

            {/* Column 2 - Produtos */}
            <div>
              <h4 className="font-semibold text-white mb-6">Produtos</h4>
              <ul className="space-y-3">
                <li><Link href="/explorar" className="text-slate-400 hover:text-blue-400 transition text-sm">Explorador de Dados</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">Relatórios</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">API Pública</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">Dashboard Admin</Link></li>
              </ul>
            </div>

            {/* Column 3 - Recursos */}
            <div>
              <h4 className="font-semibold text-white mb-6">Recursos</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">Documentação</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">Guia do Utilizador</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">FAQs</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">Suporte</Link></li>
              </ul>
            </div>

            {/* Column 4 - Empresa */}
            <div>
              <h4 className="font-semibold text-white mb-6">Empresa</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">Sobre Nós</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">Carreiras</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">Blog</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-blue-400 transition text-sm">Contacto</Link></li>
              </ul>
            </div>

            {/* Column 5 - Contactos */}
            <div>
              <h4 className="font-semibold text-white mb-6">Contactos</h4>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-500 text-xs font-semibold mb-1 uppercase">Email</p>
                  <a href="mailto:info@angolaacademico.ao" className="text-slate-400 hover:text-blue-400 transition">info@angolaacademico.ao</a>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-semibold mb-1 uppercase">Telefone</p>
                  <p className="text-slate-400">+244 (222) 000-000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm text-slate-400">
            <p>&copy; 2026 AngolaAcadémico. Desenvolvido pelo MES. Todos os direitos reservados.</p>
            <div className="flex flex-wrap gap-6">
              <Link href="#" className="hover:text-blue-400 transition">Privacidade</Link>
              <Link href="#" className="hover:text-blue-400 transition">Termos</Link>
              <Link href="#" className="hover:text-blue-400 transition">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
