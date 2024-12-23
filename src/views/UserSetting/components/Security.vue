<template>
  <form-pro v-loading="loading" :disabled="disabled" class="w-380px p-12px mt-18px h-300px! lt-md:w-full!"
    v-model:model="model" ref="FormRef" v-model:schemas="schemas" @on-submit="updateUserInfo">
  </form-pro>
</template>

<script setup lang="tsx">
import { AuthApi } from '@/apis'
import { IFormSchema } from '@/components'
import FormPro from '@/components/FormPro/FormPro.vue'
import { EMAIL_AUTH_ENUM, PASSWORD_RESET_ENUM } from '@/constants'
import { useCountDown } from '@/hooks'

const { timeLeft, startCountDown, isEnd } = useCountDown()

// 阻止浏览器自动填充
const disabled = ref(true)
const FormRef = ref<InstanceType<typeof FormPro>>()
const model = reactive({
  email: '',
  code: '',
  codeId: 0,
  newPwd: '',
  repeatPwd: ''
})

const schemas = reactive<IFormSchema[]>([
  {
    field: 'email',
    label: '',
    type: 'input',
    inputProps: {
      placeholder: '请输入邮箱',
      prefix: () => <i-carbon-email />
    },
    rules: [
      {
        required: true,
        validator(rule: any, value: string) {
          const valid = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)
          if (!value) {
            return new Error('邮箱不能为空')
          } else if (!valid) {
            return new Error('邮箱格式错误')
          } else {
            return true
          }
        },
        trigger: ['change', 'blur']
      }
    ]
  },
  {
    field: 'code',
    label: '',
    render: () => {
      return (
        <div class="w-full flex justify-between items-center">
          <n-input
            vModel:value={model.code}
            placeholder="邮箱验证码"
            type="text"
            class="w-65%! lt-md:(w-50% mr-5px)"
            clearable
            v-slots={{
              prefix: () => <i-carbon-security />
            }}
          ></n-input>

          <n-button size="large" disabled={!isEnd} v-throttle={sendCode}>
            {isEnd ? '获取验证码' : timeLeft + ' s'}
          </n-button>
        </div>
      )
    },
    rules: [
      {
        required: true,
        message: '请输入验证码',
        trigger: ['change']
      }
    ]
  },
  {
    field: 'newPwd',
    label: '',
    type: 'input',
    inputProps: {
      clearable: true,
      showPasswordOn: 'click',
      type: 'password',
      placeholder: '请输入新密码',
      prefix: () => <i-ep-lock />
    },
    rules: [
      {
        required: true,
        message: '请输入新密码',
        trigger: ['change', 'blur']
      },
      {
        min: 6,
        max: 32,
        message: '密码长度必须在6~32个字符之间',
        trigger: ['change', 'blur']
      }
    ]
  },
  {
    field: 'repeatPwd',
    label: '',
    type: 'input',
    inputProps: {
      clearable: true,
      showPasswordOn: 'click',
      type: 'password',
      placeholder: '请再次输入密码',
      prefix: () => <i-ep-lock />
    },
    rules: [
      {
        validator(rule: any, value: string) {
          const { newPwd, repeatPwd } = model
          if (!value) {
            return new Error('请再次输入密码')
          } else if (newPwd !== repeatPwd) {
            return new Error('两次输入的密码不一致')
          } else {
            return true
          }
        },
        trigger: ['change', 'blur']
      }
    ]
  }
])

// const AuthSto = useAuthStore()

const sendCode = async () => {
  if (!model.email) {
    return window.$message.warning('请先填写邮箱')
  }
  const { data } = await AuthApi.sendEmailCode({
    email: model.email,
    type: EMAIL_AUTH_ENUM.PASSWORD_RESET
  })
  model.codeId = data.codeId
  window.$message.success('发送成功，请前往邮箱检查')
  startCountDown()
}

const loading = ref(false)
const updateUserInfo = async () => {
  try {
    await AuthApi.updatePwd({
      ...model,
      type: PASSWORD_RESET_ENUM.EMAIL
    })
    loading.value = false
    window.$message.success('密码修改成功')
    FormRef.value?.resetFields()
  } catch (error) {
    loading.value = false
  }
}

onMounted(() => {
  setTimeout(() => {
    disabled.value = false
  }, 1000)
})
</script>

<style scoped lang="scss"></style>
