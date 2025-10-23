import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Selection, BetType, Bet } from '@/types/game'
import { submitBet } from '@/services/api'

export const useBetSlipStore = defineStore('betSlip', () => {
  const selections = ref<Selection[]>([])
  const stake = ref<number>(10)
  const acceptedTerms = ref<boolean>(false)
  const submitting = ref<boolean>(false)
  const success = ref<boolean>(false)
  const betRef = ref<string | null>(null)
  const errorMsg = ref<string>('')
  const lastSuccessfulBet = ref<Bet | null>(null)
  const lastSuccessfulSelections = ref<Selection[]>([])

  const addSelection = (gameId: string, betType: BetType, odds: number) => {
    const existingIndex = selections.value.findIndex((s) => s.gameId === gameId)
    if (existingIndex > -1) {
      const existingSelection = selections.value[existingIndex]!

      if (existingSelection.betType === betType) {
        selections.value.splice(existingIndex, 1)
        return
      }

      selections.value.splice(existingIndex, 1)
    }
    if (selections.value.length >= 10) return

    const newStake = stake.value
    const potential = newStake * odds
    selections.value.push({
      gameId,
      betType,
      odds,
      stake: newStake,
      potentialPayout: potential,
    })
  }

  const removeSelection = (gameId: string) => {
    selections.value = selections.value.filter((s) => s.gameId !== gameId)
  }

  const clear = () => {
    selections.value = []
    stake.value = 10
    acceptedTerms.value = false
    success.value = false
    betRef.value = null
    errorMsg.value = ''
  }

  watch(stake, (newStake) => {
    const safeStake =
      newStake === null || newStake === undefined || typeof newStake !== 'number' || newStake < 0
        ? 0
        : newStake
    selections.value.forEach((s) => {
      s.stake = safeStake
      s.potentialPayout = safeStake * s.odds
    })
  })

  const totalStake = computed(() => selections.value.reduce((sum, s) => sum + s.stake, 0))
  const totalPotentialPayout = computed(() =>
    selections.value.reduce((sum, s) => sum + s.potentialPayout, 0),
  )

  const submit = async () => {
    submitting.value = true
    errorMsg.value = ''
    try {
      const betData: Bet = {
        selections: [...selections.value],
        totalStake: totalStake.value,
        totalPotentialPayout: totalPotentialPayout.value,
        acceptedTerms: acceptedTerms.value,
        timestamp: new Date().toISOString(),
      }
      const { data } = await submitBet(betData)

      lastSuccessfulBet.value = betData
      lastSuccessfulSelections.value = selections.value

      selections.value = []
      stake.value = 10
      acceptedTerms.value = false

      betRef.value = String(data.id)
      success.value = true
    } catch (err: unknown) {
      if (err instanceof Error) {
        errorMsg.value = err.message
      } else {
        errorMsg.value = String(err) || 'Failed to place bet'
      }
    } finally {
      submitting.value = false
    }
  }

  return {
    selections,
    stake,
    acceptedTerms,
    submitting,
    success,
    lastSuccessfulBet,
    lastSuccessfulSelections,
    betRef,
    errorMsg,
    addSelection,
    removeSelection,
    clear,
    totalStake,
    totalPotentialPayout,
    submit,
  }
})
