<template>
  <div class="w-full h-full my-upload">
    <!-- 按钮模式 -->
    <n-upload v-if="type === 'button'" ref="UploadRef" action="#" :max="max" v-model:file-list="fileList"
      :show-file-list="showFileList" :custom-request="httpRequest">
      <n-button>上传文件</n-button>
    </n-upload>

    <!-- 拖拽模式 -->
    <n-upload v-else-if="type === 'dragger'" ref=" UploadRef" class="w-full h-full" directory-dnd action="#" :max="max"
      v-model:file-list="fileList" :show-file-list="showFileList" :custom-request="httpRequest">
      <n-upload-dragger class="h-full rounded-8px flex-center flex-col" style="border: 1px dashed #b5bdc3">
        <div class="mb-12px">
          <n-icon size="48" :depth="3">
            <i-carbon-download />
          </n-icon>
        </div>
        <n-text class="text-16px">
          点击或者拖动文件到该区域来上传
        </n-text>
        <n-p depth="3" class="mt-8px">
          仅支持上传文件的格式为：{{ props.fileExt.join("、") }}
        </n-p>
      </n-upload-dragger>
    </n-upload>

    <!-- 弹窗模式 -->


    <n-button v-else-if="type === 'modal'" secondary type="info" @click="visiable = true">
      <template #icon>
        <i-carbon-cloud-upload />
      </template>
      {{ btnText }}
    </n-button>

    <modal title="上传" :mask-closable="false" v-model:show="visiable" preset="card">
      <n-upload ref=" UploadRef" class="w-full h-full" directory-dnd action="#" :max="max" v-model:file-list="fileList"
        :show-file-list="showFileList" :custom-request="httpRequest">
        <n-upload-dragger class="h-full rounded-8px flex-center flex-col" style="border: 1px dashed #b5bdc3">
          <div class="mb-12px">
            <n-icon size="48" :depth="3">
              <i-carbon-download />
            </n-icon>
          </div>
          <n-text class="text-16px">
            点击或者拖动文件到该区域
          </n-text>
          <n-p depth="3" class="mt-8px">
            支持文件的格式为：{{ props.fileExt.join("、") }}
          </n-p>
        </n-upload-dragger>
      </n-upload>

      <div class="text-right mt-16px">
        <n-button @click="handleSubmit" type="primary">确认提交</n-button>
      </div>
    </modal>

  </div>
</template>

<script setup lang="ts">
import {
  UploadCustomRequestOptions,
  UploadFileInfo,
  UploadInst
} from "naive-ui"

interface IProps {
  size?: number
  fileExt: string[]
  type: 'button' | 'dragger' | 'modal'
  max: number
  showFileList?: boolean
  btnText?: string
}

const props = withDefaults(defineProps<IProps>(), {
  size: 5,
  fileExt: () => [],
  type: 'button',
  max: 1,
  showFileList: true,
  btnText: '上传文件'
})

const UploadRef = ref<UploadInst>()
// 文件列表
const fileList = ref<UploadFileInfo[]>([])
// 显示上传弹窗
const visiable = ref(false)
// 自定义上传
const httpRequest = async (upload: UploadCustomRequestOptions) => {
  const file = upload.file.file!
  let name = file.name.replace(/.+\./, "")
  if (props.fileExt.indexOf(name.toLowerCase()) === -1) {
    window.$message.error(`请上传${props.fileExt.join("、")}格式的文件!`)
    clearFileList()
    return false
  }

  const bool = file.size / 1024 / 1024 < 20

  if (!bool) {
    window.$message.error(`文件大小不能超过${props.size}MB!`)
    clearFileList()
    return false
  }
  // 如果是modal模式，则不触发上传，需要用户点击确定能触发
  if (props.type === 'modal') {
    return
  }
  emit("success", [file])
}

// modal模式 手动点击确认提交
const handleSubmit = () => {
  const list = fileList.value.map((item) => item.file!) || []
  visiable.value = false
  emit("success", list)
  clearFileList()
}

const clearFileList = () => {
  UploadRef.value?.clear()
  nextTick(() => {
    fileList.value.length = 0
  })
}


const emit = defineEmits<{ "success": [file: File[]] }>()
</script>

<style lang="scss" scoped>
.my-upload {
  :deep(.n-upload) {
    .n-upload-trigger {
      height: 100%;
    }
  }
}
</style>
