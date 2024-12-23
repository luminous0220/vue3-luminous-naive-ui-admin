<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AppProvider } from '@/components'
import { useGlobalStore } from './stores/modules/global'

const _setDevice = useGlobalStore().setDevice()

onUnmounted(() => {
  window.removeEventListener('resize', _setDevice)
})
</script>

<template>
  <app-provider>
    <RouterView />
  </app-provider>
</template>

<style scoped></style>
