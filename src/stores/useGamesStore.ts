import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Game } from '@/types/game'
import { fetchGames } from '@/services/api'

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
    } catch (err) {
      console.log('err-fetchGames', err)

      error.value = 'Failed to load games'
    } finally {
      loading.value = false
    }
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
