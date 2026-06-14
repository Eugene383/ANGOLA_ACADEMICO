import type { Database } from './database.types'

// Atalhos para as linhas das tabelas
export type Provincia        = Database['public']['Tables']['provincias']['Row']
export type IES              = Database['public']['Tables']['ies']['Row']
export type Curso            = Database['public']['Tables']['cursos']['Row']
export type AreaConhecimento = Database['public']['Tables']['areas_conhecimento']['Row']
export type NivelEnsino      = Database['public']['Tables']['niveis_ensino']['Row']
export type AnoLectivo       = Database['public']['Tables']['anos_lectivos']['Row']
export type Vaga             = Database['public']['Tables']['vagas']['Row']
export type Inscrito         = Database['public']['Tables']['inscritos']['Row']
export type Graduado         = Database['public']['Tables']['graduados']['Row']
export type Profile          = Database['public']['Tables']['profiles']['Row']

// Tipos de inserção
export type IESInsert     = Database['public']['Tables']['ies']['Insert']
export type CursoInsert   = Database['public']['Tables']['cursos']['Insert']
export type VagaInsert    = Database['public']['Tables']['vagas']['Insert']
export type InscritoInsert = Database['public']['Tables']['inscritos']['Insert']
export type GraduadoInsert = Database['public']['Tables']['graduados']['Insert']

// Tipos compostos (joins frequentes)
export type CursoComDetalhes = Curso & {
  ies: Pick<IES, 'id' | 'nome' | 'sigla'>
  area: Pick<AreaConhecimento, 'id' | 'nome' | 'codigo_isced'>
  nivel: Pick<NivelEnsino, 'id' | 'nome' | 'codigo_isced'>
  vagas?: Array<Pick<Vaga, 'vagas_ofertadas' | 'vagas_preenchidas' | 'ano_lectivo_id'>>
  inscritos?: Array<Pick<Inscrito, 'total' | 'ano_lectivo_id'>>
  graduados?: Array<Pick<Graduado, 'total' | 'ano_lectivo_id'>>
}

export type IESComProvincia = IES & {
  provincia: Pick<Provincia, 'id' | 'nome' | 'codigo'>
}

export type VagaComCurso = Vaga & {
  curso: CursoComDetalhes
}

// Indicadores calculados
export type IndicadoresIES = {
  ies_id: string
  ies_nome: string
  ies_sigla: string
  total_cursos: number
  total_vagas_ofertadas: number
  total_vagas_preenchidas: number
  total_inscritos: number
  total_graduados: number
  taxa_preenchimento: number   // vagas_preenchidas / vagas_ofertadas * 100
  taxa_feminizacao: number     // feminino / total inscritos * 100
  taxa_graduacao: number       // graduados / inscritos * 100
}

export type IndicadoresProvincia = {
  provincia_id: string
  provincia_nome: string
  total_ies: number
  total_ies_publicas: number
  total_ies_privadas: number
  total_cursos: number
  total_inscritos: number
  total_graduados: number
}

// Filtros reutilizáveis
export type FiltrosConsulta = {
  provincia_id?: string
  natureza?: 'publica' | 'privada' | 'publica_privada'
  area_id?: string
  nivel_id?: string
  ano_lectivo_id?: string
  regime?: 'presencial' | 'a_distancia' | 'misto'
}