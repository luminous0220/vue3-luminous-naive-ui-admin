<template>
  <n-button>
    <slot />
  </n-button>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.n-button {
  --n-border-hover: none !important;
  --n-border-pressed: none !important;
  --n-border-hover: none !important;
  --n-border-focus: none !important;

  background-color: #fff !important;
  border: 0;
  color: #242424;
  border-radius: 0.5em;
  font-size: 16px;
  width: 100%;
  padding: 10px 0;
  text-shadow: 0 0.0625em 0 #fff;
  box-shadow:
    inset 0 0.0625em 0 0 #f4f4f4,
    0 0.0625em 0 0 #efefef,
    0 0.125em 0 0 #ececec,
    0 0.25em 0 0 #e0e0e0,
    0 0.3125em 0 0 #dedede,
    0 0.375em 0 0 #dcdcdc,
    0 0.425em 0 0 #cacaca,
    0 0.425em 0.5em 0 #cecece;
  transition: 0.15s ease;
  cursor: pointer;
}
.n-button:active {
  translate: 0 0.225em;
  box-shadow:
    inset 0 0.03em 0 0 #f4f4f4,
    0 0.03em 0 0 #efefef,
    0 0.0625em 0 0 #ececec,
    0 0.125em 0 0 #e0e0e0,
    0 0.125em 0 0 #dedede,
    0 0.2em 0 0 #dcdcdc,
    0 0.225em 0 0 #cacaca,
    0 0.225em 0.375em 0 #cecece;
}
</style>
