<template>
  <div class="w-full">
    <div class="flex flex-nowrap cursor-pointer" @click="handleOpen">
      <n-card class=" flex-1 mr-12px cursor-pointer" content-class="px-12px! py-6px!">
        <template v-if="selectedLabels.length">
          <n-tag class="mr-4px" v-for="(item, idx) in selectedLabels" :key="idx">{{
            item }}</n-tag>
        </template>
        <div v-else class="text-[--text-color-2] text-13px flex items-center">请点击选择 <i-carbon-touch-1 class="ml-4px" />
        </div>
      </n-card>
    </div>
    <TreeSelectModal ref="TreeSelectModalRef" v-model:checked-values="checkedValues" :options="options!"
      :childrenField="childrenField!" :keyField="keyField!" :labelField="labelField!" :multiple="multiple!" />
  </div>
</template>

<script setup lang="ts">
import { ITreeCheckedValue } from '@/hooks'
import { TreeSelectModal, } from '@/components'
import { ITreeSelectProps } from '@/components/TreeSelect/TreeSelectModal.vue'

withDefaults(defineProps<ITreeSelectProps>(), {
  childrenField: 'children',
  options: () => [],
  keyField: 'value',
  labelField: 'label',
  multiple: false
})



const TreeSelectModalRef = ref<InstanceType<typeof TreeSelectModal>>()

const selectedLabels = computed(() => {
  return TreeSelectModalRef.value?.selectedLabels || []
})

const checkedValues = defineModel<ITreeCheckedValue>('checkedValues', { required: false, default: [] })

const handleOpen = async () => {
  TreeSelectModalRef.value?.open()
}
</script>

<style scoped lang="scss"></style>