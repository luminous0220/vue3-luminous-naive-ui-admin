<template>
  <div
    class="w-full w-480px! bg-[--white-1] rounded-12px shadow-md p-42px h-496px relative lt-md:w-96%!"
  >
    <div v-if="!showResult" class="flex items-center mb-18px w-full">
      <h2 class="text-2xl font-bold">Reset Password</h2>
    </div>

    <n-form
      v-if="!showResult"
      ref="formIns"
      :disabled="loading"
      label-placement="left"
      size="large"
      :model="formInline"
      :rules="rules"
    >
      <n-form-item path="email">
        <n-input v-model:value="formInline.email" placeholder="请输入邮箱">
          <template #prefix>
            <n-icon class="mr-8px" size="18" color="#808695">
              <i-carbon-email-new />
            </n-icon>
          </template>
        </n-input>
      </n-form-item>

      <n-form-item path="username">
        <div class="flex justify-between items-center w-full">
          <n-input
            class="w-65%! lt-md:w-58%!"
            type="text"
            v-model:value="formInline.code"
            placeholder="请输入验证码"
          >
            <template #prefix>
              <n-icon class="mr-8px" size="18" color="#808695">
                <i-ep-user />
              </n-icon>
            </template>
          </n-input>

          <n-button
            size="medium"
            :loading="codeLoading"
            :disabled="!isEnd"
            v-throttle:[2000]="sendCode"
          >
            {{ isEnd ? '获取验证码' : timeLeft + ' s' }}</n-button
          >
        </div>
      </n-form-item>

      <n-form-item path="password">
        <n-input
          :type="typeFlag"
          @focus="typeFlag = 'password'"
          v-model:value="formInline.newPwd"
          showPasswordOn="click"
          @keyup.enter="handleSubmit"
          placeholder="请输入密码"
        >
          <template #prefix>
            <n-icon class="mr-8px" size="18" color="#808695">
              <i-ep-lock />
            </n-icon>
          </template>
        </n-input>
      </n-form-item>

      <n-form-item path="repeatPwd">
        <n-input
          :type="typeFlag"
          @focus="typeFlag = 'password'"
          v-model:value="formInline.repeatPwd"
          showPasswordOn="click"
          @keyup.enter="handleSubmit"
          placeholder="请输入确认密码"
        >
          <template #prefix>
            <n-icon class="mr-8px" size="18" color="#808695">
              <i-ep-lock />
            </n-icon>
          </template>
        </n-input>
      </n-form-item>

      <n-form-item>
        <div class="flex justify-between w-full">
          <n-button
            :disabled="loading"
            class="w-48%!"
            :loading="loading"
            @click="$emit('switch', 'login')"
            >返回</n-button
          >
          <n-button
            type="primary"
            class="w-48%!"
            :loading="loading"
            v-throttle:[1000]="handleSubmit"
            :disabled="loading"
            >注册</n-button
          >
        </div>
      </n-form-item>
    </n-form>

    <Motion v-else>
      <n-result
        class="absolute-center"
        status="success"
        title="重置密码成功"
        description="点击下方按钮重新登录"
      >
        <template #icon>
          <img src="@/assets/images/success.png" />
        </template>
        <template #footer>
          <n-button type="primary" @click="$emit('switch', 'login')">返回登录</n-button>
        </template>
      </n-result>
    </Motion>
  </div>
</template>

<script setup lang="ts">
import { AuthApi } from '@/apis'
import { EMAIL_AUTH_ENUM, PASSWORD_RESET_ENUM } from '@/constants'
import { useCountDown } from '@/hooks'
import { FormRules, FormItemRule, FormInst } from 'naive-ui'
import { reactive, ref } from 'vue'

defineEmits<{ switch: [val: 'reset' | 'register' | 'login'] }>()

const { timeLeft, startCountDown, isEnd } = useCountDown()

const typeFlag = ref<'text' | 'password'>('text')
const formIns = ref<FormInst>()
const loading = ref(false)
const codeLoading = ref(false)
const showResult = ref(false)
const formInline = reactive({
  email: '',
  code: '',
  codeId: 0,
  newPwd: '',
  repeatPwd: ''
})

const rules: FormRules = {
  email: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        const valid = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)
        if (!value) return new Error('请输入邮箱')
        if (!valid) {
          return new Error('邮箱格式错误')
        } else {
          return true
        }
      },
      trigger: ['blur']
    }
  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
      trigger: ['blur']
    }
  ],
  newPwd: [
    {
      required: true,
      min: 6,
      max: 32,
      message: '密码长度必须在6~32个字符之间',
      trigger: ['blur']
    }
  ],
  repeatPwd: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        const { newPwd, repeatPwd } = formInline
        if (!value) return new Error('请输入确认密码')
        if (newPwd !== repeatPwd) {
          return new Error('两次输入的密码不一致')
        } else {
          return true
        }
      },
      trigger: ['blur']
    }
  ]
}

const sendCode = async () => {
  if (!formInline.email) {
    return window.$message.warning('请填写邮箱')
  }

  try {
    codeLoading.value = true
    const { data } = await AuthApi.sendEmailCode({
      email: formInline.email,
      type: EMAIL_AUTH_ENUM.PASSWORD_RESET
    })
    formInline.codeId = data.codeId
    window.$notice.success({ content: '发送成功，请前往邮箱检查' })
    startCountDown()
  } catch (error) {
    codeLoading.value = false
  }
}

const handleSubmit = async () => {
  await formIns.value?.validate(async (errors) => {
    if (errors) return
    loading.value = true
    const { email, code, codeId, newPwd, repeatPwd } = formInline
    await AuthApi.updatePwd({
      email,
      code,
      codeId,
      newPwd,
      repeatPwd,
      type: PASSWORD_RESET_ENUM.EMAIL
    })
    loading.value = false
    showResult.value = true
  })
}
</script>

<style lang="scss" scoped>
.n-input {
  --n-height: 48px !important;
}
</style>
