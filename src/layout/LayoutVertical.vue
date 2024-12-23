<template>
  <n-layout class="w-full h-full" has-sider>
    <n-layout class="w-full" content-class="flex flex-col">
      <n-layout-header class="w-full">
        <div v-if="!isMobile" class="flex items-center justify-between">
          <div class="flex-center h-[--header-height]">
            <img class="w-36px mr-8px" src="@/assets/images/logo.png" alt="" srcset="" />
            <h2 class="whitespace-nowrap">我的管理系统</h2>
          </div>

          <!-- PC端菜单栏 -->
          <div class="flex-grow-1 overflow-auto">
            <MainMenu responsive mode="horizontal" />
          </div>

          <div class="flex justify-between items-center h-full pr-12px">
            <Search />
            <FullScreen />
            <Setting />
            <Avatar />
          </div>
        </div>

        <!-- header栏 -->
        <MainHeader v-else />
      </n-layout-header>

      <!-- 移动端菜单栏 -->
      <n-drawer
        v-if="isMobile"
        :auto-focus="false"
        :trap-focus="false"
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
import Collapse from '@/layout/components/BtnGroups/Collapse.vue'
import FullScreen from '@/layout/components/BtnGroups/FullScreen.vue'
import Setting from '@/layout/components/BtnGroups/Setting/Setting.vue'
import Search from '@/layout/components/BtnGroups/Search/Search.vue'
import Avatar from '@/layout/components/BtnGroups/Avatar.vue'

const { isMobile, isExpandMenu } = storeToRefs(useGlobalStore())
</script>
