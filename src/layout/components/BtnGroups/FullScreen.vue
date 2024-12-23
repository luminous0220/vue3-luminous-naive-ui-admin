<template>
  <div class="fullscreen cursor-pointer header-icon" @click="toggle">
    <i-ep-full-screen />
  </div>
</template>

<script setup lang="ts">
const toggle = () => {
  const elem = window.document
  if (elem.fullscreenElement) {
    elem.exitFullscreen()
  } else {
    elem.documentElement.requestFullscreen()
  }
}
</script>
