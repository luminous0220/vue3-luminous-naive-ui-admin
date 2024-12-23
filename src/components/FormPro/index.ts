import { CheckboxGroupProps, CheckboxProps, DatePickerProps, FormItemProps, FormItemRule, FormProps, InputNumberProps, InputProps, RadioProps, SelectProps, SwitchProps, TreeProps } from "naive-ui"
import form_pro from './FormPro.vue'
import edit_form from './EditForm.vue'
import { VNode } from "vue";
import { IOptions } from "@/types/type";

export type IFormType = 'modal' | 'drawer'

export type IRenderScope = {
  [key: string]: any
}


export interface IFormSchema {
  type?: 'input' | 'check' | 'radio' | 'date' | 'select' | 'input-number' | 'switch' | 'tree-select';
  field: string;
  label: string;
  labelTip?: string;
  labelTipStyle?: Record<string, any>
  slot?: boolean
  default?: any
  options?: IOptions
  inputProps?: InputProps & { prefix?: () => VNode | string | number }
  selectProps?: SelectProps
  switchProps?: SwitchProps & { checkedLabel: string; unCheckedLabel: string }
  checkboxGroupProps?: CheckboxGroupProps
  checkboxProps?: CheckboxProps
  radioProps?: RadioProps
  dateProps?: DatePickerProps
  treeProps?: TreeProps
  inputNumberProps?: InputNumberProps
  rules?: FormItemRule[]
  render?: () => VNode | string | number // 自定义单元格内容渲染（render函数）
}

export interface IFormProps {
  justify?: 'start' | 'end' | 'center',
  span?: number
  contentClass?: string
  submitText?: string
  model: Record<string, any>
  schemas: IFormSchema[]
  showFooter?: boolean
  showCloseBtn?: boolean
}

export const FormPro = form_pro
export const EditForm = edit_form