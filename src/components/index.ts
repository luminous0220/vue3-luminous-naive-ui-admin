import type { App } from 'vue'
import { LoadingOne } from '@/components/Loading'
import { Icon } from '@iconify/vue'
import AppProvider from '@/components/AppProvider/AppProvider.vue'
import Motion from '@/components/Motion/Motion.vue'
import TreeSelectModal from '@/components/TreeSelect/TreeSelectModal.vue'
import TreeSelect from '@/components/TreeSelect/TreeSelect.vue'
import Modal from '@/components/Modal/Modal.vue'
import Drawer from '@/components/Drawer/Drawer.vue'
import { FormPro, EditForm } from '@/components/FormPro'
import { TablePro } from '@/components/TablePro'
import AvatarEditor from '@/components/AvatarEditor/AvatarEditor.vue'
import ManualUpload from '@/components/Upload/ManualUpload.vue'
import AButton from '@/components/Button/AButton.vue'
import BButton from '@/components/Button/BButton.vue'
/**
 * @description 注册全局组件
 */
export const setupGlobalComponent = (vue: App) => {
  vue.component('Icon', Icon)
  vue.component('AButton', AButton)
  vue.component('BButton', BButton)
  vue.component('Motion', Motion)
  vue.component('Modal', Modal)
  vue.component('Drawer', Drawer)
  vue.component('FormPro', FormPro)
  vue.component('EditForm', EditForm)
  vue.component('TablePro', TablePro)
  vue.component('TreeSelect', TreeSelect)
  vue.component('TreeSelectModal', TreeSelectModal)
}

export {
  LoadingOne,
  Icon,
  AppProvider,
  Modal,
  Drawer,
  AvatarEditor,
  EditForm,
  ManualUpload,
  TreeSelectModal
}

export * from './FormPro'
export * from './TablePro'
