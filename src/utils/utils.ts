import { IOptions } from "@/types/type"

/**
 * @description: 引入图片
 * @param  url 图片名称，例如：logo.png
 * @param  path 路径地址
 */
export const getImg = (url: string, path = '/images') => {
  return new URL(`../assets${path}/${url}`, import.meta.url).href
}

/**
 * @description: 访问后端服务上的文件
 * @param  url 图片名称
 * @param  path 路径地址
 */
export const fileUrl = (name: string, path = '/images') => {
  return import.meta.env.VITE_FILE_PREFIX + path + '/' + name
}

/**
 * @description 检查是否为邮箱
 */
export const IsEmail = (str: string) => {
  let reg = /^([a-zA-Z]|[0-9])(\w|\\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  return reg.test(str)
}

// 点击后自动下载
export const handleExport = async (api: Function, params?: any) => {
  const res = await api(params)
  if (!res) return
  const url = window.URL.createObjectURL(new Blob([res.data]))

  // 创建a标签
  let aLink = document.createElement('a')

  aLink.href = url

  // 获取文件名（服务端可能设置得有）
  const fileName = window.decodeURI(res.headers['content-disposition'].split('filename=')[1])

  // 设置文件名（如果不设置文件名，那么浏览器会自动打开预览，设置了文件名后会浏览器会自动下载）
  aLink.setAttribute('download', fileName)

  document.body.appendChild(aLink)
  //点击链接，实现自动下载
  aLink.click()
  //移除
  document.body.removeChild(aLink)
  //释放blob（务必释放，否则下载的文件永远是旧文件）
  window.URL.revokeObjectURL(aLink.href)
}

/**
 * 给 R、G、B添加对应的百分比
 * @param {string} color
 * @param {number} amount
 */
function addLight(color: string, amount: number) {
  const cc = parseInt(color, 16) + amount;
  const c = cc > 255 ? 255 : cc;
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
}

/**
 * 轻量化颜色值
 * @param {string} color 
 * @param {number} amount 
 */
export function lighten(color: string, amount: number) {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color;
  amount = Math.trunc((255 * amount) / 100);
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`;
}


/**
* @description 去重
*/
export const duplicateRemove = (options: IOptions) => {
  const newAarry = options.reduce((acc: IOptions, ite: any) => {
    const isExist = acc.some((ele: any) => ele.value === ite.value);
    if (!isExist) {
      acc.push(ite);
    }
    return acc;
  }, [] as IOptions);
  return newAarry
}

/**
* @description 平铺展开数组
*/
export const flatArray = <T extends Record<string, any>>(arr: T[], key: keyof T) => {
  return arr.reduce((acc, ite) => {
    acc.push(ite);
    if (Array.isArray(ite[key])) {
      acc = acc.concat(flatArray(ite[key], key));
    }
    return acc;
  }, [] as T[]);
}