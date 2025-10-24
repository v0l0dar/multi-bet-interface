<template>
  <div
    :class="{
      'md:sticky md:top-6 bg-gray-900/50 backdrop-blur-lg rounded-xl shadow-lg shadow-cyan-500/10 border border-gray-800 p-4 md:p-6 transition-all duration-300':
        !isMobileView,
      'bg-gray-900 rounded-none p-0': isMobileView,
    }"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 v-if="!isMobileView" class="text-2xl font-bold text-cyan-400">BetSlip</h2>
      <button
        @click="placeAnother"
        v-if="selections.length"
        class="ml-auto text-red-400 text-sm hover:text-white transition-all duration-200"
      >
        Remove All Bets
      </button>
    </div>
    <div
      v-if="betStore.success"
      class="border border-cyan-500/30 rounded-lg p-4 bg-cyan-900/20 backdrop-blur-sm"
    >
      <div class="bg-cyan-500/20 p-3 rounded-lg mb-4 border border-cyan-500/30">
        <h3 class="font-bold text-cyan-400">Bet Placed Successfully!</h3>
        <p class="text-sm text-gray-400">Reference: #{{ betStore.betRef }}</p>
      </div>
      <BetSlipItem
        v-for="selection in betStore.lastSuccessfulSelections"
        :key="selection.gameId"
        :selection="selection"
        readonly
      />
      <div class="border-t border-gray-800 pt-3 mt-3 text-lg font-bold text-gray-200">
        <p>Total Stake: €{{ (betStore.lastSuccessfulBet?.totalStake ?? 0).toFixed(2) }}</p>
        <p>
          Total Potential Payout: €{{
            (betStore.lastSuccessfulBet?.totalPotentialPayout ?? 0).toFixed(2)
          }}
        </p>
      </div>
      <button
        @click="placeAnother"
        class="w-full bg-linear-to-r from-cyan-600 to-cyan-500 text-white py-3 rounded-lg mt-4 hover:from-cyan-500 hover:to-cyan-400 transition-all duration-200 font-medium shadow-lg shadow-cyan-500/30"
      >
        Place Another Bet
      </button>

      <button
        v-if="isMobileView"
        @click="$emit('closeModal')"
        class="w-full mt-2 py-3 rounded-lg text-gray-400 border border-gray-800 hover:bg-gray-800/50 hover:text-cyan-400 transition-all duration-200"
      >
        Close View
      </button>
    </div>

    <div
      v-else
      class="lg:max-h-[70vh] overflow-y-auto lg:scrollbar-thin lg:scrollbar-thumb-gray-700 scrollbar-track-gray-900 no-scrollbar"
    >
      <div v-if="selections.length === 0" class="text-gray-500 italic mb-4 text-center py-8">
        No selections added yet
      </div>
      <BetSlipItem
        v-for="sel in selections"
        :key="sel.gameId"
        :selection="sel"
        @remove="betStore.removeSelection(sel.gameId)"
      />
      <div v-if="selections.length > 0" class="mt-4 space-y-3">
        <div>
          <label class="block text-sm font-medium mb-2 text-cyan-400"
            >Stake per selection (€)</label
          >
          <input
            v-model.number="betStore.stake"
            type="number"
            min="1"
            max="1000"
            class="w-full border border-gray-800 bg-gray-900/50 text-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:bg-gray-900"
          />
          <div class="flex flex-wrap gap-1 justify-evenly my-3">
            <button
              v-for="(amount, key) in amounts"
              :key="key"
              @click="setAmount(amount)"
              class="px-3 text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
            >
              {{ amount }}
            </button>
          </div>
        </div>
        <div
          v-if="validationErrors.length > 0"
          class="bg-red-900/30 border border-red-500/50 p-3 rounded-lg backdrop-blur-sm"
        >
          <p class="font-medium text-red-400 mb-1">Please fix the following:</p>
          <ul class="text-sm text-red-300 space-y-1">
            <li v-for="err in validationErrors" :key="err">• {{ err }}</li>
          </ul>
        </div>
        <label class="flex items-center group cursor-pointer">
          <input
            v-model="betStore.acceptedTerms"
            type="checkbox"
            class="mr-2 w-4 h-4 accent-cyan-500 cursor-pointer"
          />
          <span
            class="text-sm text-gray-300 group-hover:text-cyan-400 transition-colors duration-200"
            >I accept the terms & conditions</span
          >
        </label>
        <button
          @click="submitAndClose"
          :disabled="!isValid || betStore.submitting"
          :class="[
            'w-full py-3 rounded-lg font-medium transition-all duration-200 transform',
            isValid && !betStore.submitting
              ? 'bg-linear-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/30 hover:scale-[1.02]'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed',
          ]"
        >
          {{ betStore.submitting ? 'Placing Bet...' : `Place Bet (€${totalStake.toFixed(2)})` }}
        </button>
        <div
          v-if="betStore.errorMsg"
          class="bg-red-900/30 border border-red-500/50 p-3 rounded-lg mt-2 backdrop-blur-sm"
        >
          <p class="text-red-300">{{ betStore.errorMsg }}</p>
          <p class="text-sm mt-1 text-red-400">Please try again.</p>
        </div>
        <div
          v-if="selections.length > 0"
          class="border-t border-gray-800 pt-3 text-sm font-medium text-gray-300"
        >
          <p class="text-lg text-white">
            Total Potential Payout:
            <span class="text-xl text-cyan-400">€{{ totalPotentialPayout.toFixed(2) }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BetSlipItem from './BetSlipItem.vue'
import { useGamesStore } from '@/stores/useGamesStore'
import { useBetSlipStore } from '@/stores/useBetSlipStore'
import { storeToRefs } from 'pinia'

interface Props {
  isMobileView?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ closeModal: [] }>()

const amounts = [10, 50, 100, 500, 1000]

const gamesStore = useGamesStore()
const betStore = useBetSlipStore()

const selections = computed(() => Array.from(betStore.selections))

const validationErrors = computed(() => {
  const errs: string[] = []

  const currentStake = betStore.stake

  if (typeof currentStake !== 'number' || currentStake === null) {
    errs.push('Stake amount is required')
  } else if (currentStake < 1 || currentStake > 1000) {
    errs.push('Stake must be between €1 and €1000')
  }

  if (selections.value.length === 0) errs.push('Select at least 1 game')
  if (selections.value.length > 10) errs.push('Maximum 10 games per bet slip')
  if (!betStore.acceptedTerms) errs.push('Terms & conditions must be accepted')
  const hasFinished = selections.value.some((s) => {
    const g = gamesStore.games.find((g) => g.id === s.gameId)
    return g?.status === 'finished'
  })
  if (hasFinished) errs.push('Cannot bet on finished games')
  return errs
})

const isValid = computed(() => validationErrors.value.length === 0)

const { totalStake, totalPotentialPayout } = storeToRefs(betStore)

const placeAnother = () => {
  betStore.clear()
  if (props.isMobileView) {
    emit('closeModal')
  }
}

const setAmount = (amount: number) => {
  betStore.stake = amount
}

const submitAndClose = async () => {
  await betStore.submit()
}
</script>
