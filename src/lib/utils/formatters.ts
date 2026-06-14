export function formatarNumero(n: number): string {
  return new Intl.NumberFormat('pt-AO').format(n)
}

export function formatarPercentagem(n: number, decimais = 1): string {
  return `${n.toFixed(decimais)}%`
}

export function formatarTaxa(valor: number): {
  label: string
  cor: 'verde' | 'amarelo' | 'vermelho'
} {
  if (valor >= 70) return { label: formatarPercentagem(valor), cor: 'verde' }
  if (valor >= 40) return { label: formatarPercentagem(valor), cor: 'amarelo' }
  return { label: formatarPercentagem(valor), cor: 'vermelho' }
}

// Mapa de cores Tailwind para taxas
export const coresTaxa = {
  verde:    'text-green-700 bg-green-50',
  amarelo:  'text-yellow-700 bg-yellow-50',
  vermelho: 'text-red-700 bg-red-50',
} as const