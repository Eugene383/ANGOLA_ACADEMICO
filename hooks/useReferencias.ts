'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Provincia, AnoLectivo, AreaConhecimento, NivelEnsino } from '@/types/domain.types'

export function useProvincias() {
  const [data, setData]     = useState<Provincia[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('provincias')
      .select('*')
      .order('nome')
      .then(({ data }) => {
        setData(data ?? [])
        setLoading(false)
      })
  }, [])

  return { provincias: data, loading }
}

export function useAnosLectivos() {
  const [data, setData]     = useState<AnoLectivo[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('anos_lectivos')
      .select('*')
      .order('ano', { ascending: false })
      .then(({ data }) => {
        setData(data ?? [])
        setLoading(false)
      })
  }, [])

  const anoActivo = data.find(a => a.activo) ?? null

  return { anosLectivos: data, anoActivo, loading }
}

export function useAreasConhecimento() {
  const [data, setData]     = useState<AreaConhecimento[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('areas_conhecimento')
      .select('*')
      .is('parent_id', null)   // só áreas de nível 1
      .order('codigo_isced')
      .then(({ data }) => {
        setData(data ?? [])
        setLoading(false)
      })
  }, [])

  return { areas: data, loading }
}

export function useNiveisEnsino() {
  const [data, setData]     = useState<NivelEnsino[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('niveis_ensino')
      .select('*')
      .order('ordem')
      .then(({ data }) => {
        setData(data ?? [])
        setLoading(false)
      })
  }, [])

  return { niveis: data, loading }
}