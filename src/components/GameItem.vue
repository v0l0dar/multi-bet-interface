<template>
  <div
    class="border border-gray-800 p-4 mb-4 rounded-lg bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
  >
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-bold text-cyan-400">{{ game.sport }}</h3>
      <span
        :class="{
          'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30': game.status === 'upcoming',
          'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30': game.status === 'live',
          'bg-gray-700/50 text-gray-400 border border-gray-600/30': game.status === 'finished',
        }"
        class="px-2 py-1 rounded text-sm font-medium transition-all duration-200"
      >
        {{ game.status }}
      </span>
    </div>
    <div class="font-semibold text-gray-200">{{ game.homeTeam }} vs {{ game.awayTeam }}</div>
    <div class="text-sm text-gray-500">{{ new Date(game.startTime).toLocaleString() }}</div>
    <div v-if="!isFinished && !isFull" class="flex gap-2 mt-3 flex-wrap">
      <button
        @click="addSelection('home', game.odds.homeWin)"
        :class="[
          'border px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
          isSelected('home')
            ? 'bg-linear-to-r from-cyan-600 to-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/30'
            : 'bg-gray-800 hover:bg-gray-750 text-gray-300 border-gray-700 hover:border-cyan-500/50 hover:text-cyan-400',
        ]"
      >
        {{ game.homeTeam }} ({{ game.odds.homeWin.toFixed(2) }})
      </button>
      <button
        v-if="hasDraw"
        @click="addSelection('draw', game.odds.draw!)"
        :class="[
          'border px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
          isSelected('draw')
            ? 'bg-linear-to-r from-cyan-600 to-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/30'
            : 'bg-gray-800 hover:bg-gray-750 text-gray-300 border-gray-700 hover:border-cyan-500/50 hover:text-cyan-400',
        ]"
      >
        Draw ({{ game.odds.draw?.toFixed(2) }})
      </button>
      <button
        @click="addSelection('away', game.odds.awayWin)"
        :class="[
          'border px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
          isSelected('away')
            ? 'bg-linear-to-r from-cyan-600 to-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/30'
            : 'bg-gray-800 hover:bg-gray-750 text-gray-300 border-gray-700 hover:border-cyan-500/50 hover:text-cyan-400',
        ]"
      >
        {{ game.awayTeam }} ({{ game.odds.awayWin.toFixed(2) }})
      </button>
    </div>
    <div v-else-if="isFinished" class="text-gray-500 mt-2 italic">
      Betting closed for finished games
    </div>
    <div v-else class="text-red-400 mt-2 font-medium">Bet slip is full (max 10 selections)</div>
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

const hasDraw = computed(() => !!game.value.odds.draw)
const isFinished = computed(() => game.value.status === 'finished')
const isFull = computed(() => betStore.selections.length >= 10)
</script>
