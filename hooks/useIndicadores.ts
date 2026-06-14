'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { IndicadoresIES, IndicadoresProvincia } from '@/types/domain.types'

export function useIndicadoresIES(iesId: string, anoLectivoId: string) {
  const [data, setData]       = useState<IndicadoresIES | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!iesId || !anoLectivoId) return

    async function calcular() {
      // Buscar vagas, inscritos e graduados em paralelo
      const [vagasRes, inscritosRes, graduadosRes, cursosRes] = await Promise.all([
        supabase
          .from('vagas')
          .select('vagas_ofertadas, vagas_preenchidas, curso:cursos!inner(ies_id)')
          .eq('ano_lectivo_id', anoLectivoId)
          .eq('curso.ies_id', iesId),

        supabase
          .from('inscritos')
          .select('total, masculino, feminino, curso:cursos!inner(ies_id)')
          .eq('ano_lectivo_id', anoLectivoId)
          .eq('curso.ies_id', iesId),

        supabase
          .from('graduados')
          .select('total, curso:cursos!inner(ies_id)')
          .eq('ano_lectivo_id', anoLectivoId)
          .eq('curso.ies_id', iesId),

        supabase
          .from('cursos')
          .select('id, ies:ies(id, nome, sigla)')
          .eq('ies_id', iesId)
          .eq('activo', true),
      ])

      const vagas      = vagasRes.data ?? []
      const inscritos  = inscritosRes.data ?? []
      const graduados  = graduadosRes.data ?? []
      const iesInfo    = (cursosRes.data?.[0] as any)?.ies

      const totalVagasOfertadas   = vagas.reduce((s, v) => s + v.vagas_ofertadas, 0)
      const totalVagasPreenchidas = vagas.reduce((s, v) => s + v.vagas_preenchidas, 0)
      const totalInscritos        = inscritos.reduce((s, i) => s + i.total, 0)
      const totalFeminino         = inscritos.reduce((s, i) => s + i.feminino, 0)
      const totalGraduados        = graduados.reduce((s, g) => s + g.total, 0)

      setData({
        ies_id:                  iesId,
        ies_nome:                iesInfo?.nome ?? '',
        ies_sigla:               iesInfo?.sigla ?? '',
        total_cursos:            cursosRes.data?.length ?? 0,
        total_vagas_ofertadas:   totalVagasOfertadas,
        total_vagas_preenchidas: totalVagasPreenchidas,
        total_inscritos:         totalInscritos,
        total_graduados:         totalGraduados,
        taxa_preenchimento:      totalVagasOfertadas > 0
                                   ? (totalVagasPreenchidas / totalVagasOfertadas) * 100 : 0,
        taxa_feminizacao:        totalInscritos > 0
                                   ? (totalFeminino / totalInscritos) * 100 : 0,
        taxa_graduacao:          totalInscritos > 0
                                   ? (totalGraduados / totalInscritos) * 100 : 0,
      })

      setLoading(false)
    }

    calcular()
  }, [iesId, anoLectivoId])

  return { indicadores: data, loading }
}

export function useIndicadoresNacionais(anoLectivoId: string) {
  const [data, setData]       = useState<IndicadoresProvincia[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!anoLectivoId) return

    async function calcular() {
      const { data: provincias } = await supabase
        .from('provincias')
        .select(`
          id, nome,
          ies(
            id, natureza,
            cursos(
              id,
              inscritos(total, ano_lectivo_id),
              graduados(total, ano_lectivo_id)
            )
          )
        `)

      const resultado: IndicadoresProvincia[] = (provincias ?? []).map((p: any) => {
        const iesList = p.ies ?? []

        const cursosComAno = iesList.flatMap((i: any) =>
          (i.cursos ?? []).map((c: any) => ({
            ...c,
            inscritos: (c.inscritos ?? []).filter((x: any) => x.ano_lectivo_id === anoLectivoId),
            graduados: (c.graduados ?? []).filter((x: any) => x.ano_lectivo_id === anoLectivoId),
          }))
        )

        return {
          provincia_id:       p.id,
          provincia_nome:     p.nome,
          total_ies:          iesList.length,
          total_ies_publicas: iesList.filter((i: any) => i.natureza === 'publica').length,
          total_ies_privadas: iesList.filter((i: any) => i.natureza === 'privada').length,
          total_cursos:       cursosComAno.length,
          total_inscritos:    cursosComAno.reduce((s: number, c: any) =>
                                s + c.inscritos.reduce((si: number, i: any) => si + i.total, 0), 0),
          total_graduados:    cursosComAno.reduce((s: number, c: any) =>
                                s + c.graduados.reduce((sg: number, g: any) => sg + g.total, 0), 0),
        }
      })

      setData(resultado)
      setLoading(false)
    }

    calcular()
  }, [anoLectivoId])

  return { indicadoresPorProvincia: data, loading }
}