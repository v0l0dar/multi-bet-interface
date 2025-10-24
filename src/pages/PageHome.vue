<template>
  <div class="min-h-screen max-h-screen bg-gray-950">
    <div
      v-if="store.error"
      class="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded m-4 backdrop-blur-sm transition-all duration-300"
    >
      {{ store.error }}
    </div>

    <div class="container mx-auto pt-4 px-4 md:px-6">
      <div class="flex flex-col lg:grid lg:grid-cols-3 lg:gap-4 gap-4">
        <div class="lg:col-span-2 order-1">
          <GameFilters />
          <GameList />
        </div>

        <div class="hidden lg:block lg:col-span-1 order-2 lg:h-[95dvh]">
          <BetSlip />
        </div>
      </div>
    </div>

    <div
      v-if="betStore.selections.length > 0 && !isMobileBetSlipOpen"
      class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 shadow-2xl p-4 transition-all duration-300"
    >
      <button
        @click="isMobileBetSlipOpen = true"
        class="w-full flex justify-between items-center py-3 px-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-[1.02]"
        :class="
          betStore.success
            ? 'bg-linear-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/50'
            : 'bg-linear-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/50 hover:from-cyan-500 hover:to-cyan-400'
        "
      >
        <div class="flex items-center">
          <span
            class="bg-white text-cyan-600 px-2 py-0.5 rounded-full text-sm font-extrabold mr-2 animate-pulse"
          >
            {{ betStore.selections.length }}
          </span>
          <span class="text-base">Selections</span>
        </div>
        <div class="text-lg">
          <span v-if="betStore.success">VIEW BET</span>
          <span v-else> Place Bet (€{{ (betStore.totalStake ?? 0).toFixed(2) }} ) </span>
        </div>
      </button>
    </div>
    <Transition name="betslip">
      <div v-if="isMobileBetSlipOpen" class="lg:hidden fixed inset-0 z-50 flex flex-col">
        <div
          class="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
          @click="isMobileBetSlipOpen = false"
        ></div>

        <div
          class="absolute bottom-0 left-0 right-0 h-[95%] bg-gray-900 rounded-t-2xl shadow-2xl overflow-y-auto pt-5 flex flex-col transition-transform duration-300 border-t border-gray-800"
        >
          <div
            class="px-4 pb-4 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900/95 backdrop-blur-lg z-10 shadow-sm"
          >
            <h2 class="text-xl font-bold text-cyan-400">Your BetSlip</h2>
            <button
              @click="isMobileBetSlipOpen = false"
              class="text-2xl font-light text-gray-400 hover:text-cyan-400 transition-colors duration-200"
            >
              &times;
            </button>
          </div>

          <div class="flex-1 p-4 overflow-y-auto no-scrollbar">
            <BetSlip is-mobile-view @close-modal="isMobileBetSlipOpen = false" />
          </div>
        </div></div
    ></Transition>
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
