<template>
  <component :is="LayoutComponents[layout]" />
</template>

<script setup lang="ts" name="layout">
import type { Component } from 'vue'
import { ILayout } from '@/stores'
import { useGlobalStore } from '@/stores/modules/global'
import LayoutClassic from '@/layout/LayoutClassic.vue'

const LayoutVertical = defineAsyncComponent(() => import('@/layout/LayoutVertical.vue'))

const LayoutComponents: Record<ILayout, Component> = {
  classic: LayoutClassic,
  vertical: LayoutVertical
}

const GlobalSto = useGlobalStore()
const layout = computed(() => GlobalSto.layout)
</script>

<style lang="scss">
.header-icon {
  font-size: 24px !important;
  height: 100%;
  align-items: center;
  display: flex;
  justify-content: center;
  padding-left: 8px;
  padding-right: 8px;
  margin-right: 8px;
  &:hover {
    background: var(--gray-1);
  }
}
</style>
