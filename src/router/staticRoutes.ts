import { CFG } from '@/config'

export const staticRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/Login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/',
    name: 'Layout',
    redirect: CFG.HOME_PATH,
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/user-setting',
        name: 'UserSetting',
        component: () => import('@/views/UserSetting/UserSetting.vue'),
        meta: {
          icon: 'carbon:user-profile',
          title: '用户设置',
        },
      },
    ]
  },
  {
    path: '/redirect/:path(.*)',
    name: 'Redirect',
    component: () => import('@/components/Redirect/Redirect.vue')
  }
]

// * errorRouter(错误页面路由)
export const errorRoutes = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/ErrorMessage/404.vue'),
    meta: {
      title: '404页面'
    }
  },
  {
    path: '/off-line',
    name: 'OffLine',
    component: () => import('@/components/ErrorMessage/OffLine.vue'),
    meta: {
      title: '500页面'
    }
  }
]