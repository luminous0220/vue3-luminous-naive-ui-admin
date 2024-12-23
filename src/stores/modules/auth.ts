import { defineStore } from 'pinia'
import { AuthApi, IAuth, type IMenu } from '@/apis'
import { IsEmail, local } from '@/utils'
import { MD5 } from 'crypto-js'
import { USER_STATUS } from '@/constants'
import { CFG } from '@/config'
export interface IAuthState {
  user: {
    username: string
    nickname: string
    sex: number
    email: string
    avatar: string
    age: number
    phone: string
    sign: string
    birthday: string
    status: USER_STATUS
  }
  roles: Array<string>
  permissions: Array<IMenu.IPermission>
}

export const useAuthStore = defineStore({
  id: 'Authstore',
  state: (): IAuthState => {
    return {
      user: {
        username: '',
        nickname: '',
        sex: 1,
        email: '',
        avatar: '',
        sign: '',
        age: 0,
        phone: '',
        birthday: '',
        status: 1
      },
      roles: [],
      permissions: [],
    }
  },
  actions: {
    /**
     * @description 密码登录
     */
    async login(account: string, password: string) {
      const params = {
        email: '',
        username: '',
        password: MD5(password).toString()
      }
      // 检查是否输入了邮箱
      if (IsEmail(account)) {
        params.email = account
      } else {
        params.username = account
      }
      const { data } = await AuthApi.login(params)
      this.setToken(data)
    },
    /**
    * @description 设置 token
    */
    async setToken(data: IAuth.ITokenData) {
      const { accessToken, refreshToken, expires } = data
      local.setCookie(CFG.ACCESS_TOKEN, accessToken, expires)
      local.setCookie(CFG.REFRESH_TOKEN, refreshToken, expires)
    },
    /**
     * @description 获取用户信息
     */
    async getUserInfo() {
      const res = await AuthApi.getUserInfo()
      Object.assign(this.user, res.data)
    },
    /**
     * @description 获取用户权限
     */
    async getPermission() {
      // 按钮权限
      const { data: btnPermissions } = await AuthApi.getUserBtnPermissions()
      this.permissions = btnPermissions
      // 菜单权限
      const { data: menuList } = await AuthApi.getAuthMenuList()
      return menuList
    }
  },
})
