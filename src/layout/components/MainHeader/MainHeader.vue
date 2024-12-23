<template>
  <div class="h-[--header-height] flex items-center px-28px justify-between lt-md:px-8px">
    <Collapse />
    <div class="flex justify-between items-center h-full overflow-auto">
      <Search />
      <FullScreen />
      <Setting />
      <Avatar />
    </div>
  </div>
</template>

<script setup lang="ts">
import Collapse from '@/layout/components/BtnGroups/Collapse.vue'
import FullScreen from '@/layout/components/BtnGroups/FullScreen.vue'
import Setting from '@/layout/components/BtnGroups/Setting/Setting.vue'
import Search from '@/layout/components/BtnGroups/Search/Search.vue'
import Avatar from '@/layout/components/BtnGroups/Avatar.vue'
</script>
