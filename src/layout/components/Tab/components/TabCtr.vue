<template>
  <n-dropdown
    placement="bottom-start"
    trigger="click"
    :options="dropDownOptions"
    v-if="!GlobalSto.isMobile"
  >
    <n-button size="small" type="primary">
      <span>更多</span>
      <n-icon class="ml-6px">
        <i-ep-arrow-down />
      </n-icon>
    </n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
import { useTabCtr } from '@/hooks'
import { useGlobalStore } from '@/stores'
import { Icon } from '@iconify/vue'

const GlobalSto = useGlobalStore()

const dropDownOptions = reactive([
  {
    label: '刷新页面',
    key: 'refresh',
    icon: () => h(Icon, { icon: 'ep:refresh' }),
    props: {
      onClick: () => refresh()
    }
  },
  {
    label: '关闭页面',
    key: 'close',
    icon: () => h(Icon, { icon: 'ep:remove' }),
    props: {
      onClick: () => closeTab()
    }
  },
  {
    label: '关闭其它页面',
    key: 'closeOther',
    icon: () => h(Icon, { icon: 'ep:circle-close' }),
    props: {
      onClick: () => closeOtherTab()
    }
  },
  {
    label: '关闭所有页面',
    key: 'closeAll',
    icon: () => h(Icon, { icon: 'ep:folder-delete' }),
    props: {
      onClick: () => closeAllTab()
    }
  }
])

const { refresh, closeTab, closeOtherTab, closeAllTab } = useTabCtr()
</script>
