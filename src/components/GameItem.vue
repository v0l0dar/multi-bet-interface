<template>
  <div
    class="border border-gray-800 p-4 mb-4 rounded-lg bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
  >
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-bold text-cyan-400">{{ game.sport }}</h3>
      <span
        :class="classStatus"
        class="px-2 py-1 rounded text-sm font-medium transition-all duration-200"
      >
        {{ game.status }}
      </span>
    </div>
    <div class="flex gap-1 justify-between items-center">
      <p class="font-semibold text-gray-200">{{ game.homeTeam }} vs {{ game.awayTeam }}</p>
      <p class="text-sm text-gray-500 text-right">
        {{ new Date(game.startTime).toLocaleString() }}
      </p>
    </div>
    <div class="flex items-center justify-between gap-1 flex-wrap">
      <div class="flex gap-3 mt-3 flex-wrap">
        <template v-for="(oddValue, oddType, index) in game.odds" :key="game.id + oddType + index">
          <button
            v-if="oddValue"
            @click="addSelection(oddType, oddValue)"
            :disabled="isFinished || (isFull && !isSelected(oddType))"
            :key="game.id + oddType + index"
            :class="[
              'border px-3 py-2 rounded-lg text-lg font-medium transition-all duration-200',
              isSelected(oddType)
                ? 'bg-linear-to-r from-cyan-600 to-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/30'
                : 'bg-gray-800 hover:bg-gray-750 text-gray-300 border-gray-700 hover:border-cyan-500/50 hover:text-cyan-400',
              'disabled:cursor-not-allowed! disabled:bg-gray-900 disabled:text-gray-500 disabled:border-gray-600',
            ]"
          >
            {{ oddValue?.toFixed(2) }}
          </button></template
        >
      </div>
      <p v-if="isFinished" class="text-gray-500 italic">Betting closed for finished games</p>
      <p v-else-if="isFull" class="text-red-400 italic">Bet slip is full (max 10 selections)</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { Game, BetType } from '@/types/game'
import { useBetSlipStore } from '@/stores/useBetSlipStore'

interface Props {
  game: Game
}

const props = defineProps<Props>()
const game = toRef(props, 'game')

const betStore = useBetSlipStore()

const isSelected = (betType: BetType) => {
  return betStore.selections.some((s) => s.gameId === game.value.id && s.betType === betType)
}

const addSelection = (betType: BetType, odds: number) => {
  betStore.addSelection(game.value.id, betType, odds)
}

const isFinished = computed(() => game.value.status === 'finished')
const isFull = computed(() => betStore.selections.length >= 10)
const classStatus = computed(() => ({
  'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30': game.value.status === 'upcoming',
  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30': game.value.status === 'live',
  'bg-gray-700/50 text-gray-400 border border-gray-600/30': game.value.status === 'finished',
}))
</script>
