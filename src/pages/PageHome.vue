<template>
  <div class="min-h-screen bg-gray-50">
    <div>{{ store.games }}</div>
    <div>{{ store.loading }}</div>
    <div>{{ store.error }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { useGamesStore } from '@/stores/useGamesStore'

const store = useGamesStore()

onMounted(() => {
  store.loadGames()
})
</script>
