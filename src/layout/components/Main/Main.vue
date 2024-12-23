<template>
  <div class="flex-grow-1 relative">
    <div id="layout-main" class="h-full w-full absolute left-0 top-0 overflow-auto">
      <router-view v-slot="{ Component, route }">
        <Motion name="wipe-fade-left-right">
          <keep-alive :include="GlobalSto.isKeepAlive ? keepAliveSto.keepAliveName : []">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </Motion>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore, useKeepAliveStore } from '@/stores'

const GlobalSto = useGlobalStore()
const keepAliveSto = useKeepAliveStore()
</script>

<style scoped lang="scss"></style>
