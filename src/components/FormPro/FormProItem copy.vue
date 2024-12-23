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
          <div class="w-full">
            <div class="flex flex-nowrap cursor-pointer" @click="openTreeSelectModal(item)">
              <n-card @vue:mounted="initTreeSelectValue(item)" class=" flex-1 mr-12px cursor-pointer"
                content-class="px-12px! py-6px!">
                <template v-if="selectedLabels.length">
                  <n-tag class="mr-4px" v-for="(item, idx) in selectedLabels" :key="idx">{{
                    item }}</n-tag>
                </template>
                <div v-else class="text-[--text-color-2] text-13px flex items-center">请点击选择 <i-carbon-touch-1
                    class="ml-4px" />
                </div>
              </n-card>
            </div>
            <modal v-model:show="isShowTreeModal" ref="TreeModalRef"
              content-class="max-h-60vh pr-8px!  mr-8px! overflow-auto" class="edit-form w-420px!" title="请选择"
              preset="card" :trap-focus="false">

              <n-tree size="large" block-line :data="item.options" :default-expand-all="isExpand" check-on-click
                :multiple="item.treeProps?.multiple" :cascade="!!item.treeProps?.multiple" v-bind="item.treeProps"
                checkable :checked-keys="checkedKeys"
                :on-update:checked-keys="(keys, _, meta) => updateSelectKey(keys, _, meta, item)" />

              <template #footer>
                <div class="flex justify-center items-center">
                  <n-button class="mr-12px" @click="isExpand = !isExpand">
                    <template #icon>
                      <i-carbon-chevron-up v-if="isExpand" />
                      <i-carbon-chevron-down v-else />
                    </template>
                    {{ isExpand ? '收起' : '展开' }}</n-button>
                  <n-button v-if="item.treeProps?.multiple" class="mr-12px" @click="treeSelectAll(item)">
                    <template #icon>
                      <i-carbon-select-window />
                    </template>
                    全选</n-button>
                  <n-button class="mr-12px" @click="clearTreeSelectKeys(item)">
                    <template #icon>
                      <i-carbon-erase />
                    </template>
                    清空</n-button>
                  <n-button type="primary" @click="confirmTreeSelect(item)">确认</n-button>
                </div>
              </template>
            </modal>
          </div>
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
import { IFormProps, Modal } from '@/components'
import { useTreeSelectHook } from '@/hooks'

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


const { isShowTreeModal,
  selectedLabels,
  checkedKeys,
  isExpand,
  initTreeSelectValue,
  openTreeSelectModal,
  updateSelectKey,
  treeSelectAll,
  clearTreeSelectKeys,
  confirmTreeSelect } = useTreeSelectHook(_model)



</script>

<style scoped lang="scss"></style>