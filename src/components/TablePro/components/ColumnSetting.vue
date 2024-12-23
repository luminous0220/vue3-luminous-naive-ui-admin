<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div class="cursor-pointer flex-center">
        <n-popover trigger="click" class="min-w-180px max-w-320px" placement="bottom-end">
          <template #trigger>
            <n-icon size="18">
              <i-ep-setting />
            </n-icon>
          </template>
          <template #header>
            <div class="table-toolbar-inner-popover-title">
              <n-space justify="space-between" align="center">
                <h4>列设置</h4>
              </n-space>
            </div>
          </template>
          <div class="max-h-[300px] overflow-y-auto">
            <n-checkbox-group v-model:value="checkList" @update:value="onChange">
              <VueDraggable ghostClass="ghost" :animation="150" ref="el" v-model="columns" handle=".handle">
                <template v-for="(item, index) in columns" :key="index">
                  <div class="px-6px py-4px rounded-4px mb-4px flex justify-between items-center">
                    <n-checkbox :value="item.key" :label="item.title" />

                    <i-carbon-list-boxes class="handle cursor-move mr-8px" />
                  </div>
                </template>
              </VueDraggable>
            </n-checkbox-group>
          </div>
        </n-popover>
      </div>
    </template>
    <span>列设置</span>
  </n-tooltip>
</template>

<script setup lang="ts">
import { IColumns } from '..'
import { VueDraggable } from 'vue-draggable-plus'


const columns = defineModel<IColumns>('columns', {
  required: true,
  default: []
})

const checkList = ref<Array<string | number>>([])

const onChange = (list: (string | number)[]) => {
  columns.value = columns.value.map((item) => {
    if (list.includes(item.key!)) {
      return { ...item, hide: false }
    } else {
      return { ...item, hide: true }
    }
  })
}



onMounted(() => {
  checkList.value = columns.value.reduce(
    (pre, cur) => {
      if (!cur.hide) {
        return pre.concat(cur.key!)
      }
      return pre
    },
    [] as Array<string | number>
  )

})
</script>

<style scoped lang="scss">
.ghost {
  background-color: var(--gray-1) !important;
}
</style>
