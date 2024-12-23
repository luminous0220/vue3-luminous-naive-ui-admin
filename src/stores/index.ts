import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const store = createPinia()

// pinia 持久化存储
store.use(piniaPluginPersistedstate)

export * from './modules/global'
export * from './modules/auth'
export * from './modules/appRoute'
export * from './modules/tab'
export * from './modules/keepAlive'
