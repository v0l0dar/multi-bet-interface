<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 text-cyan-400">Available Games</h2>
    <div v-if="store.loading" class="text-center py-4 text-gray-400 animate-pulse">
      Loading games...
    </div>
    <div v-else-if="store.filteredGames.length === 0" class="text-gray-500 text-center py-4">
      No games match the filters
    </div>
    <div v-else class="h-[84dvh] pb-5 overflow-auto no-scrollbar">
      <GameItem v-for="game in store.filteredGames" :key="game.id" :game="game" />
    </div>
  </div>
</template>
<script setup lang="ts">
import GameItem from './GameItem.vue'
import { useGamesStore } from '@/stores/useGamesStore'

const store = useGamesStore()
</script>
