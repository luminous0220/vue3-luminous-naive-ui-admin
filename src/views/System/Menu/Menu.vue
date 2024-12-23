<template>
  <div>
    <table-pro ref="tableEl" :searchs="searchs" :searchParams="searchParams" :scroll-x="1600" :columns="columns" child
      :req-api="AuthApi.getMenuList" :callBack="callBack">
      <template #title>
        <n-button secondary type="primary" @click="handleClick('新增')">
          <template #icon>
            <i-carbon-face-add />
          </template>
          新增菜单
        </n-button>
      </template>
    </table-pro>

    <edit-form type="drawer" :model="model" :title="title" ref="EditFormRef" :schemas="editSchemas" @submit="submit">
      <template #top>
        <div class="flex justify-center mb-26px ">
          <n-tabs v-model:value="tabValue" type="line" animated justify-content="space-evenly"
            :on-update:value="changeTabs">
            <n-tab-pane :disabled="title === '编辑'" class="p-0!" :name="MENU_TYPE.D" tab="目录">
            </n-tab-pane>
            <n-tab-pane :disabled="title === '编辑'" class="p-0!" :name="MENU_TYPE.M" tab="菜单">
            </n-tab-pane>
            <n-tab-pane :disabled="title === '编辑'" class="p-0!" :name="MENU_TYPE.B" tab="按钮">
            </n-tab-pane>
          </n-tabs>
        </div>
      </template>
    </edit-form>
  </div>
</template>


<script setup lang="tsx">
import { IFormSchema, TablePro, EditForm, IColumns, Icon } from '@/components'
import { NButton } from 'naive-ui'
import { AuthApi, IMenu, SysApi } from '@/apis'
import { MENU_TYPE } from '@/constants'
import { fullLoading } from '@/plugins'

const callBack = (res: any) => res.data

const EditFormRef = shallowRef<InstanceType<typeof EditForm>>()
const tableEl = shallowRef<InstanceType<typeof TablePro>>()
const title = ref('')
const tabValue = ref(MENU_TYPE.M)
const model = ref<Record<string, any>>({})

const columns = reactive<IColumns<IMenu.Item>>([
  {
    key: 'index',
    title: '序号',
  },
  {
    key: 'title',
    title: '菜单名称/功能名称',
    noFilter: true,
    noSort: true
  },
  {
    key: 'path',
    title: '路由地址',
    noFilter: true,
    noSort: true
  },
  {
    key: 'icon',
    title: '图标',
    noSort: true,
    noFilter: true,
    render: (row) => {
      return (
        <Icon icon={row.icon} />
      )
    }
  },
  {
    key: 'componentPath',
    title: '组件路径',
    noFilter: true,
    noSort: true
  },
  {
    key: 'name',
    title: '路由名称',
    noFilter: true,
    noSort: true
  },
  {
    key: 'status',
    title: '菜单状态/功能状态',
    noSort: true,
    noFilter: true,
    render: (row) => {
      const status = row.status
      return (
        <n-tag type={status ? 'success' : 'error'}>{status ? '启用' : '关闭'}</n-tag>
      )
    }
  },
  {
    key: 'isKeepAlive',
    title: '是否启用缓存',
    noSort: true,
    noFilter: true,
    render: (row) => {
      const status = row.isKeepAlive
      return (
        <n-tag type={status ? 'success' : 'error'}>{status ? '启用' : '关闭'}</n-tag>
      )
    }
  },
  {
    key: 'sort',
    title: '排序',
    noFilter: true,
    noSort: true
  },
  {
    key: 'permission',
    title: '功能标识',
    noFilter: true,
    noSort: true
  },
  {
    key: 'redirect',
    title: '默认跳转',
    noFilter: true,
    noSort: true
  },

  {
    key: 'actions',
    title: '操作',
    width: 150,
    render: (row) => {

      return (
        <div>
          <n-button class="mr-8px" type="primary" size="small" onClick={() => { handleClick('编辑', row) }}>
            编辑
          </n-button>
          <n-button class="mr-8px" type="error" size="small" onClick={() => { handleRemove(row) }}>
            删除
          </n-button>
        </div >
      )
    }
  }
])


const searchParams = reactive({
  title: '',
})

const searchs = reactive<IFormSchema[]>([
  {
    type: 'input',
    field: 'title',
    label: '菜单名称',
  },
])


const editSchemas = ref<IFormSchema[]>([])
// 父级菜单选择的option列表
const parentList = ref<IMenu.Item[]>([])

// 新增、编辑
const handleClick = async (flag: string, row?: IMenu.Item) => {
  title.value = flag
  const { data } = await AuthApi.getMenuList()
  parentList.value = data
  if (title.value === '新增') {
    model.value = {}
    changeTabs(MENU_TYPE.M)
    EditFormRef.value?.open()
    return
  }

  if (title.value === '编辑') {
    model.value = row!
    changeTabs(row?.type!)
    EditFormRef.value?.open()
  }

}

// 切换tab
const changeTabs = (value: string | number) => {
  // 重置表单域参数
  tabValue.value = value as number
  setFormSchema(value as MENU_TYPE)
}


// 设置表单schema
const setFormSchema = (type: MENU_TYPE) => {
  model.value.sort = 0
  if (type === MENU_TYPE.D) {
    model.value.isKeepAlive = 0
    model.value.status = 1
    editSchemas.value = [
      {
        type: 'input',
        field: 'title',
        label: '目录名称',
        inputProps: {
          placeholder: '请填写目录名称'
        },
        rules: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        type: 'input',
        field: 'path',
        label: '路由地址',
        inputProps: {
          placeholder: '请填写路由地址'
        },
        rules: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        type: 'input',
        label: '图标',
        field: 'icon',
        inputProps: {
          placeholder: '请选择图标'
        },
        rules: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        type: 'input',
        label: '路由名称',
        field: 'name',
        inputProps: {
          placeholder: '请填写路由名称（英文，首字母大写）'
        }
      },
      {
        type: 'input',
        label: '组件路径',
        field: 'componentPath',
        inputProps: {
          placeholder: '请填写组件路径'
        }
      },
      {
        type: 'input',
        label: '默认跳转',
        field: 'redirect'
      },
      {
        type: 'input-number',
        label: '排序',
        field: 'sort'
      },
      {
        type: 'switch',
        field: 'status',
        label: '状态',
        switchProps: {
          checkedLabel: '启用',
          unCheckedLabel: '关闭',
          checkedValue: 1,
          uncheckedValue: 0
        }
      }
    ]
  }

  if (type === MENU_TYPE.M) {
    model.value.isKeepAlive = 1
    model.value.status = 1
    editSchemas.value = [
      {
        type: 'input',
        field: 'title',
        label: '菜单名称',
        inputProps: {
          placeholder: '请填写菜单名称'
        },
        rules: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        type: 'input',
        field: 'path',
        label: '访问路径',
        inputProps: {
          placeholder: '请填菜单访问路径'
        },
        rules: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        type: 'input',
        label: '路由名称',
        field: 'name',
        inputProps: {
          placeholder: '请填写路由名称（英文，首字母大写）'
        },
        rules: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        type: 'input',
        label: '图标',
        field: 'icon',
        inputProps: {
          placeholder: '请选择图标'
        },
        rules: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        type: 'input',
        label: '组件地址',
        field: 'componentPath',
        inputProps: {
          placeholder: '请填写组件地址'
        },
        rules: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        type: 'tree-select',
        field: 'parentId',
        label: '父级菜单',
        treeProps: {
          keyField: "id",
          labelField: "title",
          childrenField: "children",
        },
        options: parentList.value
      },
      {
        type: 'input',
        label: '默认跳转',
        field: 'redirect'
      },

      {
        type: 'input-number',
        label: '排序',
        field: 'sort'
      },

      {
        type: 'switch',
        field: 'status',
        label: '菜单状态',
        switchProps: {
          checkedLabel: '启用',
          unCheckedLabel: '关闭',
          checkedValue: 1,
          uncheckedValue: 0
        }
      },
      {
        type: 'switch',
        field: 'isKeepAlive',
        label: '页面缓存',
        switchProps: {
          checkedLabel: '启用',
          unCheckedLabel: '关闭',
          checkedValue: 1,
          uncheckedValue: 0
        }
      }
    ]
  }

  if (type === MENU_TYPE.B) {
    model.value.isKeepAlive = 0
    model.value.status = 1
    editSchemas.value = [
      {
        type: 'input',
        field: 'title',
        label: '功能名称',
        inputProps: {
          placeholder: '请填写功能名称'
        },
        rules: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        type: 'input',
        field: 'permission',
        label: '功能标识',
        inputProps: {
          placeholder: '请填写功能标识'
        },
        rules: [{ required: true, message: '该项必填', trigger: 'change' }]
      },
      {
        type: 'tree-select',
        field: 'parentId',
        label: '所属页面',
        treeProps: {
          keyField: "id",
          labelField: "title",
          childrenField: "children",
        },
        options: parentList.value
      },
      {
        type: 'switch',
        field: 'status',
        label: '按钮状态',
        switchProps: {
          checkedLabel: '启用',
          unCheckedLabel: '关闭',
          checkedValue: 1,
          uncheckedValue: 0
        }
      }
    ]
  }
}

// 提交注册
const submit = async () => {
  fullLoading()
  try {
    const {
      id,
      name,
      parentId,
      path,
      icon,
      permission,
      componentPath,
      title: _title,
      isKeepAlive,
      redirect,
      status,
      sort,
      type
    } = model.value
    if (title.value === '新增') {
      if (tabValue.value === MENU_TYPE.D) {
        await SysApi.createMenu({
          title: _title,
          icon,
          name,
          componentPath,
          sort,
          status,
          redirect,
          permission: "",
          parentId: null,
          path: "",
          isKeepAlive: 0,
          type: MENU_TYPE.B
        })
      } else if (tabValue.value === MENU_TYPE.M) {
        await SysApi.createMenu({
          title: _title,
          path,
          name,
          icon,
          componentPath,
          parentId: parentId[0],
          redirect,
          sort,
          status,
          isKeepAlive,
          permission: '',
          type: MENU_TYPE.B
        })
      } else if (tabValue.value === MENU_TYPE.B) {
        await SysApi.createMenu({
          title: _title,
          permission,
          parentId: parentId[0],
          status,
          path: '',
          name: '',
          icon: '',
          componentPath: '',
          redirect: '',
          sort: 0,
          isKeepAlive: 0,
          type: MENU_TYPE.B
        })
      }

    } else if (title.value === '编辑') {
      await SysApi.updateMenu(id, {
        name,
        parentId: parentId || null,
        path,
        icon,
        permission,
        componentPath,
        title: _title,
        isKeepAlive,
        redirect,
        status,
        sort,
        type
      })
    }
  } finally {
    tableEl.value?.reload()
    EditFormRef.value?.close()
    window.$message?.success('操作成功')
    fullLoading(false)
  }
}

// 删除
const handleRemove = async (row: IMenu.Item) => {
  const { id, title } = row
  window.$dialog.error({
    positiveText: '确认',
    negativeText: '取消',
    title: '删除菜单',
    content: `确定删除${title}?`,
    onPositiveClick: async () => {
      fullLoading()
      await SysApi.removeMenu(id)
      fullLoading(false)
      window.$message.success('删除成功')
      tableEl.value?.reload()
    }
  })

}

</script>

<style scoped lang="scss"></style>
