/**
 * @description 性别
 */
export enum USER_SEX {
  WOMAN,
  MAN
}

export const USER_SEX_OPTIONS = [
  {
    label: '男',
    value: 1
  },
  {
    label: '女',
    value: 0
  },
]

/**
 * @description PENDING: 审核中
 * @description ACTIVE: 正常状态
 * @description LOCKED: 账号锁定
 */
export enum USER_STATUS {
  PENDING,
  ACTIVE,
  LOCKED
}

export const USER_STATUS_OPTIONS = [
  { label: '审核中', value: USER_STATUS.PENDING },
  { label: '正常状态', value: USER_STATUS.ACTIVE },
  { label: '账号冻结', value: USER_STATUS.LOCKED }
]