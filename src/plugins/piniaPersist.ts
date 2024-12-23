import { StateTree } from 'pinia'
import { PersistenceOptions } from 'pinia-plugin-persistedstate'

/**
 * @description 持久化本地缓存pinia（localStorage）
 * @param key 缓存数据的 name
 * @param paths 需要持久化的 state 中的属性名，不传默认缓存全部属性
 * */
export const persistLocalConfig = <T extends StateTree>(key: string, pick?: string[]) => {
  const persist: PersistenceOptions<T> = {
    key,
    storage: window.localStorage,
    pick
  }
  return persist
}

/**
 * @description 持久化本地缓存pinia（sessionStorage）
 * @param key 缓存数据的 name
 * @param paths 需要持久化的 state 中的属性名，不传默认缓存全部属性
 * */
export const persistSessionConfig = <T extends StateTree>(key: string, pick?: string[]) => {
  const persist: PersistenceOptions<T> = {
    key,
    storage: window.sessionStorage,
    pick
  }
  return persist
}
