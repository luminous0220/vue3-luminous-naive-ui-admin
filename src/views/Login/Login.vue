<template>
  <div class="flex flex-col w-full h-full flex-center bg-[--gray-1]">
    <div class="flex items-center mb-18px">
      <img class="w-78px mr-18px" src="@/assets/images/logo.png" alt="" srcset="" />
      <h1 class="text-#3381ee">luminous 管理系统</h1>
    </div>

    <Motion>
      <login-form v-if="flag === 'login'" @switch="handleClick"></login-form>
      <register-form v-else-if="flag === 'register'" @switch="handleClick"></register-form>
      <reset-form v-else-if="flag === 'reset'" @switch="handleClick"></reset-form>
    </Motion>
  </div>
</template>

<script lang="ts" setup>
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'
import ResetForm from './ResetForm.vue'

type IFlag = 'login' | 'register' | 'reset'
const flag = ref<IFlag>('login')

const handleClick = (val: IFlag) => {
  flag.value = val
}
</script>
