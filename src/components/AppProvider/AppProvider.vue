<template>
  <n-config-provider
    class="w-full h-full"
    :locale="zhCN"
    :theme="isDark ? darkTheme : null"
    :date-locale="dateZhCN"
    :theme-overrides="themeOverrides"
  >
    <n-notification-provider>
      <n-dialog-provider>
        <n-message-provider>
          <slot></slot>
        </n-message-provider>
      </n-dialog-provider>
    </n-notification-provider>
    <n-global-style />
  </n-config-provider>
</template>

<script setup lang="ts">
import { CFG } from '@/config'
import { useGlobalStore } from '@/stores'
import { lighten } from '@/utils'
import { merge } from 'lodash'
import { zhCN, dateZhCN, NGlobalStyle, darkTheme } from 'naive-ui'
import { storeToRefs } from 'pinia'

const { isDark, themeColor } = storeToRefs(useGlobalStore())

const themeOverrides = computed(() => {
  const lightenStr = lighten(themeColor.value, 6)
  const common = {
    common: {
      primaryColor: themeColor,
      primaryColorHover: lightenStr,
      primaryColorPressed: lightenStr,
      primaryColorSuppl: themeColor
    },
    LoadingBar: {
      colorLoading: themeColor
    }
  }
  const config = merge(isDark.value ? CFG.DARK_SETTING : CFG.LIGHT_SETTING, CFG.COMMON_SETTING)
  return merge(config, common)
})

watch(
  () => isDark.value,
  (newVal) => {
    const html = document.documentElement as HTMLElement
    if (newVal) html.setAttribute('class', 'dark')
    else html.setAttribute('class', 'light')
  },
  { immediate: true }
)
</script>

<style scoped lang="scss"></style>
