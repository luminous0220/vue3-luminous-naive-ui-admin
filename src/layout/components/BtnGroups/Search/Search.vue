<template>
  <div class="search header-icon cursor-pointer" @click="handleOpen">
    <i-carbon-search />

    <AutoComplete ref="AutoCompleteRef" />
  </div>
</template>

<script setup lang="ts">
import AutoComplete from './AutoComplete.vue'

const AutoCompleteRef = shallowRef<InstanceType<typeof AutoComplete>>()
const handleOpen = () => {
  AutoCompleteRef.value?.open()
}
</script>

<style scoped lang="scss"></style>
