import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Game } from '@/types/game'
import { fetchGames } from '@/services/api'

const getStatusOrder = (status: Game['status']): number => {
  switch (status) {
    case 'live':
      return 1
    case 'upcoming':
      return 2
    case 'finished':
      return 3
    default:
      return 4
  }
}

export const useGamesStore = defineStore('games', () => {
  const games = ref<Game[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const sportFilter = ref<'all' | Game['sport']>('all')
  const statusFilter = ref<'all' | Game['status']>('all')

  const loadGames = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await fetchGames()
      games.value = data
      sortGames(games.value)
    } catch (err) {
      console.log('err-fetchGames', err)

      error.value = 'Failed to load games'
    } finally {
      loading.value = false
    }
  }
  const sortGames = (gamesArray: Game[]) => {
    gamesArray.sort((a, b) => {
      const statusA = getStatusOrder(a.status)
      const statusB = getStatusOrder(b.status)

      if (statusA !== statusB) {
        return statusA - statusB
      }

      const timeA = new Date(a.startTime).getTime()
      const timeB = new Date(b.startTime).getTime()

      return timeB - timeA
    })
  }

  const uniqueSports = computed(() => {
    return [...new Set(games.value.map((g) => g.sport))].sort()
  })

  const filteredGames = computed(() => {
    let filtered = games.value

    if (sportFilter.value !== 'all') {
      filtered = filtered.filter((g) => g.sport === sportFilter.value)
    }

    if (statusFilter.value !== 'all') {
      filtered = filtered.filter((g) => g.status === statusFilter.value)
      const sortedByDateOnly = filtered.slice().sort((a, b) => {
        const timeA = new Date(a.startTime).getTime()
        const timeB = new Date(b.startTime).getTime()
        return timeB - timeA
      })
      return sortedByDateOnly
    }

    if (sportFilter.value !== 'all' && statusFilter.value === 'all') {
      const sortedFiltered = filtered.slice()
      sortGames(sortedFiltered)
      return sortedFiltered
    }
    return filtered
  })

  return {
    games,
    loading,
    error,
    sportFilter,
    statusFilter,
    uniqueSports,
    filteredGames,
    loadGames,
  }
})
