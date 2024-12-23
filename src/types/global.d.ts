import { DialogApi, LoadingBarApi, MessageApi, NotificationApi } from 'naive-ui'

declare global {
  declare type Recordable<T = any> = Record<string, T>;
  interface Window {
    $message: MessageApi
    $dialog: DialogApi
    $notice: NotificationApi
    $loadingBar: LoadingBarApi
  }
}