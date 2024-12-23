<template>
  <div :class="contentClass">
    <template v-for="item in _schemas" :key="item.field">
      <n-form-item label-width="100px" label-align="right" class="mr-18px lt-md:w-full" :label="item.label"
        :path="item.field">
        <!-- 标签名右侧温馨提示 -->
        <template #label v-if="item.labelTip">
          <div class="flex-center">
            <span class="mr-2px"> {{ item.label }}</span>
            <n-tooltip trigger="hover" :style="item.labelTipStyle">
              <template #trigger>
                <n-icon size="18" class="text-gray-400 cursor-pointer mr-2px">
                  <i-carbon-help />
                </n-icon>
              </template>
              {{ item.labelTip }}
            </n-tooltip>
          </div>
        </template>

        <!-- 判断插槽 -->
        <template v-if="item.slot">
          <slot :name="item.field"></slot>
        </template>

        <!-- render -->
        <template v-else-if="item.render">
          <component :is="item.render"></component>
        </template>

        <!-- input -->
        <template v-else-if="item.type === 'input'">
          <n-input v-model:value="_model[item.field]" v-bind="item.inputProps">
            <template v-if="item.inputProps?.prefix" #prefix>
              <component :is="item.inputProps?.prefix"></component>
            </template>
          </n-input>
        </template>

        <!-- input-number -->
        <template v-else-if="item.type === 'input-number'">
          <n-input-number :min="0" v-model:value="_model[item.field]" v-bind="item.inputNumberProps" />
        </template>

        <!-- date -->
        <template v-else-if="item.type === 'date'">
          <n-date-picker v-model:formatted-value="_model[item.field]" value-format="yyyy-MM-dd" clearable type="date"
            @update-value="(time) => onDateChange(item, time)" v-bind="item.dateProps" />
        </template>

        <!-- select -->
        <template v-else-if="item.type === 'select'">
          <n-select v-model:value="_model[item.field]" :options="item.options" v-bind="item.selectProps" />
        </template>

        <!-- tree-select -->
        <template v-else-if="item.type === 'tree-select'">
          <TreeSelect v-model:checked-values="_model[item.field]" :options="item.options!"
            :childrenField="item.treeProps?.childrenField!" :keyField="item.treeProps?.keyField!"
            :labelField="item.treeProps?.labelField!" :multiple="item.treeProps?.multiple!" />
        </template>

        <!-- checkbox -->
        <template v-else-if="item.type === 'check'">
          <n-checkbox-group v-model:value="_model[item.field]" v-bind="item.checkboxGroupProps">
            <n-space>
              <n-checkbox v-for="ite in item.options" :key="ite.value" :value="ite.value" :label="ite.label"
                v-bind="item.checkboxProps" />
            </n-space>
          </n-checkbox-group>
        </template>

        <!-- radio -->
        <template v-else-if="item.type === 'radio'">
          <n-radio-group v-model:value="_model[item.field]">
            <n-space>
              <n-radio v-for="ite in item.options" :key="ite.value" :value="ite.value" v-bind="item.radioProps">
                {{ ite.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </template>

        <!-- switch -->
        <template v-else-if="item.type === 'switch'">
          <n-switch v-model:value="_model[item.field]" :checked-value="item.switchProps?.checkedValue"
            :unchecked-value="item.switchProps?.uncheckedValue">
            <template #checked>
              {{ item.switchProps?.checkedLabel }}
            </template>
            <template #unchecked>
              {{ item.switchProps?.unCheckedLabel }}
            </template>
          </n-switch>
        </template>
      </n-form-item>
    </template>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { IFormProps } from '@/components'

const props = withDefaults(defineProps<IFormProps>(), {
  contentClass: '',
  model: () => ({}),
  schemas: () => []
})

const _model = toRef(props, 'model')
const _schemas = toRef(props, 'schemas')

const onDateChange = (item: any, time: any) => {
  if (item.dateProps?.onChange) {
    item.dateProps.onChange(time)
  }
}


</script>

<style scoped lang="scss"></style>