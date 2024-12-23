<template>
  <div class="basic-tabs flex items-center justify-between pr-20px select-none lt-sm:pr-5px!">
    <div class="overflow-auto">
      <!-- tab栏 -->
      <n-tabs
        type="card"
        v-model:value="activeName"
        :on-update:value="(path) => navigate(path)"
        :on-close="handleRemove"
        @contextmenu.prevent.stop="preventRightClick"
      >
        <n-tab-pane
          :tab="item.title"
          :name="item.path"
          v-for="item in tabsMenuList"
          :key="item.path"
          :closable="item.close"
        >
          <template #tab>
            <div class="wrap" @contextmenu.prevent.stop="handleContextMenu($event, item)">
              <n-icon class="mr-10px">
                <Icon :icon="item.icon" />
              </n-icon>
              <div>{{ item.title }}</div>
            </div>
          </template>
        </n-tab-pane>
      </n-tabs>
    </div>
    <!-- 更多 -->
    <tab-ctr class="ml-12" />

    <!-- 右键tab栏popover -->
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="_left"
      :show="showDropDown"
      :y="_top"
      :options="dropDownOptions"
      :on-clickoutside="() => (showDropDown = false)"
      :on-select="onSelect"
      v-if="!GlobalSto.isMobile"
    >
    </n-dropdown>
  </div>
</template>

<script setup lang="ts">
import TabCtr from './components/TabCtr.vue'
import { useTabCtr } from '@/hooks'
import { useRoute } from 'vue-router'
import {
  useTabsStore,
  useKeepAliveStore,
  ITabsMenuProps,
  useGlobalStore,
  useAppRouteStore
} from '@/stores'
import { navigate } from '@/utils'
import { CFG } from '@/config'
import { Icon } from '@iconify/vue'

const TabSto = useTabsStore()
const GlobalSto = useGlobalStore()
const KeepAliveSto = useKeepAliveStore()
const AppRouteSto = useAppRouteStore()
const route = useRoute()
const { refresh, closeTab, closeOtherTab, closeAllTab } = useTabCtr()

onMounted(() => {
  initTabs()
})

const activeName = ref(route.path)
const tabsMenuList = computed(() => TabSto.tabsMenuList)

const dropDownOptions = reactive([
  {
    label: '刷新页面',
    key: 'refresh',
    icon: () => h(Icon, { icon: 'ep:refresh' }),
    props: {
      onClick: () => refresh(tempTab)
    }
  },
  {
    label: '关闭页面',
    key: 'close',
    icon: () => h(Icon, { icon: 'ep:remove' }),
    props: {
      onClick: () => closeTab(tempTab)
    }
  },
  {
    label: '关闭其它页面',
    key: 'closeOther',
    icon: () => h(Icon, { icon: 'ep:circle-close' }),
    props: {
      onClick: () => closeOtherTab(tempTab)
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

const onSelect = () => {
  showDropDown.value = false
}
// 初始化需要固定的标签
const initTabs = () => {
  AppRouteSto.flatMenuGet.forEach((item) => {
    if (!item.meta?.status) {
      const tabsParams = {
        icon: item.meta?.icon,
        title: item.meta?.name,
        path: item.meta?.path,
        name: item.meta?.name,
        close: true
      } as ITabsMenuProps
      TabSto.addTab(tabsParams)
    }
  })
}

const showDropDown = ref(false)
const _top = ref(0)
const _left = ref(0)
let tempTab = reactive({}) as ITabsMenuProps

// 右键点击弹出菜单
const handleContextMenu = async (e: MouseEvent, item: ITabsMenuProps) => {
  e.preventDefault()
  showDropDown.value = false
  Object.assign(tempTab, item)
  await nextTick()
  showDropDown.value = true
  _top.value = e.clientY
  _left.value = e.clientX
}

// 优化体验，阻止右键点击tab标签时的默认行为
const preventRightClick = () => {
  return
}

// 移除标签
const handleRemove = (path: string | number) => {
  const name = TabSto.tabsMenuList.filter((item) => item.path == path)[0].name || ''
  KeepAliveSto.removeKeepAliveName(name)
  TabSto.removeTab(path as string, route.path)
}

watch(
  () => route.path,
  () => {
    activeName.value = route.path
    const tabsParams = {
      icon: route.meta.icon,
      title: route.meta.title,
      path: route.fullPath,
      name: route.name,
      close: route.path === CFG.HOME_PATH ? false : true
    } as ITabsMenuProps
    TabSto.addTab(tabsParams)
    if (route.meta.isKeepAlive) {
      KeepAliveSto.addKeepAliveName(route.name as string)
    }
  },
  { immediate: true }
)
</script>

<style lang="scss">
::-webkit-scrollbar {
  height: 2px;
}

.basic-tabs {
  width: 100%;
  .wrap {
    position: relative;
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
  }
  .n-tabs-tab {
    border-radius: 8px !important;
    transition: all ease 0.5s;
  }
  .n-tabs-tab--active {
    background-color: var(--white-1) !important;
  }
  .n-tabs.n-tabs--top .n-tab-pane {
    padding: 0px !important;
  }
}
</style>
