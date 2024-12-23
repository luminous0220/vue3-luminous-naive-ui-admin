<template>
  <form-pro v-loading="loading" class="p-12px h-508px! w-380px lt-md:w-full!" v-model:model="model" :schemas="schemas"
    @on-submit="updateUserInfo" />
</template>

<script setup lang="ts">
import { AuthApi } from '@/apis'
import { IFormSchema } from '@/components'
import { useAuthStore } from '@/stores'

const model = reactive({
  nickname: '',
  email: '',
  sign: '',
  sex: 0,
  age: 0,
  birthday: '2023-01-01',
  phone: ''
})

const schemas = reactive<IFormSchema[]>([
  {
    field: 'nickname',
    label: '昵称',
    type: 'input',
    inputProps: {
      placeholder: '请输入'
    },
    rules: [
      {
        required: true,
        min: 4,
        max: 18,
        message: '该项不能为空，且字数限制在4-18个字符',
        trigger: ['change', 'blur']
      }
    ]
  },
  {
    field: 'email',
    label: '邮箱',
    type: 'input',
    inputProps: {
      placeholder: '请输入',
      disabled: true
    }
  },
  {
    field: 'age',
    label: '年龄',
    type: 'input-number',
    inputProps: {
      placeholder: '请输入'
    }
  },
  {
    field: 'sex',
    label: '性别',
    type: 'radio',
    options: [
      { label: '男', value: 0 },
      { label: '女', value: 1 }
    ]
  },
  {
    field: 'birthday',
    label: '生日',
    type: 'date'
  },
  {
    field: 'phone',
    label: '手机号',
    type: 'input',
    inputProps: {
      placeholder: '请输入',
      inputProps: {
        type: 'number'
      }
    },
    rules: [
      {
        min: 11,
        max: 11,
        message: '手机号格式错误',
        trigger: ['change', 'blur']
      }
    ]
  },
  {
    field: 'sign',
    label: '签名',
    type: 'input',
    inputProps: {
      type: 'textarea',
      placeholder: '请输入'
    }
  }
])

const AuthSto = useAuthStore()

const asignUserInfo = () => {
  model.nickname = AuthSto.user.nickname
  model.email = AuthSto.user.email
  model.sign = AuthSto.user.sign
  model.sex = AuthSto.user.sex
  model.age = AuthSto.user.age
  model.birthday = AuthSto.user.birthday
  model.phone = AuthSto.user.phone
}

const loading = ref(false)
const updateUserInfo = async () => {
  loading.value = true
  await AuthApi.updateUserInfo(model)
  await AuthSto.getUserInfo()
  asignUserInfo()
  window.$message.success('修改成功')
  loading.value = false
}

asignUserInfo()
</script>

<style scoped lang="scss"></style>
