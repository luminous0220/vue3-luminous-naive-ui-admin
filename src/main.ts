import { createApp } from 'vue'
import { store } from '@/stores'
import 'virtual:svg-icons-register'
import 'virtual:uno.css'
import './styles/reset.scss'
import './styles/theme.scss'
import { icons as ep } from '@iconify-json/ep'
import { icons as carbon } from '@iconify-json/carbon'
import { addCollection } from '@iconify/vue'
import App from './App.vue'
import router, { setupRouter } from './router'
import { createDiscretePlugin } from './plugins'
import { setupGlobalComponent } from './components'
import { setupDirectives } from './directives'

async function appInit() {
  const app = createApp(App)
  app.use(store)

  // 注册 naive-ui 上下文API
  createDiscretePlugin()
  // 注册全局组件
  setupGlobalComponent(app)
  // 注册指令
  setupDirectives(app)
  // 注册路由
  setupRouter(app)
  // 添加图标集
  addCollection(ep)
  addCollection(carbon)

  // 路由准备完成后再挂载app实例
  await router.isReady()

  app.mount('#app')
}

appInit().then(() => {
  // 捕获全局错误
  window.addEventListener('unhandledrejection', (event) => {
    console.warn(`捕获全局错误: ${event.reason}`)
  })
})
