<template>
  <div class="flex gap-4 mb-6">
    <select
      v-model="store.sportFilter"
      class="border border-gray-800 bg-gray-900/50 text-gray-300 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:bg-gray-900 cursor-pointer backdrop-blur-sm"
    >
      <option value="all">All Sports</option>
      <option v-for="sport in store.uniqueSports" :key="sport" :value="sport">{{ sport }}</option>
    </select>
    <select
      v-model="store.statusFilter"
      class="border border-gray-800 bg-gray-900/50 text-gray-300 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:bg-gray-900 cursor-pointer backdrop-blur-sm"
    >
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
