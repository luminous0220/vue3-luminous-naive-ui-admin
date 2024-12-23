/*
  v-loading 加载动画
*/

import { LoadingOne } from '@/components'
import { DirectiveBinding, createApp } from 'vue'

// 根节点
const root = window.document.documentElement

// 挂载
const appendEl = (el: any, isFull: boolean) => {
  // 每次挂载时都要将visiable置为true
  el.instance.visiable = true
  // isFull修饰表示全屏，将组件挂载到根节点上
  if (isFull) {
    root.appendChild(el.instance.$el)
    return
  }
  el.style.position = 'relative'
  el?.appendChild(el.instance.$el)
}


const directive = {
  mounted(el: any, binding: DirectiveBinding) {
    // 创建 app 实例（使用单例的方式）
    const app = createApp(LoadingOne)
    // 创建div标签,将实例挂载到div标签上
    const instance = app.mount(document.createElement('div'))
    // 把instance和app赋在el上，方便数据传递
    el.instance = instance
    el.app = app
    // 各种修饰符
    const { arg, value, modifiers } = binding
    el.instance.text = arg
    value && appendEl(el, modifiers.full)
  },
  updated(el: any, binding: DirectiveBinding) {
    const { value, oldValue, modifiers } = binding
    if (value !== oldValue) {
      value ? appendEl(el, modifiers.full) : (el.instance.visiable = false)
    }
  },
  beforeUnmount(el: any) {
    el.app.unmount()
  }
}


export default directive