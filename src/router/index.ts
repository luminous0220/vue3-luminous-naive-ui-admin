import { createRouter, createWebHistory } from 'vue-router'
import { App } from 'vue';
import { errorRoutes, staticRoutes } from './staticRoutes';
import { createRouterGuards } from './guards';


const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...staticRoutes,
    ...errorRoutes
  ],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App) {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router);
}

export default router
