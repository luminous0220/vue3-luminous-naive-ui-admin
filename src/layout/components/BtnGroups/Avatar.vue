<template>
  <n-dropdown trigger="hover" :options="options">
    <div class="flex-center cursor-pointer">
      <n-avatar class="mx-8px min-w-36px" :size="36" :src="fileUrl(AuthSto.user.avatar)" />
      <div class="max-w-88px line-clamp-2">{{ AuthSto.user.nickname }}</div>
    </div>
  </n-dropdown>
</template>

<script setup lang="tsx">
import { useAppRouteStore, useAuthStore } from '@/stores'
import { navigate, fileUrl, local } from '@/utils'
import { CFG } from '@/config'
import { Icon } from '@iconify/vue'

const AuthSto = useAuthStore()
const AppRouteSto = useAppRouteStore()

const options = reactive([
  {
    key: 'account',
    icon: () => h(Icon, { icon: 'carbon:user-data' }),
    label: '账户设置',
    props: {
      onClick: () => {
        navigate('/user-setting')
      }
    }
  },
  {
    key: 'header-divider',
    type: 'divider'
  },
  {
    label: '退出账号',
    key: 'logout',
    icon: () => h(Icon, { icon: 'ep:switch-button' }),
    props: {
      onClick: () => {
        window.$dialog.warning({
          positiveText: '确认',
          negativeText: '取消',
          title: '注销',
          content: '确认是否退出账号',
          onPositiveClick: () => {
            // window.localStorage.clear()
            // window.sessionStorage.clear()
            // AuthSto.$reset()
            // AppRouteSto.$reset()
            local.clearCookie()
            navigate(CFG.LOGIN_PATH)
          }
        })
      }
    }
  }
])
</script>
