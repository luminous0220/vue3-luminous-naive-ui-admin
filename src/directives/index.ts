import { App } from 'vue';
import clickOutside from '@/directives/clickOutside';
import copy from '@/directives/copy';
import debounce from '@/directives/debounce';
import draggable from '@/directives/draggable';
import loading from '@/directives/loading';
import longpress from '@/directives/longpress';
import permission from '@/directives/permission';
import throttle from '@/directives/throttle';

/**
 * 注册全局自定义指令
 * @param app
 */
export function setupDirectives(app: App) {
  // 点击非自身区域指令
  app.directive('clickOutside', clickOutside);
  // 复制指令
  app.directive('copy', copy);
  // 加载指令
  app.directive('loading', loading);
  // 长按指令
  app.directive('longpress', longpress);
  // 防抖指令
  app.directive('debounce', debounce);
  // 节流指令
  app.directive('throttle', throttle);
  // 拖拽指令
  app.directive('draggable', draggable);
  // 权限控制指令
  app.directive('permission', permission);
}
