<template>
  <div
    class="flex flex-col border border-gray-800 p-3 mb-3 rounded-lg bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-200 hover:border-cyan-500/50"
  >
    <div class="flex flex-1 items-center justify-between">
      <p class="text-gray-400">{{ `${game?.homeTeam} - ${game?.awayTeam}` }}</p>
      <button
        v-if="!readonly"
        @click="$emit('remove', selection.gameId)"
        class="h-6 w-6 flex items-center justify-center text-red-600 text-sm hover:text-white transition-all duration-200 font-medium ml-3"
      >
        ✕
      </button>
    </div>
    <div class="flex-1">
      <div class="flex justify-between items-center gap-1">
        <p class="text-cyan-400">{{ outcomeText }}</p>
        <p class="shrink-0 text-xl mt-1 text-cyan-400 font-bold">
          x {{ selection.odds.toFixed(2) }}
        </p>
      </div>
      <div v-if="!readonly" class="text-sm text-gray-300">
        Potential Payout: €{{ selection.potentialPayout.toFixed(2) }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Selection } from '@/types/game'
import { computed } from 'vue'
import { useGamesStore } from '@/stores/useGamesStore'

interface Props {
  selection: Selection
  readonly?: boolean
}

const props = defineProps<Props>()
defineEmits<{ remove: [gameId: string] }>()

const gamesStore = useGamesStore()
const game = computed(() => gamesStore.games.find((g) => g.id === props.selection.gameId))

const outcomeText = computed(() => {
  if (!game.value) return 'Unknown game'
  const { betType } = props.selection
  if (betType === 'homeWin') return `${game.value.homeTeam} Win`
  if (betType === 'awayWin') return `${game.value.awayTeam} Win`
  return 'Draw'
})
</script>
