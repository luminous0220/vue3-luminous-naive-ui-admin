<template>
  <modal v-model:show="isShowTreeModal" ref="TreeModalRef" content-class="max-h-60vh pr-8px!  mr-8px! overflow-auto"
    class="edit-form w-420px!" title="请选择" preset="card" :trap-focus="false">

    <div>
      <n-tree size="large" block-line :data="options" :default-expand-all="isExpand" check-on-click
        :label-field="labelField" :key-field="keyField" :children-field="childrenField" :multiple="multiple"
        :cascade="!!multiple" checkable :checked-keys="checkedKeys"
        :on-update:checked-keys="(keys, _, meta) => updateSelectKey(keys, _, meta, props)" />
    </div>


    <template #footer>
      <div class="flex justify-center items-center">
        <n-button class="mr-12px" @click="isExpand = !isExpand">
          <template #icon>
            <i-carbon-chevron-up v-if="isExpand" />
            <i-carbon-chevron-down v-else />
          </template>
          {{ isExpand ? '收起' : '展开' }}</n-button>
        <n-button v-if="multiple" class="mr-12px" @click="treeSelectAll(props)">
          <template #icon>
            <i-carbon-select-window />
          </template>
          全选</n-button>
        <n-button class="mr-12px" @click="clearTreeSelectKeys(props)">
          <template #icon>
            <i-carbon-erase />
          </template>
          清空</n-button>
        <n-button type="primary" @click="confirm">确认</n-button>
      </div>
    </template>
  </modal>
</template>

<script setup lang="ts">
import { Modal } from '@/components'
import { useTreeSelectHook, ITreeCheckedValue } from '@/hooks'

export interface ITreeSelectProps {
  childrenField?: string
  options: any[]
  keyField?: string
  labelField?: string
  multiple?: boolean
}


const props = withDefaults(defineProps<ITreeSelectProps>(), {
  childrenField: 'children',
  options: () => [],
  keyField: 'value',
  labelField: 'label',
  multiple: false
})


const checkedValues = defineModel<ITreeCheckedValue>('checkedValues', { required: false, default: [] })

const confirm = () => {
  confirmTreeSelect(props)
  emit('confirm', checkedKeys.value)
}

const { isShowTreeModal,
  checkedKeys,
  isExpand,
  updateSelectKey,
  treeSelectAll,
  clearTreeSelectKeys,
  openTreeSelectModal,
  selectedLabels,
  initTreeSelectValue,
  confirmTreeSelect } = useTreeSelectHook(checkedValues)

watch(() => props.options.length, (newVal) => {
  if (!newVal) return
  initTreeSelectValue(props)
})

// 打开
const open = () => {
  // 防止打开后未初始化值
  nextTick(() => {
    openTreeSelectModal(props)
  })
}

defineExpose({
  selectedLabels,
  open
})

const emit = defineEmits<{ 'confirm': [value: ITreeCheckedValue] }>()


</script>

<style scoped lang="scss"></style>