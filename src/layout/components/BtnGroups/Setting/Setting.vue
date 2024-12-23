<template>
  <div class="setting cursor-pointer header-icon" @click="handleOpen">
    <i-carbon-menu />

    <drawer ref="DrawerRef" title="主题设置">
      <div class="flex-center flex-col">
        <n-divider title-placement="center">主题</n-divider>
        <!-- 暗黑模式切换 -->
        <n-switch v-model:value="isDark" :rail-style="() => ({ background: '#010e1c' })">
          <template #checked>
            <n-icon size="14" color="#ffd93b">
              <i-carbon-asleep-filled />
            </n-icon>
          </template>
          <template #unchecked>
            <n-icon size="14" color="#ffd93b">
              <i-carbon-light-filled />
            </n-icon>
          </template>
        </n-switch>

        <!-- 主题颜色 -->
        <n-divider title-placement="center">主题颜色</n-divider>

        <div class="grid grid-cols-9">
          <span
            class="theme-item"
            v-for="(item, index) in CFG.THEME_COLOR_LIST"
            :key="index"
            :style="{ 'background-color': item }"
            @click="checkColor(item)"
          >
            <n-icon size="12" v-if="item === themeColor">
              <i-carbon-checkmark-filled />
            </n-icon>
          </span>
        </div>

        <n-space class="w-full mt-18px" align="center" justify="space-between">
          <span class="text-16px">色弱模式</span>
          <n-switch
            v-model:value="isWeak"
            @update:value="(e) => GlobalSto.changeGreyOrWeak('weak', e)"
          >
          </n-switch>
        </n-space>

        <n-space class="w-full mt-16px" align="center" justify="space-between">
          <span class="text-16px">灰阶模式</span>
          <n-switch
            v-model:value="isGrey"
            @update:value="(e) => GlobalSto.changeGreyOrWeak('grey', e)"
          >
          </n-switch>
        </n-space>

        <!-- 界面显示 -->
        <n-divider title-placement="center">界面显示</n-divider>

        <n-space class="w-full mt-16px" align="center" justify="space-between">
          <span class="text-16px">是否开启页面缓存</span>
          <n-switch v-model:value="isKeepAlive"> </n-switch>
        </n-space>

        <n-space class="w-full mt-16px" align="center" justify="space-between">
          <span class="text-16px">标签栏</span>
          <n-switch v-model:value="isShowTab"> </n-switch>
        </n-space>

        <!-- 界面显示 -->
        <n-divider title-placement="center">布局切换</n-divider>
        <layout-box></layout-box>
      </div>
    </drawer>
  </div>
</template>

<script setup lang="ts">
import Drawer from '@/components/Drawer/Drawer.vue'
import LayoutBox from './LayoutBox.vue'
import { CFG } from '@/config'
import { useGlobalStore } from '@/stores'
import { storeToRefs } from 'pinia'

const GlobalSto = useGlobalStore()
const { isDark, isGrey, isWeak, themeColor, isKeepAlive, isShowTab } = storeToRefs(GlobalSto)

const DrawerRef = shallowRef<InstanceType<typeof Drawer>>()
const handleOpen = () => {
  DrawerRef.value?.open()
}

const checkColor = (item: string) => {
  themeColor.value = item
}
</script>

<style lang="scss" scoped>
.theme-item {
  width: 20px;
  min-width: 20px;
  height: 20px;
  cursor: pointer;
  position: relative;
  border: 1px solid #eee;
  border-radius: 2px;
  margin: 0 5px 5px 0;
  text-align: center;

  .n-icon {
    position: absolute;
    color: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
