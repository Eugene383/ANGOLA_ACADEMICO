'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CursoComDetalhes, FiltrosConsulta } from '@/types/domain.types'

export function useCursos(filtros?: FiltrosConsulta & { ies_id?: string }) {
  const [data, setData]       = useState<CursoComDetalhes[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const supabase = createClient()

  const fetch = useCallback(async () => {
    setLoading(true)

    let query = supabase
      .from('cursos')
      .select(`
        *,
        ies:ies(id, nome, sigla),
        area:areas_conhecimento(id, nome, codigo_isced),
<<<<<<< HEAD:src/hooks/useCursos.ts
        nivel:niveis_ensino(id, nome, codigo_isced),
        vagas(vagas_ofertadas,vagas_preenchidas,ano_lectivo_id),
        inscritos(total,ano_lectivo_id),
        graduados(total,ano_lectivo_id)
=======
        nivel:niveis_ensino(id, nome, codigo_isced)
>>>>>>> 9d0e92bd8298e8343bddeae7d5250d49f09d22fc:hooks/useCursos.ts
      `)
      .eq('activo', true)
      .order('nome')

    if (filtros?.ies_id)  query = query.eq('ies_id', filtros.ies_id)
    if (filtros?.area_id) query = query.eq('area_id', filtros.area_id)
    if (filtros?.nivel_id) query = query.eq('nivel_id', filtros.nivel_id)
    if (filtros?.regime)  query = query.eq('regime', filtros.regime)

    // Filtro por província (via join com IES)
    if (filtros?.provincia_id) {
      const { data: iesIds } = await supabase
        .from('ies')
        .select('id')
        .eq('provincia_id', filtros.provincia_id)
      const ids = iesIds?.map(i => i.id) ?? []
      if (ids.length) query = query.in('ies_id', ids)
    }

    const { data, error } = await query

    if (error) setError(error.message)
    else setData((data as CursoComDetalhes[]) ?? [])

    setLoading(false)
  }, [
    filtros?.ies_id,
    filtros?.area_id,
    filtros?.nivel_id,
    filtros?.regime,
    filtros?.provincia_id,
  ])

  useEffect(() => { fetch() }, [fetch])

  return { cursos: data, loading, error, refetch: fetch }
}