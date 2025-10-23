<template>
  <div
    :class="{
      'md:sticky md:top-6 bg-white rounded-xl shadow-lg p-4 md:p-6': !isMobileView,
      'bg-white rounded-none p-0': isMobileView,
    }"
  >
    <h2 v-if="!isMobileView" class="text-2xl font-bold mb-4">Bet Slip</h2>

    <div v-if="betStore.success" class="border rounded p-4 bg-green-50">
      <div class="bg-green-100 p-3 rounded mb-4">
        <h3 class="font-bold">Bet Placed Successfully!</h3>
        <p class="text-sm">Reference: #{{ betStore.betRef }}</p>
      </div>
      <BetSlipItem
        v-for="sel in betStore.lastSuccessfulSelections"
        :key="sel.gameId"
        :selection="sel"
        readonly
      />
      <div class="border-t pt-3 mt-3 text-lg font-bold">
        <p>Total Stake: €{{ (betStore.lastSuccessfulBet?.totalStake ?? 0).toFixed(2) }}</p>
        <p>
          Total Potential Payout: €{{
            (betStore.lastSuccessfulBet?.totalPotentialPayout ?? 0).toFixed(2)
          }}
        </p>
      </div>
      <button
        @click="placeAnother"
        class="w-full bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600"
      >
        Place Another Bet
      </button>

      <button
        v-if="isMobileView"
        @click="$emit('closeModal')"
        class="w-full mt-2 py-2 rounded text-gray-600 border border-gray-300 hover:bg-gray-100"
      >
        Close View
      </button>
    </div>

    <div v-else :class="{ 'p-4': !isMobileView }">
      <div v-if="selections.length === 0" class="text-gray-500 italic mb-4">
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
          <label class="block text-sm font-medium mb-1">Stake per selection (€)</label>
          <input
            v-model.number="betStore.stake"
            type="number"
            min="1"
            max="1000"
            class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div v-if="validationErrors.length > 0" class="bg-red-50 border border-red-200 p-3 rounded">
          <p class="font-medium text-red-800 mb-1">Please fix the following:</p>
          <ul class="text-sm text-red-700 space-y-1">
            <li v-for="err in validationErrors" :key="err">{{ err }}</li>
          </ul>
        </div>
        <label class="flex items-center">
          <input v-model="betStore.acceptedTerms" type="checkbox" class="mr-2" />
          <span class="text-sm">I accept the terms & conditions</span>
        </label>
        <button
          @click="submitAndClose"
          :disabled="!isValid || betStore.submitting"
          :class="[
            'w-full py-2 rounded font-medium',
            isValid && !betStore.submitting
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
        >
          {{ betStore.submitting ? 'Placing Bet...' : `Place Bet (€${totalStake.toFixed(2)})` }}
        </button>
        <div v-if="betStore.errorMsg" class="bg-red-100 border border-red-300 p-3 rounded mt-2">
          <p class="text-red-800">{{ betStore.errorMsg }}</p>
          <p class="text-sm mt-1">Please try again.</p>
        </div>
        <div v-if="selections.length > 0" class="border-t pt-3 text-sm font-medium">
          <p>Total Stake: €{{ totalStake.toFixed(2) }}</p>
          <p>Total Potential Payout: €{{ totalPotentialPayout.toFixed(2) }}</p>
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

const submitAndClose = async () => {
  await betStore.submit()
}
</script>
