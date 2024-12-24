<template>
  <div>
    <table-pro ref="tableEl" :searchs="searchs" :searchParams="searchParams" :columns="columns"
      :export-api="ExportApi.rolesExcle" :req-api="SysApi.getRoleList">
      <template #title>
        <n-button secondary type="primary" @click="handleClick('新增')">
          <template #icon>
            <i-carbon-face-add />
          </template>
          新增角色
        </n-button>
      </template>
    </table-pro>

    <edit-form type="modal" :model="model" :title="title" ref="EditFormRef" :schemas="schemas" @submit="submit">
    </edit-form>

    <tree-select-modal childrenField="children" keyField="id" labelField="title" :multiple="true"
      v-model:checked-values="checkedAuthMenuList" :options="menuList" ref="TreeSelectModalRef" @confirm="authorize" />

  </div>
</template>


<script setup lang="tsx">
import { IFormSchema, TablePro, EditForm, IColumns, TreeSelectModal } from '@/components'
import { NButton } from 'naive-ui'
import { SysApi, ExportApi, IRole, AuthApi, IMenu } from '@/apis'
import { fullLoading } from '@/plugins'
import dayjs from 'dayjs';
import { ROLE_TYPE } from '@/constants';
import { ITreeCheckedValue } from '@/hooks';


const EditFormRef = shallowRef<InstanceType<typeof EditForm>>()
const tableEl = shallowRef<InstanceType<typeof TablePro>>()
const TreeSelectModalRef = ref<InstanceType<typeof TreeSelectModal>>()
const title = ref('')
const model = ref<Record<string, any>>({})
const columns = reactive<IColumns<IRole.Item>>([
  {
    key: 'index',
    title: '序号',
  },
  {
    key: 'name',
    title: '角色名称'
  },
  {
    key: 'flag',
    title: '角色标识',
  },
  {
    key: 'desc',
    title: '描述',
    noFilter: true,
    noSort: true
  },
  {
    key: 'type',
    title: '类型',
    noSort: true,
    noFilter: true,
    render: (row) => {
      const type = row.type
      const boo = type === ROLE_TYPE.BUILT_IN
      return (
        <n-tag type={boo ? 'error' : 'primary'}>{boo ? '内置角色' : '自定义角色'}</n-tag>
      )
    }
  },
  {
    key: 'createdAt',
    title: '创建时间',
    noFilter: true,
    noSort: true,
    render: (row) => {
      return dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    key: 'actions',
    title: '操作',
    width: 200,
    render: (row) => {
      return (
        <div class="flex">
          <n-button class="mr-8px" type="primary" size="small" onClick={() => { handleClick('编辑', row) }
          }>
            编辑
          </n-button>

          <n-button class="mr-8px" size="small" onClick={() => { handleClick('授权', row) }
          }>
            授权
          </n-button>

          <n-button class="mr-8px" type="error" size="small" onClick={() => { handleRemove(row) }}>
            删除
          </n-button>
        </div>
      )
    }
  }
])


const searchParams = reactive({
  name: '',
  desc: ''
})

const searchs = reactive<IFormSchema[]>([
  {
    type: 'input',
    field: 'name',
    label: '角色名称'
  },
  {
    type: 'input',
    field: 'desc',
    label: '角色描述'
  }
])


const schemas = ref<IFormSchema[]>([
  {
    type: 'input',
    field: 'flag',
    label: '角色标识',
    inputProps: {
      placeholder: '请填写角色标识'
    },
    rules: [{ required: true, message: '该项必填', trigger: 'blur' }]
  },
  {
    type: 'input',
    field: 'name',
    label: '角色名称',
    inputProps: {
      placeholder: '请填写角色名称'
    },
    rules: [{ required: true, message: '该项必填', trigger: 'blur' }]
  },
  {
    type: 'input',
    field: 'desc',
    label: '角色描述',
    inputProps: {
      placeholder: '请填写角色描述'
    }
  }
])

const menuList = ref<IMenu.Item[]>([])
const checkedAuthMenuList = ref<number[]>([])
const currentId = ref(0)

// 授权
const authorize = async (keys: ITreeCheckedValue) => {
  try {
    fullLoading()
    await SysApi.assignRoleMenu(currentId.value, keys as number[])
    await tableEl.value?.reload()
    window.$message.success('授权成功')
  } finally {
    fullLoading(false)
  }

}

// 新增、编辑
const handleClick = async (flag: string, row?: IRole.Item) => {
  title.value = flag
  if (title.value === '新增') {
    model.value = {}
    EditFormRef.value?.open()
    return
  }

  if (title.value === '编辑') {
    model.value = row!
    EditFormRef.value?.open()
  }

  if (title.value === '授权') {
    const { data } = await SysApi.getRoleMenu(row!.id)
    checkedAuthMenuList.value = data.map((ite) => ite.id)
    currentId.value = row!.id
    TreeSelectModalRef.value?.open()
  }
}

// 提交注册
const submit = async () => {
  fullLoading()
  try {
    const { id, name, desc, flag } = model.value
    const params = { name, desc, flag }
    if (title.value === '新增') {
      await SysApi.createRole(params)
    } else if (title.value === '编辑') {
      await SysApi.updateRole(id, params)
    }
  } finally {
    tableEl.value?.reload()
    EditFormRef.value?.close()
    window.$message?.success('操作成功')
    fullLoading(false)
  }
}

// 删除
const handleRemove = async (row: IRole.Item) => {
  const { id, name } = row
  window.$dialog.error({
    positiveText: '确认',
    negativeText: '取消',
    title: '删除角色',
    content: `确定删除${name}?`,
    onPositiveClick: async () => {
      try {
        fullLoading()
        await SysApi.removeRole(id)
        window.$message.success('删除成功')
        tableEl.value?.reload()
      } finally {
        fullLoading(false)
      }
    }
  })

}

onMounted(async () => {
  const res = await AuthApi.getMenuList()
  menuList.value = res.data
})

</script>

<style scoped lang="scss"></style>
