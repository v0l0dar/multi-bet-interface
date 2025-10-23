<template>
  <div
    class="border border-gray-800 p-3 mb-3 rounded-lg flex justify-between items-center bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-200 hover:border-cyan-500/50"
  >
    <div class="flex-1">
      <div class="font-semibold text-cyan-400">{{ outcomeText }}</div>
      <div class="text-sm text-gray-400">@ {{ selection.odds.toFixed(2) }}</div>
      <div v-if="!readonly" class="text-sm text-gray-500 mt-1">
        Stake: €{{ selection.stake.toFixed(2) }} | Potential: €{{
          selection.potentialPayout.toFixed(2)
        }}
      </div>
    </div>
    <button
      v-if="!readonly"
      @click="$emit('remove', selection.gameId)"
      class="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-500 transition-all duration-200 font-medium ml-3"
    >
      Remove
    </button>
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
  if (betType === 'home') return `${game.value.homeTeam} Win`
  if (betType === 'away') return `${game.value.awayTeam} Win`
  return 'Draw'
})
</script>
