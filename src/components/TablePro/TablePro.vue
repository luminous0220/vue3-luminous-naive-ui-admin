<template>
  <div class="bg-[--white-1] p-20px w-full h-full rounded-8px flex flex-col overflow-hidden" v-loading="loading">
    <div id="table-search" v-if="searchs?.length" class="flex items-center justify-between">
      <form-pro :showFooter="false" ref="FormProRef" submitText="查询" justify="start"
        :label-placement="GlobalSto.isMobile ? 'top' : 'left'" v-model:model="_searchParams" :schemas="searchs">
        <template #content="{ scope }">
          <FormProItem content-class="flex flex-wrap" :model="scope.model" :schemas="scope.schemas">
            <n-form-item>
              <n-button @click="handleSearch" class="mr-12px" type="primary" secondary>查询</n-button>
              <n-button type="warning" @click="handleReset" secondary>重置</n-button>
            </n-form-item>
          </FormProItem>
        </template>
      </form-pro>
    </div>
    <!-- 头部栏 -->
    <div id="table-header" class="flex items-center justify-between">
      <!--顶部左侧区域-->
      <n-space>
        <n-button v-if="props.exportApi" type="primary" @click="exportFile">
          <template #icon>
            <i-carbon-cloud-download />
          </template>
          导出表格数据</n-button>
        <slot name="title"> {{ title }} </slot>
      </n-space>

      <!--顶部右侧区域-->
      <div class="flex items-center justify-between min-w-88px">
        <slot name="toolbar"></slot>

        <!--刷新-->
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-icon @click="refresh" class="cursor-pointer" size="24">
              <i-ep-refresh />
            </n-icon>
          </template>
          <span>刷新</span>
        </n-tooltip>

        <!--密度-->
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="flex-center">
              <n-dropdown @select="densitySelect" trigger="click" :options="densityOptions" v-model:value="density">
                <n-icon class="cursor-pointer" size="24">
                  <i-ep-scale-to-original />
                </n-icon>
              </n-dropdown>
            </div>
          </template>
          <span>密度</span>
        </n-tooltip>
        <!--表格设置单独抽离成组件-->
        <ColumnSetting v-model:columns="columns" :rowKey="rowKey" />
      </div>
    </div>
    <!-- 表格本体 -->
    <n-data-table class="mt-16px flex-grow-1 rounded-8px min-h-368px" ref="tableElRef"
      :style="{ height: maxHeightCom + 'px' }" flex-height :striped="striped" :columns="_columns" :size="density"
      :row-key="createRowKey" v-model:checked-row-keys="checkedRowKeys" :scroll-x="1280" :data="comTableData"
      v-bind="$attrs">
    </n-data-table>
    <n-pagination id="table-pagination" class="flex-center mt-16px" :item-count="pageParam.total"
      v-model:page="pageParam.pageNumber" v-model:page-size="pageParam.pageSize"
      @update-page-size="() => (pageParam.pageNumber = 1)" :page-sizes="[10, 20, 30, 40]" show-size-picker />
  </div>
</template>

<script setup lang="ts">
import { useTableHook } from '@/hooks'
import { ITableProps } from '.'
import { useGlobalStore } from '@/stores'
import { debounce, isArray } from 'lodash'
import FormPro from '../FormPro/FormPro.vue'
import ColumnSetting from './components/ColumnSetting.vue'
import { DataTableRowKey } from 'naive-ui'
import { duplicateRemove } from '@/utils'
import FormProItem from '@/components/FormPro/FormProItem.vue'

const GlobalSto = useGlobalStore()

const FormProRef = shallowRef<InstanceType<typeof FormPro>>()

const densityOptions = [
  {
    type: 'menu',
    label: '紧凑',
    key: 'small'
  },
  {
    type: 'menu',
    label: '默认',
    key: 'medium'
  },
  {
    type: 'menu',
    label: '宽松',
    key: 'large'
  }
]

const props = withDefaults(defineProps<ITableProps>(), {
  data: () => [],
  searchs: () => [],
  searchParams: () => ({}),
  rowKey: 'id',
  striped: true,
  title: '表格',
  isPage: true,
  reqAuto: true,
  childrenKey: 'children'
})

const _searchParams = toRef(props, 'searchParams')

const columns = defineModel<any[]>('columns', {
  required: true,
  default: []
})

const _columns = computed(() => {
  columns.value.forEach((ite, idx) => {
    ite.ellipsis = {
      tooltip: true
    }

    // 当为手机端时，固定操作栏在右侧
    if (ite.key === 'actions') {
      ite.fixed = GlobalSto.isMobile ? '' : 'right'
    }

    ite.align = 'center'
    ite.resizable = true
    ite.className = ite.key
  })
  return columns.value.filter((item) => !item.hide)
})


const density = ref<any>('small')
const maxHeightCom = ref(100)
const checkedRowKeys = ref<DataTableRowKey[]>([])


// table 数据请求 hook
const { reload, loading, pageParam, list, loadData, search, exportFile } =
  useTableHook(props.isPage, _searchParams, props.exportApi, props.reqApi, props.callBack,)

// 递归处理数据，添加index
const recurHandleDataIndex = (arr: any[], parent: any) => {
  const key = props.childrenKey
  arr.forEach((item, idx) => {
    const num = idx + 1
    if (!parent) item.index = num
    else item.index = parent.index + '.' + num
    if (isArray(item[key]) && item[key].length) recurHandleDataIndex(item[key], item)
  })
}

// 处理表格数据
const comTableData = computed(() => {
  // 如果静态数据不存在，则获取通过接口返回的list
  if (!props.data.length) {
    const newList = list.value.map((item: any, index) => ({ ...item, index: index + 1 }))
    recurHandleDataIndex(newList, null)
    return newList
  }
  // 否则直接处理静态数据
  const { pageNumber, pageSize } = pageParam
  pageParam.total = props.data.length
  // 加上index
  const newList = props.data
    .map((item, index) => ({ ...item, index: index + 1 }))
    .slice((pageNumber - 1) * pageSize, pageSize * pageNumber)
  recurHandleDataIndex(newList, null)
  return newList
})


watch(
  () => comTableData.value.length,
  (newVal) => {
    if (!newVal) return
    columns.value = columns.value.map((item) => {
      // 选择列、操作列不需要筛选与排序
      if (item.type === 'selection' || item.key === 'actions') return item
      // 处理排序
      if (!item.noSort) {
        if (!item.sorter) item.sorter = 'default'
      }
      // 处理过滤
      if (!item.noFilter) {

        // 当使用filterOptionsMap时，使用filterOptionsMap返回的数据作为过滤选项
        if (item.filterOptionsMap) {
          item.filterOptions = item.filterOptionsMap(comTableData.value)
        }
        // 否则，如果filterOptions不存在，则默认使用下方逻辑生成过滤选项，并去重
        else if (!item.filterOptions) {
          const options = comTableData.value.reduce((acc, ite) => {
            const value = ite[item.key!]
            if (value === undefined || value === null || value === '') return acc
            return acc.concat({
              label: value,
              value: value
            })
          }, [])
          item.filterOptions = duplicateRemove(options)
        }

        // 如果filter不存在，则使用默认的filter函数
        if (!item.filter) {
          item.filter = (value: any, row: any) => {
            return row[item.key!] == value
          }
        }
      }

      return item
    })
  },
  { immediate: true }
);


// 顶部搜素表单校验
const handleSearch = async (e: Event) => {
  e && e.preventDefault()
  const valid = await FormProRef.value?.validate()
  if (valid) search()
}

// 顶部搜索表单参数重置
const handleReset = async (e: Event) => {
  e && e.preventDefault()
  FormProRef.value?.resetFields()
  pageParam.pageNumber = 1
  handleSearch(e)
}

// 表格密度选择
const densitySelect = (e: string) => {
  density.value = e
}

// 选中行的 key 值（默认为 id）
const createRowKey = (row: any) => row[props.rowKey]

// 刷新表格
const refresh = async () => {
  await reload()
  window.$message.success('刷新成功')
}


// 计算表格高度
const calcTableHeight = () => {
  if (!columns.value.some((ite) => ite.key === 'actions')) return
  const mainDom = document.querySelector('#layout-main')
  const searchDom = document.querySelector('#table-search')
  const headerDom = document.querySelector('#table-header')
  const pageDom = document.querySelector('#table-pagination')

  if (!mainDom) return

  const h1 = searchDom?.clientHeight || 0
  const h2 = headerDom?.clientHeight || 0
  const h3 = pageDom?.clientHeight || 0

  if (GlobalSto.isMobile) {
    maxHeightCom.value = 600
    return
  }
  maxHeightCom.value = mainDom.clientHeight - h1 - h2 - h3 - 80
}


const _ = debounce(calcTableHeight, 500)


onMounted(() => {
  calcTableHeight()
  // 自动请求
  props.reqAuto && loadData()
  window.addEventListener('resize', _)
})

onUnmounted(() => {
  window.removeEventListener('resize', _)
})


defineExpose({
  reload,
  checkedRowKeys
})
</script>

<style lang="scss">
tr.level-1 {
  background-color: #fff;
  /* 顶层 */
}

tr.level-2 {
  background-color: #f9f9f9;
  /* 第二层 */
}

tr.level-3 {
  background-color: #f0f0f0;
  /* 第三层 */
}
</style>
