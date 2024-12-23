<template>
  <modal content-class="pr-8px!" class="edit-form " v-if="type === 'modal'" :mask-closable="false" :title="title"
    ref="ModalRef" preset="card" :onAfterLeave="FormProRef?.resetFields" :trap-focus="false">
    <form-pro :content-class="contentClass" ref="FormProRef" @on-submit="onSubmit" :schemas="_schemas" :model="_model"
      @close="handleClose">
      <template #content="{ scope }">
        <FormProItem class="max-h-60vh pr-18px!" :model="scope.model" :schemas="scope.schemas"
          :contentClass="scope.contentClass" />
      </template>
    </form-pro>
  </modal>

  <drawer content-class="flex flex-col" :mask-closable="false" class="edit-form" :onAfterLeave="FormProRef?.resetFields"
    v-else ref="DrawerRef" :title="title">
    <slot name="top" />
    <slot>
      <form-pro :content-class="contentClass" ref="FormProRef" @on-submit="onSubmit" :schemas="_schemas" :model="_model"
        @close="handleClose">
      </form-pro>
    </slot>
  </drawer>
</template>

<script setup lang="ts">
import { IFormSchema, IFormType } from '.'
import { Modal, FormPro, Drawer } from '@/components'
import FormProItem from './FormProItem.vue'



const props = withDefaults(defineProps<{
  title: string;
  type: IFormType;
  contentClass?: string;
  schemas: IFormSchema[];
  model: Record<string, any>;
}>(), {
  title: '',
  contentClass: '',
  schemas: () => []
})

const ModalRef = shallowRef<InstanceType<typeof Modal>>()
const DrawerRef = shallowRef<InstanceType<typeof Drawer>>()
const FormProRef = shallowRef<InstanceType<typeof FormPro>>()

const _model = toRef(props, 'model')
const _schemas = toRef(props, 'schemas')

const onSubmit = async () => {
  emit('submit')
}

const emit = defineEmits<{ submit: [] }>()

const handleClose = () => {
  ModalRef.value?.close()
  DrawerRef.value?.close()
}

defineExpose({
  open: () => {
    nextTick(() => {
      ModalRef.value?.open()
      DrawerRef.value?.open()
    })
  },
  close: handleClose,
  resetFields: () => {
    FormProRef.value?.resetFields()
  }
})
</script>

<style lang="scss">
.edit-form {
  .n-drawer-body-content-wrapper {
    padding-right: 2px !important;
    display: flex;
    flex-direction: column
  }
}
</style>
