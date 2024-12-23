import { CFG } from "@/config";
import { useAppRouteStore, useAuthStore } from "@/stores";
import { local } from "@/utils";
import { Router, RouteRecordRaw, useRouter } from "vue-router";


/**
 * @description 重置路由
 * */
export const resetRouter = () => {
  const AppRouteSto = useAppRouteStore()
  const router = useRouter()
  AppRouteSto.isDynamicRouteAdded = false
  AppRouteSto.menus.forEach((item) => {
    const { name } = item
    if (name && router.hasRoute(name)) router.removeRoute(name)
  })
}


export const createRouterGuards = (router: Router) => {
  const appRouteSto = useAppRouteStore();
  router.beforeEach(async (to, from, next) => {
    const LoadingBar = window.$loadingBar || null;
    LoadingBar && LoadingBar.start();

    const token = local.getAccessToken()
    try {

      // token失效时
      if (!token) {
        // 路由白名单
        if (CFG.WHITE_PATH_LIST.includes(to.path)) {
          next();
          return;
        }

        resetRouter()

        // 跳转至 login 页面
        const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
          path: CFG.LOGIN_PATH,
          replace: true,
        };

        // 如果当前要访问的路由路径存在。则执行下面逻辑，存储跳转登录页面时携带的查询参数并将用户原本想要访问的路由路径（to.path）作为 redirect 参数的值传递过去。这样做的好处是，在用户完成登录后，可以根据这个 redirect 参数的值，将用户重定向回他们最初想要访问的页面，并携带了 query 参数以完成某些立即请求
        if (to.path) {
          redirectData.query = {
            ...redirectData.query,
            redirect: to.path,
          };
        }

        next(redirectData);
        return;
      } else {
        // 如果用户在token有效时访问登录页，则强制让它回跳到当前页面
        if (to.path === CFG.LOGIN_PATH) {
          token && next({ path: from.fullPath })
          return
        }
      }

      if (appRouteSto.isDynamicRouteAdded) {
        // 路由页面不存在时就跳到404页面
        if (!to.matched.length) {
          return next({ path: '/404' })
        }
        next();
        return;
      }

      const authStore = useAuthStore()
      await authStore.getUserInfo()
      const menus = await authStore.getPermission()

      const { dynamicRoutes } = await appRouteSto.generateDynamicRoutes(menus);

      // 动态添加可访问路由表
      dynamicRoutes.forEach((item) => {
        router.addRoute('Layout', item as unknown as RouteRecordRaw);
      });
      appRouteSto.isDynamicRouteAdded = true
      console.log(router.getRoutes())

      next({ ...to, replace: true, });
    } catch (error) {
      resetRouter()
      // 😎 请求出错时清除token并重定向到登陆页
      local.clearCookie()
      // 回到登录页
      next({ path: CFG.LOGIN_PATH })
    }

  });

  router.afterEach((to, _, failure) => {
    document.title = (to?.meta?.title as string) || document.title;
    window.$loadingBar.finish()
  });

  router.onError((error) => {
    resetRouter()
    console.log(error, '路由错误');
  });
}