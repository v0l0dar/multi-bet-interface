<template>
  <div class="border p-4 mb-4 rounded">
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-bold">{{ game.sport }}</h3>
      <span
        :class="{
          'bg-green-200 text-green-800': game.status === 'upcoming',
          'bg-yellow-200 text-yellow-800': game.status === 'live',
          'bg-gray-200 text-gray-800': game.status === 'finished',
        }"
        class="px-2 py-1 rounded text-sm"
      >
        {{ game.status }}
      </span>
    </div>
    <div class="font-semibold">{{ game.homeTeam }} vs {{ game.awayTeam }}</div>
    <div class="text-sm text-gray-500">{{ new Date(game.startTime).toLocaleString() }}</div>
    <div v-if="!isFinished && !isFull" class="flex gap-2 mt-2 flex-wrap">
      <button
        @click="addSelection('home', game.odds.homeWin)"
        :class="[
          'border px-3 py-1 rounded text-sm',
          isSelected('home') ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200',
        ]"
      >
        {{ game.homeTeam }} ({{ game.odds.homeWin.toFixed(2) }})
      </button>
      <button
        v-if="hasDraw"
        @click="addSelection('draw', game.odds.draw!)"
        :class="[
          'border px-3 py-1 rounded text-sm',
          isSelected('draw') ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200',
        ]"
      >
        Draw ({{ game.odds.draw?.toFixed(2) }})
      </button>
      <button
        @click="addSelection('away', game.odds.awayWin)"
        :class="[
          'border px-3 py-1 rounded text-sm',
          isSelected('away') ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200',
        ]"
      >
        {{ game.awayTeam }} ({{ game.odds.awayWin.toFixed(2) }})
      </button>
    </div>
    <div v-else-if="isFinished" class="text-gray-500 mt-2 italic">
      Betting closed for finished games
    </div>
    <div v-else class="text-red-500 mt-2">Bet slip is full (max 10 selections)</div>
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
