import { TreeOption } from 'naive-ui/es/tree/src/interface';
import { isArray, isNumber, isString } from 'lodash';
import { flatArray } from '@/utils';
import { IOptions } from '@/types/type';
import { ITreeSelectProps } from '@/components/TreeSelect/TreeSelectModal.vue'

export type ITreeCheckedValue = Array<number | string> | number | string

export const useTreeSelectHook = (checkedValues: Ref<ITreeCheckedValue>) => {
  // 是否显示 tree-selet modal
  const isShowTreeModal = ref(false)
  // 选中节点的label
  const selectedLabels = ref<string[]>([])
  // 选中节点的key
  const checkedKeys = ref<Array<string | number>>([])
  // 是否展开
  const isExpand = ref(true)
  // 选中的节点
  const checkedNodes = ref<TreeOption[]>([])
  // 平铺后的option数组
  const flatOptions = ref<Record<string, any>[]>([])


  // 更新选中的keys
  const updateCheckedKeys = (value: ITreeCheckedValue) => {
    // 多选
    if (isArray(value)) {
      checkedKeys.value = value
    }
    // 单选
    else if (isNumber(value) || isString(value)) {
      checkedKeys.value = [value]
    } else {
      checkedKeys.value = []
    }
  }

  // 初始化 treeSelect 相关数据
  const initTreeSelectValue = (item: ITreeSelectProps) => {
    updateCheckedKeys(checkedValues.value)
    flatOptions.value = flatArray(item.options!, item.childrenField!)
    updateCheckedNodes(item)
    updateTreeLabel(item)
  }

  // 打开 treeSelect modal
  const openTreeSelectModal = (item: ITreeSelectProps) => {
    updateCheckedKeys(checkedValues.value)
    updateCheckedNodes(item)
    updateTreeLabel(item)
    isShowTreeModal.value = true
  }

  // 更新选中的节点
  const updateCheckedNodes = (item: ITreeSelectProps) => {
    const valueKey = item.keyField!
    if (!checkedKeys.value.length) checkedNodes.value = []
    checkedNodes.value = flatOptions.value.filter(((ele: any) => checkedKeys.value.includes(ele[valueKey])))
  }

  // 更新选中节点的 label
  const updateTreeLabel = (item: ITreeSelectProps) => {
    const labelKey = item.labelField!
    if (!checkedKeys.value.length) selectedLabels.value = []
    selectedLabels.value = checkedNodes.value?.map((ele: any) => ele[labelKey])
  }


  // 点击节点时的操作
  const updateSelectKey = (keys: Array<string & number>, _: Array<TreeOption | null>, meta: {
    node: TreeOption | null;
    action: any;
  }, item: ITreeSelectProps) => {

    updateCheckedKeys(item.multiple ? keys : [keys[keys.length - 1]])
    updateCheckedNodes(item)
  }

  // 全选
  const treeSelectAll = (item: ITreeSelectProps) => {
    const valueKey = item.keyField!
    const filterList = flatOptions.value.map((ele: any) => ele[valueKey])
    updateCheckedKeys(filterList)
    updateCheckedNodes(item)
  }

  // 清空选中
  const clearTreeSelectKeys = (item: ITreeSelectProps) => {
    checkedKeys.value = []
    updateCheckedNodes(item)
  }

  // 确认操作
  const confirmTreeSelect = (item: ITreeSelectProps) => {
    checkedValues.value = checkedKeys.value.length ? checkedKeys.value : []
    updateTreeLabel(item)
    isShowTreeModal.value = false
  }



  return {
    isShowTreeModal,
    selectedLabels,
    checkedKeys,
    isExpand,
    initTreeSelectValue,
    openTreeSelectModal,
    updateSelectKey,
    treeSelectAll,
    clearTreeSelectKeys,
    confirmTreeSelect
  }
}