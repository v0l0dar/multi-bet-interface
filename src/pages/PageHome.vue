<template>
  <div class="min-h-screen bg-gray-50">
    <div
      v-if="store.error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4"
    >
      {{ store.error }}
    </div>
    <div class="container mx-auto p-4">
      <div class="flex gap-6">
        <div class="w-2/3">
          <GameFilters />
          <GameList />
        </div>
        <div class="w-1/3">
          <BetSlip />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import GameFilters from '@/components/GameFilters.vue'
import GameList from '@/components/GameList.vue'
import BetSlip from '@/components/BetSlip.vue'
import { useGamesStore } from '@/stores/useGamesStore'

const store = useGamesStore()

onMounted(() => {
  store.loadGames()
})
</script>
