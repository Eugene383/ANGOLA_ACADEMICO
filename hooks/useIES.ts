'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { IESComProvincia, FiltrosConsulta } from '@/types/domain.types'

export function useIES(filtros?: FiltrosConsulta) {
  const [data, setData]       = useState<IESComProvincia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const supabase = createClient()

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('ies')
      .select(`
        *,
        provincia:provincias(id, nome, codigo)
      `)
      .eq('activa', true)
      .order('nome')

    if (filtros?.provincia_id) {
      query = query.eq('provincia_id', filtros.provincia_id)
    }
    if (filtros?.natureza) {
      query = query.eq('natureza', filtros.natureza)
    }

    const { data, error } = await query

    if (error) setError(error.message)
    else setData((data as IESComProvincia[]) ?? [])

    setLoading(false)
  }, [filtros?.provincia_id, filtros?.natureza])

  useEffect(() => { fetch() }, [fetch])

  return { ies: data, loading, error, refetch: fetch }
}

export function useIESById(id: string) {
  const [data, setData]       = useState<IESComProvincia | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!id) return

    supabase
      .from('ies')
      .select(`
        *,
        provincia:provincias(id, nome, codigo)
      `)
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setData(data as IESComProvincia)
        setLoading(false)
      })
  }, [id])

  return { ies: data, loading }
}

// IES do utilizador autenticado (gestor)
export function useMinhasIES(userId: string) {
  const [data, setData]       = useState<IESComProvincia[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    supabase
      .from('ies_usuarios')
      .select(`
        ies:ies(
          *,
          provincia:provincias(id, nome, codigo)
        )
      `)
      .eq('user_id', userId)
      .then(({ data }) => {
        const lista = data?.map(r => r.ies).flat() ?? []
        setData(lista as IESComProvincia[])
        setLoading(false)
      })
  }, [userId])

  return { minhasIES: data, loading }
}