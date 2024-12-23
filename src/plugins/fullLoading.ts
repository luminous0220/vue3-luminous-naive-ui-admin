import { LoadingOne } from "@/components"

let app: any = null

export const fullLoading = (flag = true, text = '请稍后...', cb?: Function) => {
  if (flag) {
    // 创建 app 实例（使用单例的方式）
    app = createApp(LoadingOne)
    // 创建div标签,将实例挂载到div标签上
    const instance = app.mount(document.createElement('div'))
    // 根节点
    const root = window.document.documentElement
    instance.text = text
    cb && cb(instance)
    root.appendChild(instance.$el)
  } else {
    app?.unmount()
  }
}