<template>
  <n-drawer :placement="'right'" :closable="true" v-bind="$attrs" v-model:show="showDrawer" :width="width">
    <n-drawer-content :title="title" closable v-bind="contentProps">
      <slot name="default"></slot>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores';
import { DrawerContentProps, DrawerProps } from 'naive-ui'

interface IDrawerProps extends /* @vue-ignore */ DrawerProps {
  title: string
  contentProps?: DrawerContentProps
}

withDefaults(defineProps<IDrawerProps>(), {
  title: ''
})


const GlobalSto = useGlobalStore()

const width = computed(() => {
  switch (GlobalSto.device) {
    case 'pc':
      return '448px'
    case 'pad':
      return '50%'
    default:
      return '100%'
  }
})

const showDrawer = defineModel<boolean>({ required: false, default: false })

const open = () => {
  showDrawer.value = true
}

const close = () => {
  showDrawer.value = false
}

defineExpose({
  open,
  close
})
</script>

<style scoped lang="scss"></style>
