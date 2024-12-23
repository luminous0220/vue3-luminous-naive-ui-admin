import { computed, defineComponent, ref } from 'vue'
import type { ConfigProviderProps } from 'naive-ui'
import { createDiscreteApi, darkTheme, lightTheme } from 'naive-ui'

/**
* @description 如果你想在 setup 外使用 useDialog、useMessage、useNotification、useLoadingBar，useModal，可以通过 createDiscreteApi 来构建对应的 API
*/
export const createDiscretePlugin = () => {
  const themeRef = ref<'light' | 'dark'>('light')
  const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
    theme: themeRef.value === 'light' ? lightTheme : darkTheme
  }))

  const { message, notification, dialog, loadingBar, modal } = createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar', 'modal'],
    {
      configProviderProps: configProviderPropsRef,
      messageProviderProps: { duration: 3000 },
    }
  )

  window['$message'] = message;
  window['$dialog'] = dialog;
  window['$notice'] = notification;
  window['$loadingBar'] = loadingBar;
}



