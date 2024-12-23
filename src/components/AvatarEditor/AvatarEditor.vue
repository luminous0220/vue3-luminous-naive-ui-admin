<template>
  <div>
    <div class="w-280px cursor-pointer mask lt-md:(mt-0)" @click="openAvatarEditor">
      <n-space align="center">
        <n-avatar round :size="128" :src="fileUrl(AuthSto.user.avatar)">
          <i-carbon-image v-if="!AuthSto.user.avatar" class="text-68px" />
        </n-avatar>
        <div class="text-center text-12px mt-8px text-#95aac9">点击头像进行编辑</div>
        <input
          class="hidden"
          id="avatar-upload"
          @input="createCropper"
          type="file"
          :limit="1"
          accept="image/*"
        />
      </n-space>
    </div>

    <modal
      type="dialog"
      :mask-closable="false"
      title="修改头像"
      class="w-auto!"
      :onAfterLeave="closeAvatarEditor"
      v-model:show="visiable"
      preset="card"
      :trap-focus="false"
    >
      <div class="flex justify-around lt-md:flex-col">
        <div
          class="flex items-center flex-col mr-28px justify-center lt-md:(justify-center mb-12px)"
        >
          <div id="preview-avatar" class="w-188px h-188px overflow-hidden rounded-50%"></div>
          <div class="mt-28px">
            <n-button class="mr-12px" @click="visiable = false">关闭</n-button>
            <n-button type="primary" v-throttle="confirmCrop">修改</n-button>
          </div>
        </div>
        <div class="w-409px h-330px lt-md:(w-full h-300px)">
          <img id="avatar-canvas" class="block w-100% max-w-100%" />
        </div>
      </div>
    </modal>
  </div>
</template>

<script setup lang="ts">
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { useAuthStore } from '@/stores'
import { UploadApi } from '@/apis/upload.api'
import { fileUrl } from '@/utils'

const props = withDefaults(defineProps<{ disabled?: boolean }>(), {
  disabled: false
})

const AuthSto = useAuthStore()
const visiable = ref(false)
let avatarCanvas: any = null
let cropperInstance: any = null

// 打开头像编辑
const openAvatarEditor = () => {
  const el = document.querySelector('#avatar-upload') as HTMLInputElement
  el.value = '' // 防止重复上传同一张图片时不会打开裁剪弹窗
  el?.click()
}

// 关闭
const closeAvatarEditor = () => {
  avatarCanvas && (avatarCanvas.src = '')
  if (cropperInstance) {
    cropperInstance.destroy()
  }
}

// 创建cropper实例
const createCropper = (e: Event) => {
  const file: File = (e.target as any).files[0]
  if (file.size > 3000000) {
    return window.$message.warning(`图片大小不能大于3M`)
  }
  visiable.value = true
  nextTick(() => {
    avatarCanvas = document.querySelector('#avatar-canvas') as HTMLImageElement
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      avatarCanvas.src = reader.result as string
      cropperInstance = new Cropper(avatarCanvas, {
        aspectRatio: 1 / 1,
        preview: '#preview-avatar'
      })
    })
    reader.readAsDataURL(file)
  })
}

// 裁剪上传
const confirmCrop = () => {
  if (props.disabled) {
    window.$message.success('选择成功')
    visiable.value = false
    return
  }
  cropperInstance
    .getCroppedCanvas({
      fillColor: '#fff',
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'high'
    })
    .toBlob(async (blob: Blob) => {
      const formData = new FormData()
      formData.set('image', blob, 'avatar.png')
      await UploadApi.uploadAvatar(formData)
      window.$message.success(`修改成功`)
      await AuthSto.getUserInfo()
      visiable.value = false
    })
}
</script>

<style scoped lang="scss"></style>
