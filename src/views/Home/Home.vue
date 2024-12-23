<template>
  <div>
    <edit-form
      type="drawer"
      v-model:model="model"
      :title="title"
      ref="EditFormRef"
      v-model:schemas="editSchemas"
    >
    </edit-form>
  </div>
</template>

<script setup lang="ts">
import { IFormSchema, EditForm } from '@/components'
import { NButton } from 'naive-ui'

const iniModel = {
  title: '',
  length: ''
}

const EditFormRef = shallowRef<InstanceType<typeof EditForm>>()
const title = ref('')
const model = reactive({ ...iniModel })

const editSchemas = reactive<IFormSchema[]>([
  // {
  //   field: 'title',
  //   label: '标题',
  //   type: 'input',
  //   inputProps: {
  //     placeholder: 'Please input title'
  //   }
  // },
  // {
  //   field: 'length',
  //   label: '时间',
  //   type: 'input',
  //   inputProps: {
  //     placeholder: 'Please input age'
  //   }
  // }
])

const onCreate = () => {
  title.value = '新建'
  Object.assign(model, iniModel)
  EditFormRef.value?.open()
}
</script>

<style scoped lang="scss"></style>
