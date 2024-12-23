import { GlobalThemeOverrides } from 'naive-ui'

export const commonSetting: GlobalThemeOverrides = reactive({
  Input: {
    borderRadius: '8px'
  },
  Button: {
    borderRadiusMedium: '8px',
    borderRadiusSmall: '8px',
    borderRadiusLarge: '12px'
  },
  Checkbox: {
    borderRadius: '4px'
  },
  Table: {
    borderRadius: '8px'
  },
  DataTable: {
    borderRadius: '8px'
  },
  Menu: {
    color: '#ffffff',
    fontSize: '15px',
    borderRadius: '8px'
  },
  Dialog: {
    borderRadius: '8px'
  },
  Card: {
    borderRadius: '8px'
  },
  Tooltip: {
    borderRadius: '8px'
  }
})

export const lightSetting: GlobalThemeOverrides = reactive({
  common: {
    // primaryColor: '#2080f0',
    // primaryColorHover: '#4098fc',
    // primaryColorPressed: '#2080f0',
    bodyColor: '#f7f7f9',
  },
  Menu: {
    color: '#ffffff',
    fontSize: '15px'
  },
  Tabs: {
    tabColor: '#fff',
  },
  Tooltip: {
    color: 'rgb(72,72,78)',
  }
})

export const darkSetting: GlobalThemeOverrides = reactive({
  common: {
    // primaryColor: '#2080f0',
    // primaryColorHover: '#4098fc',
    // primaryColorPressed: '#2080f0',
  },
})