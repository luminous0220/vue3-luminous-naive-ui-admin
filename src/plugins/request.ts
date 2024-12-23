import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import { CFG } from '@/config'
import { HTTP_STATUS } from '@/constants'
import { AuthApi } from '@/apis'
import { checkStatus, local, navigate } from '@/utils'
import { fullLoading } from '@/plugins'
import { useAuthStore } from '@/stores'

export interface IHttpRequestConfig extends InternalAxiosRequestConfig {
  noToken?: boolean
  isLoading?: boolean
}

interface IConfig extends AxiosRequestConfig {
  noToken?: boolean
}

interface IRequestParams {
  url: string
  params?: object
  config?: IConfig
}

interface IResponse<T = any> {
  code: number
  message: string
  data: T
}

// * 基础配置
const DEFAULT_CONFIG = {
  baseURL: import.meta.env.VITE_BASE_URL as string,
  timeout: CFG.AXIOS_TIME_OUT,
  withCredential: true,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
}

// * 创建axios实例的类
class RequestHttp {
  // * Axios实例
  private requestServer: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.requestServer = axios.create(config)

    // 请求拦截器
    this.requestServer.interceptors.request.use(
      async (confi: IHttpRequestConfig) => {
        const { headers, noToken } = confi

        // 如果是白名单里的请求url，则不需要 token
        if (noToken) {
          return confi
        }

        const token = local.getCookie(CFG.ACCESS_TOKEN)
        headers.setAuthorization('Bearer ' + token)
        return confi
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.requestServer.interceptors.response.use(
      async (interRes: AxiosResponse) => {
        const { data, status } = interRes
        // 文件下载直接返回interRes
        if (data.constructor === Blob) return interRes

        return data
      },
      async (error: AxiosError<{ code: string; message: string } | any>) => {
        const { response, config } = error
        // 下载文件出错时的提示
        if (response?.data.type == 'application/json') {
          const reader = new FileReader() //创建一个FileReader实例
          reader.readAsText(response?.data, 'utf-8') //读取文件,结果用字符串形式表示

          reader.onload = function () {
            //读取完成后，获取 reader.result
            const { message } = JSON.parse(reader.result as string)
            window.$message.error(message)
          }
          return Promise.reject(response)
        }

        // 如果 refresh-token 接口也报错，则抛出错误
        if (response?.status !== HTTP_STATUS.SUCCESS && config?.url?.includes('refresh-token')) {
          return Promise.reject(new Error('登录已过期，请重新登录'))
        }

        // 登录失效，重新获取 token，并执行之前失败的请求
        if (response?.status === HTTP_STATUS.OVERDUE) {
          try {
            let res = await AuthApi.refreshToken()

            // 移除 Token
            local.removeCookie(CFG.ACCESS_TOKEN)
            local.removeCookie(CFG.REFRESH_TOKEN)
            // 设置新的token
            useAuthStore().setToken(res.data)

            // 执行之前失败的请求
            let { url, method, params, data } = config!
            params = params ? params : data
            //@ts-ignore
            return this[method]({ url: url!, params, config })
          } catch (error: any) {
            if (error.message) window.$message.error(error.message)
            // 刷新token失败，则清空数据，返回登录页
            local.clearCookie()
            navigate(CFG.LOGIN_PATH)
            return Promise.reject(error)
          }
        }

        // 请求超时 && 网络错误单独判断，没有 response
        if (error.message.includes('timeout')) {
          window.$message.error('网络请求超时，请您重试')
          return Promise.reject(response)
        }

        if (!window.navigator.onLine) {
          navigate('/off-line')
          return Promise.reject(response)
        }

        const { data, status, statusText } = response || {}

        checkStatus(status!, data?.message || statusText)

        return Promise.reject(response)
      }
    )
  }

  get<T>(p: IRequestParams): Promise<IResponse<T>> {
    const { url, params, config } = p
    return this.requestServer.get(url, { params, ...config })
  }
  post<T>(p: IRequestParams): Promise<IResponse<T>> {
    const { url, params, config } = p
    return this.requestServer.post(url, params, config)
  }
  put<T>(p: IRequestParams): Promise<IResponse<T>> {
    const { url, params, config } = p
    return this.requestServer.put(url, params, config)
  }
  delete<T>(p: IRequestParams): Promise<IResponse<T>> {
    const { url, params, config } = p
    return this.requestServer.delete(url, { params, ...config })
  }
}

export const http = new RequestHttp(DEFAULT_CONFIG)

// * 使用类来封装axxios，可以创建多个实例，适用性更广
// export const http_another = new RequestHttp(OTHER_CONFIG)
