import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { AuthApi, IMenu } from '@/apis';
import { useAuthStore } from './auth';
import { MENU_TYPE } from '@/constants';


let viewsModules: Record<string, () => Promise<Recordable>> = import.meta.glob('@/views/**/*.{vue,tsx}');

/**
* @description 动态导入
*/
export const dynamicImport = (
  viewsModules: Record<string, () => Promise<Recordable>>,
  menuItem: IMenu.Item
) => {

  const keys = Object.keys(viewsModules);
  const matchKeys = keys.filter((key) => {
    let k = key.replace('/src/views', '');
    const lastIndex = k.lastIndexOf('.');
    k = k.substring(0, lastIndex);
    return k === menuItem.componentPath;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return viewsModules[matchKey];
  }
  if (matchKeys?.length > 1) {
    console.warn(
      '❗请不要在同一级目录下创建相同文件名的文件（比如 index.vue 和 index.tsx ），这会导致动态引入失败！❗'
    );
    return;
  }
};

/**
* @description 将数据转换为 RouteRecordRaw 树形结构
*/
const organizeData = (menus: IMenu.Item[], parent?: RouteRecordRaw): RouteRecordRaw[] => {

  const newTree = menus.map((menuItem) => {

    // 处理有可能出现两个反斜杠的情况
    menuItem.path = menuItem.path.replace('//', '/');
    menuItem.componentPath = menuItem.componentPath.replace('//', '/');

    const route: RouteRecordRaw = {
      name: menuItem.name,
      path: menuItem.path,
      redirect: menuItem.redirect,
      component: dynamicImport(viewsModules, menuItem),
      children: [],
      meta: {
        title: menuItem.title,
        icon: menuItem.icon,
        permission: menuItem.permission,
        parentId: menuItem.parentId,
        type: menuItem.type,
        isKeepAlive: menuItem.isKeepAlive,
        sort: menuItem.sort,
        status: menuItem.status
      }
    }

    if (parent) {
      route.path = parent.path + route.path
      //如果父路由未定义 redirect 默认第一个子路由为 redirect
      !parent.redirect && (parent.redirect = route.path)
    }

    if (menuItem.children.length) {
      route.children = organizeData(menuItem.children, route)
    }

    return route
  })

  return newTree


}


/**
* @description 树形数组转换为平铺数组
*/
const flattenTree = (tree: RouteRecordRaw[]) => {
  const result: RouteRecordRaw[] = [];
  const flatten = (node: RouteRecordRaw) => {
    result.push(node);
    if (node.children) {
      node.children.forEach(flatten);
    }
  };
  tree.forEach(flatten);
  return result;
}

export interface IAppRoute {
  menus: RouteRecordRaw[];
  isDynamicRouteAdded: boolean;
}

export const useAppRouteStore = defineStore({
  id: 'app-route',
  state: (): IAppRoute => ({
    menus: [],
    isDynamicRouteAdded: false,
  }),

  actions: {
    /**
     * @description 动态生成菜单
     * @returns {Promise<Router>}
     */
    async generateDynamicRoutes(menus: IMenu.Item[]) {
      try {

        if (menus.length === 0) {
          window.$notice.warning({
            content: '当前账号无任何菜单权限，请联系系统管理员！',
            title: '无权限访问',
            duration: 5000
          })
          return Promise.reject('Forbidden')
        }
        const dynamicRoutes = organizeData(menus);
        this.menus = dynamicRoutes
        return { dynamicRoutes };
      } catch (error) {

        console.error('generateDynamicRoutes出错！')
        return Promise.reject(error)
      }

    }
  },
  getters: {
    /**
    * @description 获取扁平化的菜单列表
    */
    flatMenuGet: (state) => {
      return flattenTree(state.menus)
    }
  }
});