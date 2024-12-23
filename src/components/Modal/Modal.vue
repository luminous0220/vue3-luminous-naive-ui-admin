<template>
  <n-modal id="modal-pro" :style="{ width: width }" :preset="preset" v-model:show="show" v-bind="$attrs" @close="close"
    :segmented="{ content: true }">
    <template #header>
      <div class="w-full cursor-move" id="basic-modal-bar">{{ title }}</div>
    </template>
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores';

interface IModalProps {
  title?: string
  preset?: 'card' | 'dialog'
}

withDefaults(defineProps<IModalProps>(), { title: '', preset: 'card' })

const GlobalSto = useGlobalStore()

const width = computed(() => {
  switch (GlobalSto.device) {
    case 'pc':
      return '548px'
    case 'pad':
      return '60%'
    default:
      return '90%'
  }
})

const show = defineModel<boolean>('show', { required: false, default: false })

const open = () => {
  show.value = true
}

const close = () => {
  show.value = false
}

defineExpose({
  open,
  close
})
</script>

<style scoped lang="scss"></style>
