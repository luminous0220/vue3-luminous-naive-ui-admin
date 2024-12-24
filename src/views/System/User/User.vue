<template>
  <div>
    <table-pro ref="tableEl" :searchs="searchs" :searchParams="searchParams" :scroll-x="1600" :columns="columns"
      :export-api="ExportApi.usersExcle" :req-api="SysApi.getUserList">
      <template #title>
        <n-button secondary type="success" @click="onCreate">
          <template #icon>
            <i-carbon-face-add />
          </template>
          新增用户
        </n-button>
        <n-button secondary type="error" @click="batchRemove">
          <template #icon>
            <i-carbon-row-delete />
          </template>
          批量删除
        </n-button>
        <n-button secondary @click="onCreate">
          <template #icon>
            <i-carbon-document-export />
          </template>
          导出上传模板
        </n-button>

        <ManualUpload :max="1" :file-ext="['xlsx']" type="modal" @success="uploadAndCreate" btnText="批量新增用户">
        </ManualUpload>
      </template>
    </table-pro>
    <edit-form :type="formType" :model="model" :title="title" ref="EditFormRef" :schemas="editSchemas" @submit="submit">
    </edit-form>
  </div>
</template>

<script setup lang="tsx">
import { IFormSchema, TablePro, EditForm, ITableProps, IColumns, ManualUpload, IFormType } from '@/components'
import { NButton } from 'naive-ui'
import { ExportApi, IRole, IUser, SysApi } from '@/apis'
import { USER_SEX_OPTIONS, USER_STATUS, USER_STATUS_OPTIONS } from '@/constants'
import { duplicateRemove, fileUrl } from '@/utils'
import { AvatarEditor } from '@/components'
import dayjs from 'dayjs'
import { fullLoading } from '@/plugins'
import { UploadApi } from '@/apis/upload.api'

const EditFormRef = shallowRef<InstanceType<typeof EditForm>>()
const tableEl = shallowRef<InstanceType<typeof TablePro>>()
const title = ref('')
const formType = ref<IFormType>('drawer')
const model = ref<Record<string, any>>({})

const columns = reactive<IColumns<IUser.Item>>([
  {
    type: 'selection',
  },
  {
    key: 'index',
    title: '序号',
  },
  {
    key: 'username',
    title: '用户名'
  },
  {
    key: 'email',
    title: '邮箱'
  },
  {
    key: 'nickname',
    title: '昵称'
  },
  {
    key: 'roles',
    width: '160px',
    title: '角色',
    noSort: true,
    filterOptionsMap: (data) => {
      const roles = data.reduce((acc: IRole.Item[], item) => {
        if (item.roles.length) return [...item.roles, ...acc]
        else return acc
      }, []).map((item) => ({ label: item.name, value: item.flag }))

      return duplicateRemove(roles)
    },
    filter: (value, row) => {
      return row.roles.some((item) => item.flag === value)
    },
    render: (row) => {
      return (
        <div class="flex flex-wrap justify-center">
          {row.roles?.map((ite) => {
            return (
              <n-tag type="warning" class="mr-4px mb-2px">
                {ite.name}
              </n-tag>
            )
          })}
        </div>
      )
    }
  },
  {
    key: 'sex',
    title: '性别',
    filterOptions: USER_SEX_OPTIONS,
    render: (row) => {
      const sex = row.sex
      return <n-tag type={sex ? 'success' : 'error'}>{sex ? '男' : '女'}</n-tag>
    }
  },
  {
    key: 'birthday',
    title: '生日',
    render: (row) => {
      return row.birthday
    }
  },
  {
    key: 'status',
    title: '状态',
    filterOptions: USER_STATUS_OPTIONS,
    render: (row) => {
      const status = row.status
      if (status === USER_STATUS.PENDING) {
        return <n-tag type="info">审核中</n-tag>
      } else if (status === USER_STATUS.ACTIVE) {
        return <n-tag type="success">正常</n-tag>
      } else {
        return <n-tag type="error">冻结</n-tag>
      }
    }
  },
  {
    key: 'avatar',
    title: '头像',
    noSort: true,
    noFilter: true,
    render: (row) => {
      return <img src={fileUrl(row.avatar)} class="w-full"></img>
    }
  },
  {
    key: 'sign',
    title: '签名'
  },
  {
    key: 'createdAt',
    title: '创建时间',
    width: '200px',
    filterOptionsMap: (data) => {
      const times = data.map((item) => {
        const val = dayjs(item.createdAt).format('YYYY-MM-DD')
        return { label: val, value: val }
      })
      return duplicateRemove(times)
    },
    filter: (value, row) => {
      return dayjs(row.createdAt).format('YYYY-MM-DD') == value
    },
    render: (row) => {
      return new Date(row.createdAt).toLocaleString()
    }
  },
  {
    key: 'actions',
    title: '操作',
    width: 150,
    render: (row) => {
      const options = reactive([
        {
          label: '重置密码',
          key: 'reset'
        },
        {
          label: row.status === USER_STATUS.LOCKED ? '激活' : '冻结',
          key: 'freeze'
        },
        {
          label: '删除',
          key: 'delete'
        },
      ])


      return (
        <div>
          <n-button class="mr-8px" type="primary" size="small" onClick={() => { onAuthorize(row) }}>
            授权
          </n-button>
          <n-dropdown trigger="hover" options={options} onSelect={(key: string) => { handleSelect(key, row) }}>
            {{
              default: () => <n-button size="small"> 更多 </n-button>,
            }}
          </n-dropdown>
        </div >
      )
    }
  }
])

const handleSelect = (key: string, row: IUser.Item) => {
  switch (key) {
    case 'reset':
      resetPwd(row)
      break
    case 'freeze':
      updateStatus(row)
      break
    case 'delete':
      handleRemove(row)
      break
  }
}

const searchParams = reactive({
  username: '',
  email: '',
  startTime: '',
  endTime: '',
  time: null
})

const searchs = reactive<IFormSchema[]>([
  {
    type: 'input',
    field: 'username',
    label: '用户名',
  },
  {
    type: 'input',
    field: 'email',
    label: '邮箱',
  },
  {
    type: 'date',
    field: 'time',
    dateProps: {
      type: 'daterange',
      onUpdateValue: (time) => {
        searchParams.startTime = dayjs(time[0]).format('YYYY-MM-DD')
        searchParams.endTime = dayjs(time[1]).format('YYYY-MM-DD')
      },
    },
    label: '创建日期',
  },
])


const editSchemas = ref<IFormSchema[]>([])

// 创建
const onCreate = () => {
  title.value = '新建'
  formType.value = 'drawer'
  model.value = {
    username: '',
    email: '',
    nickname: '',
    sex: 1,
    birthday: null,
    avatar: '',
    sign: '',
  }
  editSchemas.value = [
    {
      type: 'input',
      field: 'username',
      label: '用户名',
      inputProps: {
        placeholder: '请填写用户名'
      },
      rules: [{ required: true, message: '该项必填', trigger: 'change' }]
    },
    {
      type: 'input',
      field: 'email',
      label: '邮箱',
      inputProps: {
        placeholder: '请填写邮箱'
      },
      rules: [{ required: true, message: '该项必填', trigger: 'change' }]
    },
    {
      type: 'input',
      field: 'nickname',
      label: '昵称',
      inputProps: {
        placeholder: '请填写昵称'
      },
      rules: [{ required: true, message: '该项必填', trigger: 'change' }]
    },
    {
      type: 'radio',
      field: 'sex',
      label: '性别',
      options: USER_SEX_OPTIONS,
    },
    {
      type: 'date',
      field: 'birthday',
      label: '生日',
      rules: [{ required: true, message: '该项必填', trigger: 'change' }]
    },
    {
      field: 'avatar',
      label: '上传头像',
      render: () => {
        return <AvatarEditor disabled={true} />
      }
    },
    {
      type: 'input',
      field: 'sign',
      label: '签名',
      inputProps: {
        type: 'textarea'
      },
      rules: [{ required: true, message: '该项必填', trigger: 'change' }]
    }
  ]
  EditFormRef.value?.open()
}

// 授权
const onAuthorize = async (row: IUser.Item) => {
  const { data } = await SysApi.getRoleList()
  formType.value = 'modal'
  title.value = '授权'
  editSchemas.value = [
    {
      type: 'select',
      field: 'roleIds',
      label: '角色',
      selectProps: {
        placeholder: '请选择角色（可多选）',
        multiple: true,
      },
      options: data.list.map((ite) => {
        return {
          label: ite.name,
          value: ite.id
        }
      }),
    }
  ]

  const roleIds = row.roles?.map((r) => r.id)
  model.value = { roleIds, id: row.id }
  EditFormRef.value?.open()
}

// 提交注册
const submit = async () => {
  fullLoading()
  try {
    const { username,
      email,
      nickname,
      sex,
      birthday,
      avatar,
      sign,
      id,
      roleIds
    } = model.value
    if (title.value === '新建') {
      const params = {
        username,
        email,
        nickname,
        sex,
        birthday,
        avatar,
        sign,
        password: "123456",
      }
      await SysApi.createUser(params)

    } else if (title.value === '授权') {
      await SysApi.assignRole(id, roleIds)
    }
  } finally {
    tableEl.value?.reload()
    EditFormRef.value?.close()
    window.$message?.success('操作成功')
    fullLoading(false)
  }
}

// 上传并批量创建用户
const uploadAndCreate = async (files: File[]) => {
  await UploadApi.batchCreateUser({ file: files[0] })
  await tableEl.value?.reload()
  window.$message?.success('批量新增成功')
}

// 重置密码
const resetPwd = async (row: IUser.Item) => {
  const { id, username } = row
  window.$dialog.warning({
    positiveText: '确认',
    negativeText: '取消',
    title: '重置密码',
    content: `确定重置用户 ${username} 的密码吗??`,
    onPositiveClick: async () => {
      await SysApi.resetPassword(id)
      window.$message.success('已将密码重置为123456')
      tableEl.value?.reload()
    }
  })
}

// 更改用户状态
const updateStatus = async (row: IUser.Item) => {
  const { id, username } = row

  const status = row.status === USER_STATUS.LOCKED ? USER_STATUS.ACTIVE : USER_STATUS.LOCKED

  const tip = row.status === USER_STATUS.LOCKED ? '激活' : '冻结'

  window.$dialog.warning({
    positiveText: '确认',
    negativeText: '取消',
    title: `${tip}用户`,
    content: `是否${tip} ${username}`,
    onPositiveClick: async () => {
      await SysApi.updateStatus(id, status)
      window.$message.success('操作成功')
      tableEl.value?.reload()
    }
  })
}

// 删除
const handleRemove = async (row: IUser.Item) => {
  const { id, username } = row

  window.$dialog.error({
    positiveText: '确认',
    negativeText: '取消',
    title: '删除用户',
    content: `确定删除${username}?`,
    onPositiveClick: async () => {
      try {
        fullLoading()
        await SysApi.removeUser([id!])
        window.$message.success('删除成功')
        tableEl.value?.reload()
      } finally {
        fullLoading(false)
      }
    }
  })

}

// 批量删除
const batchRemove = async () => {
  const list = tableEl.value?.checkedRowKeys as number[]
  if (!list.length) return window.$message.warning(`至少选择一项`)
  const nameStr = list.join('，')


  window.$dialog.error({
    positiveText: '确认',
    negativeText: '取消',
    title: '批量删除',
    content: `确定删除以下用户：${nameStr}  ?`,
    onPositiveClick: async () => {
      try {
        fullLoading()
        await SysApi.removeUser(list)
        window.$message.success('删除成功')
        tableEl.value?.reload()
      } finally {
        fullLoading(false)
      }
    }
  })

}
</script>

<style scoped lang="scss"></style>
