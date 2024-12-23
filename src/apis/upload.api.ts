import { http } from '@/plugins'

/**
 * @description 上传xlxs文件，批量新增用户
 */
const batchCreateUser = (params: any) => {
  return http.post<string>({
    url: `/api/upload/users`,
    params,
    config: {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  })
}

/**
 * @description 上传图片
 */
const uploadAvatar = (params: any) => {
  return http.post<string>({
    url: `/api/upload/avatar`,
    params,
    config: {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  })
}

export const UploadApi = {
  uploadAvatar,
  batchCreateUser
}
