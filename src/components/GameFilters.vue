<template>
  <div class="flex gap-4 mb-4">
    <select v-model="store.sportFilter" class="border p-2 rounded">
      <option value="all">All Sports</option>
      <option v-for="sport in store.uniqueSports" :key="sport" :value="sport">{{ sport }}</option>
    </select>
    <select v-model="store.statusFilter" class="border p-2 rounded">
      <option value="all">All Status</option>
      <option value="upcoming">Upcoming</option>
      <option value="live">Live</option>
      <option value="finished">Finished</option>
    </select>
  </div>
</template>
<script setup lang="ts">
import { useGamesStore } from '@/stores/useGamesStore'

const store = useGamesStore()
</script>
