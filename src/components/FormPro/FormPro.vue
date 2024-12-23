<template>
  <n-form class="w-full h-full" label-placement="left" require-mark-placement="right-hanging" v-bind="$attrs"
    :rules="rules" :model="model" ref="formElRef">
    <div class="flex flex-col h-full">
      <slot name="content" :scope="{ model, schemas, contentClass }">
        <div class="relative w-full flex-1 overflow-auto">
          <div class="absolute w-full left-0 top-0 pr-18px!">
            <FormProItem :model="_model" :schemas="_schemas" :contentClass="contentClass"></FormProItem>
          </div>
        </div>
      </slot>
      <div v-if="showFooter" class="w-full mt-18px pr-18px">
        <slot>
          <n-space class="w-full" align="center" :justify="justify">
            <n-button type="primary" secondary attr-type="submit" @click="submit">{{
              submitText }}</n-button>
            <n-tooltip :show="showPopover" placement="bottom">
              <template #trigger>
                <n-button @click="showPopover = !showPopover">重置</n-button>
              </template>
              <div class="mb-4px">确认是否重置表单？</div>
              <n-space align="center" justify="center">
                <n-button size="small" type="warning" @click="resetFields">确认</n-button>
                <n-button size="small" type="error" @click="showPopover = !showPopover">取消</n-button>
              </n-space>
            </n-tooltip>

            <n-button v-if="showCloseBtn" secondary attr-type="submit" @click="handleClose">关闭</n-button>
          </n-space>
        </slot>
      </div>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { FormInst, FormRules } from 'naive-ui'
import { IFormProps, IFormSchema } from '.'
import { cloneDeep } from 'lodash'
import FormProItem from './FormProItem.vue'

const props = withDefaults(defineProps<IFormProps>(), {
  justify: 'end',
  submitText: '提交',
  model: () => ({}),
  schemas: () => [],
  showFooter: true,
  showCloseBtn: true
})
const _model = toRef(props, 'model')
const _schemas = toRef(props, 'schemas')

const showPopover = ref(false)

const formElRef = ref<FormInst>()

const defaultModel = {}

const rules = computed<FormRules>(() => {
  if (!unref(_schemas)) {
    console.error('schemas is requireed')
    return
  }

  return unref(_schemas).reduce((result: any, item) => {
    result[item.field] = item.rules
    return result
  }, {})
})

const validate = async () => {
  const formEl = unref(formElRef)
  if (!formEl) return false
  try {
    await unref(formElRef)?.validate()
    return true
  } catch (error: any) {
    console.warn(error)
    return false
  }
}

const submit = async (e: Event) => {
  e && e.preventDefault()
  const valid = await validate()
  if (valid) emit('on-submit')
}

const resetFields = () => {
  Object.assign(_model.value, cloneDeep(defaultModel))
  emit('on-reset')
  showPopover.value = false
}

const handleClose = () => {
  resetFields()
  emit('close')
}


const initDefdault = () => {
  Object.assign(defaultModel, cloneDeep(unref(_model)))
}


onMounted(() => {
  initDefdault()
})

const emit = defineEmits<{ 'on-submit': []; 'on-reset': [], close: [] }>()

defineExpose({
  initDefdault,
  resetFields,
  validate
})
</script>

<style scoped lang="scss"></style>
