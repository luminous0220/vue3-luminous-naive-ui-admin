<template>
  <n-menu class="w-full h-full!" :options="options" :inverted="isDark" :collapsed-width="64" :collapsed-icon-size="20"
    :indent="24" key-field="key" v-model:value="routeKey" @update:value="onClick" v-bind="$attrs">
  </n-menu>
</template>

<script setup lang="ts">
import { MENU_TYPE } from '@/constants'
import { useAppRouteStore } from '@/stores'
import { useGlobalStore } from '@/stores/modules/global'
import { navigate } from '@/utils'
import { Icon } from '@iconify/vue'
import { MenuMixedOption } from 'naive-ui/es/menu/src/interface'
import { storeToRefs } from 'pinia'
import { RouteRecordRaw, useRoute } from 'vue-router'

const { isDark } = storeToRefs(useGlobalStore())

const route = useRoute()
const appRouteStore = useAppRouteStore()

const routeKey = computed(() => route.path)

// 递归处理符合 NMenu 的 option 的数据结构
const orginzeOptions = (menus: RouteRecordRaw[]): MenuMixedOption[] => {
  return menus.map((menuItem) => {
    const option = {
      label: menuItem.meta?.title,
      key: menuItem.path,
      icon: () => h(Icon, { icon: menuItem.meta?.icon as string, style: { marginRight: '4px' } }),
    }
    if (menuItem.children && menuItem.children.length) {
      Object.assign(option, { children: orginzeOptions(menuItem.children) })
    }
    return option
  })
}

// 菜单数据
const options = computed(() => orginzeOptions(appRouteStore.menus))

const onClick = (key: string) => {
  navigate(key)
}
</script>

<style scoped lang="scss"></style>
