import { darkSetting, lightSetting, commonSetting } from './themeSetting'

export const CFG = {
  // 登录页 path
  LOGIN_PATH: '/login',
  // 主页 path
  HOME_PATH: '/home',
  // 路由白名单
  WHITE_PATH_LIST: ['/login', '/off-line', '/404'],
  // 默认缓存期限（7天）
  DEFAULT_CACHE_TIME: 60 * 60 * 24 * 7,
  // ACCESS_TOKEN
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  // REFRESH_TOKEN
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  // 请求 TIME OUT 时间
  AXIOS_TIME_OUT: 1000 * 10,
  // 系统内置主题色列表
  THEME_COLOR_LIST: [
    '#35a3ff',
    '#2d8cf0',
    '#0960bd',
    '#009688',
    '#536dfe',
    '#ff5c93',
    '#ee4f12',
    '#0096c7',
    '#9c27b0',
    '#ff9800',
    '#FF3D68',
    '#00C1D4',
    '#71EFA3',
    '#171010',
    '#78DEC7',
    '#1768AC',
    '#FB9300',
    '#FC5404',
  ],
  COMMON_SETTING: commonSetting,
  // 暗黑主题
  DARK_SETTING: darkSetting,
  // 亮色主题
  LIGHT_SETTING: lightSetting,
}