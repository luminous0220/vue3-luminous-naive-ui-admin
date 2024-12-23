<template>
  <modal
    title="搜索菜单"
    ref="ModalRef"
    :onAfterEnter="() => AutoComp?.focus()"
    :onAfterLeave="() => (inputValue = '')"
    :maskClosable="true"
    class="top-[-200px]"
    :trap-focus="false"
  >
    <n-auto-complete
      ref="AutoComp"
      class="w-580px"
      :get-show="() => true"
      v-model:value="inputValue"
      :input-props="{
        autocomplete: 'disabled'
      }"
      :options="options"
      placeholder="搜索菜单（支持菜单名、路径）"
      clearable
      :on-select="onClick"
    >
    </n-auto-complete>
  </modal>
</template>

<script setup lang="ts">
import { useAppRouteStore } from '@/stores'
import { navigate } from '@/utils'
import { AutoCompleteInst, AutoCompleteOption } from 'naive-ui'
import Modal from '@/components/Modal/Modal.vue'

const inputValue = ref('')
const AppRouteSto = useAppRouteStore()
const AutoComp = ref<AutoCompleteInst>()
const ModalRef = shallowRef<InstanceType<typeof Modal>>()
const options = computed<AutoCompleteOption[]>(() => {
  return AppRouteSto.flatMenuGet
    .filter((item) => {
      // @ts-ignore
      return item.meta.title.includes(inputValue.value) || item.path?.includes(inputValue.value)
    })
    .map((item) => {
      return {
        label: item.meta?.title as string,
        value: item.path
      }
    })
})

const onClick = (value: string) => {
  navigate(value)
  unref(ModalRef)?.close()
}

const open = () => {
  unref(ModalRef)?.open()
}

defineExpose({ open })
</script>

<style scoped lang="scss"></style>
