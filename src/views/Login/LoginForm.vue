<template>
  <div class="w-full w-480px! bg-[--white-1] rounded-12px shadow-md p-42px lt-md:w-96%!">
    <div class="flex items-center mb-18px w-full">
      <h2 class="text-2xl font-bold">Login</h2>
      <a-button class="ml-auto" @click="$emit('switch', 'register')">注册账号</a-button>
    </div>

    <n-form :disabled="loading" ref="formRef" label-placement="left" size="large" :model="formInline" :rules="rules">
      <n-form-item path="account">
        <n-input v-model:value="formInline.account" placeholder="请输入用户名或邮箱">
          <template #prefix>
            <n-icon class="mr-8px" size="18" color="#808695">
              <i-ep-user />
            </n-icon>
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="password">
        <n-input v-model:value="formInline.password" type="password" showPasswordOn="click" @keyup.enter="handleSubmit"
          placeholder="请输入密码">
          <template #prefix>
            <n-icon class="mr-8px" size="18" color="#808695">
              <i-ep-lock />
            </n-icon>
          </template>
        </n-input>
      </n-form-item>
      <n-form-item class="default-color">
        <div class="flex justify-between">
          <div class="flex-initial">
            <n-checkbox v-model:checked="autoLogin">自动登录</n-checkbox>
          </div>
          <div class="text-[--text-color-1] cursor-pointer select-none active:(translate-x-4px) transition-all"
            @click="$emit('switch', 'reset')">
            忘记密码
          </div>
        </div>
      </n-form-item>
      <n-form-item>
        <n-button class="w-full" type="primary" :loading="loading" :disabled="loading"
          v-throttle:[1000]="handleSubmit">登录</n-button>
      </n-form-item>
      <n-form-item class="mt-12px">
        <div class="flex w-full items-center">
          <div class="">
            <span>其它登录方式</span>
          </div>
          <img @click="tipLogin" class="w-32px mx-12px cursor-pointer" src="@/assets/icons/qq.png" alt="" srcset="" />
          <img @click="tipLogin" class="w-32px mx-12px cursor-pointer" src="@/assets/icons/wechat.png" alt=""
            srcset="" />
          <div class="flex-initial" style="margin-left: auto"></div>
        </div>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { CFG } from '@/config'
import { useAuthStore } from '@/stores'
import { navigate } from '@/utils'
import { FormRules, FormItemRule, FormInst } from 'naive-ui'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

defineEmits<{ switch: [val: 'reset' | 'register'] }>()

const AuthSto = useAuthStore()
const route = useRoute()
const formRef = ref<FormInst>()
const loading = ref(false)
const autoLogin = ref(true)

const formInline = reactive({
  account: 'myuser',
  password: '123456'
})

const rules: FormRules = {
  account: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (value.includes('@')) {
          const valid = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)
          if (!valid) {
            return new Error('邮箱格式错误')
          } else {
            return true
          }
        } else {
          if (value.length < 5 || value.length > 32) {
            return new Error('用户名长度为5-32位')
          } else {
            return true
          }
        }
      },
      trigger: ['input', 'blur']
    }
  ],
  password: [{ required: true, message: '请输入密码', trigger: ['blur'] }]
}

const handleSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if (errors) return

    loading.value = true
    try {
      await AuthSto.login(formInline.account, formInline.password)
      window.$message.destroyAll()
      const toPath = decodeURIComponent((route.query?.redirect || CFG.HOME_PATH) as string)
      window.$message.success('登录成功，即将进入系统')
      navigate(toPath)
    } finally {
      loading.value = false
    }
  })
}

const tipLogin = () => {
  window.$notice.warning({ content: '暂不支持使用微信或者QQ登录' })
}
</script>

<style lang="scss" scoped>
.n-input {
  --n-height: 48px !important;
}
</style>
