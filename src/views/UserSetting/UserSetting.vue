<template>
  <div>
    <n-card title="用户设置" style="margin-bottom: 16px">
      <n-tabs type="line" animated>
        <n-tab-pane name="基本信息" tab="基本信息">
          <UserInfo />
        </n-tab-pane>
        <n-tab-pane name="头像编辑" tab="头像编辑">
          <AvatarEditor />
        </n-tab-pane>
        <n-tab-pane name="安全设置" tab="安全设置">
          <Security />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import UserInfo from './components/UserInfo.vue'
import { AvatarEditor } from '@/components'
import Security from './components/Security.vue'
</script>

<style scoped lang="scss"></style>
