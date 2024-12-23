<template>
  <n-layout class="w-full h-full" has-sider>
    <!-- PC端菜单栏 -->
    <n-layout-sider
      v-if="!isMobile"
      show-trigger="bar"
      @collapse="isExpandMenu = false"
      @expand="isExpandMenu = true"
      :collapsed="!isExpandMenu"
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :native-scrollbar="false"
      class="h-full w-full"
      content-class="h-full w-full select-none"
      style="box-shadow: 2px 0 8px #1d23290d"
    >
      <div class="flex-center h-[--header-height]">
        <img class="w-36px mr-8px" src="@/assets/images/logo.png" alt="" srcset="" />
        <h2 v-if="isExpandMenu" class="whitespace-nowrap">我的管理系统</h2>
      </div>

      <MainMenu />
    </n-layout-sider>

    <!-- 移动端菜单栏 -->
    <n-drawer
      :auto-focus="false"
      :trap-focus="false"
      v-else
      v-model:show="isExpandMenu"
      :placement="'left'"
      class="p-8px"
    >
      <div class="flex-center h-[--header-height]">
        <img class="w-36px mr-8px" src="@/assets/images/logo.png" alt="" srcset="" />
        <h2 class="whitespace-nowrap">我的管理系统</h2>
      </div>
      <div style="height: calc(100% - var(--header-height)) !important">
        <MainMenu />
      </div>
    </n-drawer>

    <n-layout class="w-full" content-class="flex flex-col">
      <n-layout-header class="w-full">
        <MainHeader />
      </n-layout-header>

      <n-layout-content
        class="w-full flex-grow-1"
        content-class="p-12px pt-8px flex flex-col h-full"
      >
        <Tab class="mb-8px" />
        <Main />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores'
import { storeToRefs } from 'pinia'
import MainMenu from './components/MainMenu/MainMenu.vue'
import MainHeader from './components/MainHeader/MainHeader.vue'
import Tab from './components/Tab/Tab.vue'
import Main from './components/Main/Main.vue'

const input = ref('')
const { isMobile, isExpandMenu, isDark } = storeToRefs(useGlobalStore())
</script>

<style scoped lang="scss"></style>
