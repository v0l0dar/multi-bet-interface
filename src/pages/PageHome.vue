<template>
  <div class="min-h-screen bg-gray-100">
    <div
      v-if="store.error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4"
    >
      {{ store.error }}
    </div>

    <div class="container mx-auto p-4 md:p-6 pb-20 md:pb-6">
      <div class="flex flex-col md:grid md:grid-cols-3 lg:gap-8 gap-4">
        <div class="md:col-span-2 order-1">
          <GameFilters />
          <GameList />
        </div>

        <div class="hidden md:block md:col-span-1 order-2">
          <BetSlip />
        </div>
      </div>
    </div>

    <div
      v-if="betStore.selections.length > 0 && !isMobileBetSlipOpen"
      class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-300 shadow-2xl p-4"
    >
      <button
        @click="isMobileBetSlipOpen = true"
        class="w-full flex justify-between items-center py-3 px-4 rounded-lg font-bold transition duration-200"
        :class="
          betStore.success
            ? 'bg-green-600 text-white shadow-lg'
            : 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
        "
      >
        <div class="flex items-center">
          <span class="bg-white text-blue-600 px-2 py-0.5 rounded-full text-sm font-extrabold mr-2">
            {{ betStore.selections.length }}
          </span>
          <span class="text-base">Selections</span>
        </div>
        <div class="text-lg">
          <span v-if="betStore.success">VIEW BET</span>
          <span v-else> Place Bet (€{{ betStore.totalStake.toFixed(2) }} ) </span>
        </div>
      </button>
    </div>

    <div v-if="isMobileBetSlipOpen" class="md:hidden fixed inset-0 z-50 flex flex-col">
      <div
        class="absolute inset-0 bg-black bg-opacity-50"
        @click="isMobileBetSlipOpen = false"
      ></div>

      <div
        class="absolute bottom-0 left-0 right-0 h-4/5 bg-white rounded-t-2xl shadow-2xl overflow-y-auto pt-10 flex flex-col"
      >
        <div
          class="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10 shadow-sm"
        >
          <h2 class="text-xl font-bold">Your Bet Slip</h2>
          <button @click="isMobileBetSlipOpen = false" class="text-2xl font-light text-gray-600">
            &times;
          </button>
        </div>

        <div class="flex-1 p-4 overflow-y-auto">
          <BetSlip is-mobile-view @close-modal="isMobileBetSlipOpen = false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import GameFilters from '@/components/GameFilters.vue'
import GameList from '@/components/GameList.vue'
import BetSlip from '@/components/BetSlip.vue'
import { useGamesStore } from '@/stores/useGamesStore'
import { useBetSlipStore } from '@/stores/useBetSlipStore'

const store = useGamesStore()
const betStore = useBetSlipStore()

const isMobileBetSlipOpen = ref(false)

onMounted(() => {
  store.loadGames()
})
</script>
