import { EllipsisProps } from 'naive-ui'
import _ from './TablePro.vue'
import { IFormSchema } from '../FormPro'
import { VNodeTypes } from 'vue'
import { IOptions } from '@/types/type'

export type IColumnType = 'index' | 'selection' | 'expand' | 'children'


export type IColumns<T = any> = Array<{
  title?: string
  key?: string
  type?: IColumnType
  hide?: boolean
  width?: string | number
  fixed?: string
  ellipsis?: boolean | EllipsisProps
  render?: (rowData: T, rowIndex: number) => VNodeTypes;
  noFilter?: boolean
  noSort?: boolean
  sorter?: boolean | Function | 'default'
  /**
  * @description 过滤时的比较函数 value是筛选时选中的值，row是当前行数据，返回true/false来决定这一行是否显示
  */
  filter?: (value: any, row: T) => boolean
  /**
  * @description 自定义过滤选项
  */
  filterOptions?: IOptions
  /**
  * @description 参数data为表格数据，可用于自定义过滤选项
  */
  filterOptionsMap?: (data: T[]) => IOptions
}>;

export interface ITableProps {
  columns: IColumns // 表格列
  data?: any[] // 表格静态数据，如果存在则不会调用 reqApi 返回的data
  searchs?: IFormSchema[]  // 查询表单配置
  exportApi?: (params: any) => any // 导出函数API
  callBack?: Function // 回调函数
  initParam?: Record<string, any> //初始参数配置
  reqApi?: (params: any) => Promise<any> // 请求表格数据的 api
  title?: string
  striped?: boolean
  isPage?: boolean
  searchParams?: Record<string, any>
  rowKey?: string
  childrenKey?: string // 树形数据下后代节点在数据中的 key
  reqAuto?: boolean // 是否自动执行 reqApi 请求（默认为true）
}


export const TablePro = _