import { defineStore } from 'pinia'
import { persistLocalConfig } from '@/plugins'
import _ from 'lodash'
import { CFG } from '@/config'

export type ILayout = 'vertical' | 'classic'

export type IGreyOrWeakType = 'grey' | 'weak'

export type IDevice = 'pc' | 'mobile' | 'pad'

export interface IGlobalState {
  layout: ILayout
  isExpandMenu: boolean
  isKeepAlive: boolean
  isShowTab: boolean
  device: IDevice
  isDark: boolean
  isGrey: boolean
  isWeak: boolean
  themeColor: string
  thmeColorList: string[]
}

export const useGlobalStore = defineStore({
  id: 'GlobalStore',
  state: (): IGlobalState => {
    return {
      //是否隐藏侧边栏
      isExpandMenu: true,
      //是否开启页面缓存
      isKeepAlive: false,
      //标签栏
      isShowTab: true,
      //布局排列
      layout: 'classic',
      //当前设备
      device: 'pc',
      // 是否是深色主题
      isDark: false,
      // 色弱模式
      isWeak: false,
      // 灰阶模式
      isGrey: false,
      //系统主题色
      themeColor: CFG.THEME_COLOR_LIST[0],
      //系统内置主题色列表
      thmeColorList: CFG.THEME_COLOR_LIST
    }
  },
  actions: {
    /**
     * @description 灰色和弱色切换
    */
    changeGreyOrWeak(type: IGreyOrWeakType, value: boolean) {
      const body = document.body as HTMLElement
      if (!value) return body.removeAttribute('style')
      const styles: Record<IGreyOrWeakType, string> = {
        grey: 'filter: grayscale(1)',
        weak: 'filter: invert(80%)'
      }
      body.setAttribute('style', styles[type])
    },
    /**
    * @description 获取系统当前主题颜色
    */
    getAppThemeColor(): string {
      return this.themeColor;
    },

    getAppThemeList(): string[] {
      return this.thmeColorList;
    },
    /**
     * @description 赋值globalStore中的属性
     */
    setDevice() {
      const docEI = document.documentElement
      const clientWidth = docEI.clientWidth
      this.device = 'pc'
      if (clientWidth > 1280) {
        this.isExpandMenu = true
        this.device = 'pc'
      } else if (clientWidth > 767 && clientWidth <= 1280) {
        this.isExpandMenu = false
        this.device = 'pad'
      } else if (clientWidth <= 767) {
        this.isExpandMenu = false
        this.device = 'mobile'
      }

      // * 监听视口变化，修改device与isExpandMenu的值
      const _setDevice = _.debounce(this.setDevice, 800)
      window.addEventListener('resize', _setDevice, false)
      return _setDevice

    }
  },
  getters: {
    isMobile(store) {
      return store.device === 'mobile'
    },
  },
  // global-setting 是缓存数据的name
  persist: persistLocalConfig<IGlobalState>('global-setting')
})
