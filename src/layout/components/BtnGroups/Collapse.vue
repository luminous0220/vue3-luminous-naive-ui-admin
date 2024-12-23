<template>
  <div class="w-28px cursor-pointer text-22px flex-center" @click="handleClick">
    <i-ep-fold v-if="GlobalSto.isExpandMenu" />
    <i-ep-expand v-else />
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores'

const GlobalSto = useGlobalStore()
const handleClick = () => {
  GlobalSto.isExpandMenu = !GlobalSto.isExpandMenu
}
</script>

<style scoped lang="scss"></style>
