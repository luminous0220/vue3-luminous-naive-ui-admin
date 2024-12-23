<template>
  <div
    class="w-full w-480px! bg-[--white-1] rounded-12px shadow-md p-42px h-496px relative lt-md:w-96%!"
  >
    <div v-if="!showResult" class="flex items-center mb-18px w-full">
      <h2 class="text-2xl font-bold">Register</h2>
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
        <n-input type="text" v-model:value="formInline.username" placeholder="请输入用户名">
          <template #prefix>
            <n-icon class="mr-8px" size="18" color="#808695">
              <i-ep-user />
            </n-icon>
          </template>
        </n-input>
      </n-form-item>

      <n-form-item path="password">
        <n-input
          :type="typeFlag"
          @focus="typeFlag = 'password'"
          v-model:value="formInline.password"
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
        title="注册成功"
        description="已发送邮件到您的邮箱，请前往激活"
      >
        <template #icon>
          <img src="@/assets/images/success.png" />
        </template>
        <template #footer>
          <n-button type="primary" @click="$emit('switch', 'login')">点击返回登录</n-button>
        </template>
      </n-result>
    </Motion>
  </div>
</template>

<script setup lang="ts">
import { AuthApi } from '@/apis'
import { FormRules, FormItemRule, FormInst } from 'naive-ui'
import { reactive, ref } from 'vue'

defineEmits<{ switch: [val: 'reset' | 'register' | 'login'] }>()

const typeFlag = ref<'text' | 'password'>('text')
const formIns = ref<FormInst>()
const loading = ref(false)
const showResult = ref(false)
const formInline = reactive({
  email: '',
  username: '',
  password: '',
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
  username: [
    {
      required: true,
      min: 5,
      max: 32,
      message: '用户名长度必须在5~32个字符之间',
      trigger: ['blur']
    }
  ],
  password: [
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
        const { password, repeatPwd } = formInline
        if (!value) return new Error('请输入确认密码')
        if (password !== repeatPwd) {
          return new Error('两次输入的密码不一致')
        } else {
          return true
        }
      },
      trigger: ['blur']
    }
  ]
}

const handleSubmit = async () => {
  await formIns.value?.validate(async (errors) => {
    if (errors) return
    loading.value = true
    try {
      loading.value = true
      await AuthApi.register(formInline)
      showResult.value = true
    } finally {
      loading.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.n-input {
  --n-height: 48px !important;
}
</style>
