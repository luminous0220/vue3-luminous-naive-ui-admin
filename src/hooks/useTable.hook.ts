import { handleExport } from '@/utils'
import { PaginationProps } from 'naive-ui'

/**
 * @description 表格相关操作hooks函数
 * @param reqApi 请求函数
 * @param initParam 初始化参数
 * @param isPageable 是否需要分页
 * @param callBack 回调函数
 * @param exportRequestFn 导出函数
 */
export const useTableHook = (
  isPage: boolean,
  searchParam: Record<string, any>,
  exportRequestFn?: Function,
  reqApi?: Function,
  callBack?: Function,
) => {
  // 加载态
  const loading = ref(false)

  // 分页参数
  const pageParam = reactive({
    pageNumber: 1,
    pageSize: 20,
    total: 0
  })

  // 列表
  const list = ref([])

  /**
   * @description 发送请求，加载数据
   * @param pageNumber 当前页
   */
  const loadData = async () => {

    // 设置加载中
    if (!reqApi) {
      window.$message.warning('未设置请求函数')
      loading.value = false
      return
    }

    loading.value = true
    try {
      const params: any = {}
      // 筛选掉查询参数中值为空的字段
      for (let key in searchParam.value) {
        if (searchParam.value[key]) {
          params[key] = searchParam.value[key]
        }
      }

      Object.assign(params, isPage ? pageParam : {})

      // 发送请求
      let res = await reqApi(params)
      let { data } = res
      // 回调处理请求结果
      if (callBack) {
        list.value = callBack(res)

      } else {
        list.value = data.list
      }
      pageParam.total = data.total || 0
    } catch (error) {
      console.error(error)
    } finally {
      // 关闭加载中
      nextTick(() => {
        loading.value = false
      })
    }
  }

  /**
   * @description 搜索
   */
  const search = () => {
    // if (
    //   Object.values(searchParam.value).every((val) => {
    //     return val === '' ? true : false
    //   })
    // ) {
    //   window.$message.warning('查询输入不能全为空')
    //   loading.value = false
    //   return
    // }

    // 若pageNumber不为1，则将pageNumber重置为1
    if (pageParam.pageNumber !== 1) {
      pageParam.pageNumber = 1
      // 在这里return，避免多次调用loadData
      return
    }
    loadData()
  }


  /**
   * @description 导出功能
   */
  const exportFile = async () => {
    try {
      if (!exportRequestFn) {
        throw new Error('当前没有提供exportRequestFn函数')
      }
      if (typeof exportRequestFn !== 'function') {
        throw new Error('exportRequestFn必须是一个函数')
      }
      // 导出
      await handleExport(exportRequestFn, searchParam.value)
      window.$message.success('导出成功')
    } catch (error) {
      console.error(error)
    }
  }

  /**
  * @description 刷新数据
  */
  const reload = async () => {
    await loadData()
  }

  // 监听分页数据改变
  watch(
    () => [pageParam.pageNumber, pageParam.pageSize],
    () => {
      loadData()
    }
  )


  return {
    loading,
    pageParam,
    list,
    searchParam,
    loadData,
    search,
    reload,
    exportFile
  }
}
