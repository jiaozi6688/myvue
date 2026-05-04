import { createRouter, createWebHistory } from 'vue-router'
import { useLoginStore } from '@/pinia/loginstor'
import axios from 'axios';
import message from '../components/modal/message'
// meta.glob是动态导入所有.vue文件，返回一个对象，键是组件路径，值是组件函数
const pages = import.meta.glob('../views/**/page.ts', { eager: true, import: 'default' })
// 拿到所有.vue文件的路径
const components = import.meta.glob('../views/**/*.vue')
const componentPaths = Object.keys(components);
// console.log('pages', pages);
// console.log('components', components);
// 2. 【核心修复】动态生成路由，强制 path 以 / 开头
const routers = Object.entries(pages).map(([path, meta]: [string, any]) => {
  // console.log('path', path);
  // replace 是替换字符串，将 path 中的 /page.ts 替换为 空字符串
  const dirPath = path.replace('/page.ts', '');
  // console.log('dirPath', dirPath);
  // console.log('componentPaths', componentPaths);
  const compaths: any = componentPaths.find(key => key.startsWith(dirPath) && key.endsWith('.vue'));
  // console.log('compaths123', compaths);

  // const compath = path.replace('page.ts', 'index.vue');
  // console.log('compath', compath);
  let routePath = path.replace('../views/', '').replace('/page.ts', '');
  routePath = routePath ? `/${routePath}` : '/'; // 强制以 / 开头

  const name = routePath.split('/').filter(Boolean).join('-') || 'index';
  return {
    path: routePath,
    name,
    component: () => components[compaths]?.(),
    meta: meta.meta || meta
  }
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...routers,
    {
      path: '/',
      redirect: '/home',
    },
    // 【新增】404 兜底路由（匹配所有未定义路径）
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ],
})

// 工具函数：检查结算页面权限
const canAccessJiesuan = () => {
  return sessionStorage.getItem('canAccessJiesuan') === 'true';
}

// 路由守卫（修复异步逻辑 + 权限校验）
router.beforeEach(async (to, from, next) => {
  // 提前获取 Pinia 实例（避免重复调用）
  const loginStore = useLoginStore();
  if (to.name === 'jiesuan' && !canAccessJiesuan()) {
    return next('/cart');
  }
  // 1. 已登录用户访问登录页，直接跳首页
  if (to.name === 'login' && loginStore.islogin) {
    return next('/home');
  }

  // 2. 需要登录的页面，未登录则跳登录
  if (to.meta.requireAuth && !loginStore.islogin) {
    return next('/login');
  }

  // 3. 【修复】addgoods 页面：先校验角色 → 再校验 Token（同步+异步顺序）
  if (to.name === 'addgoods' && to.meta.tokenRequired && loginStore.islogin) {
    // 第一步：校验角色权限（同步）
    const hasAdminRole = localStorage.getItem('userInfo')?.includes('admin');
    if (!hasAdminRole) {
      message.error('您没有权限添加商品');
      return next('/home');
    }
    // 第二步：异步校验 Token（await 等待结果）
    try {
      await verifyToken(loginStore.userInfo.userInfo.userId);
      return next();
    } catch (error) {
      message.error('登录已失效，请重新登录');
      loginStore.logout();
      return next('/login');
    }
  }

  // 默认放行
  next();
})

// 【修复】异步 Token 验证（返回 Promise，支持 await）
function verifyToken(userId: number) {
  return axios.post('http://localhost:3000/tokenverify', { userId })
    .then((res) => {
      if (res.data.code !== 200) throw new Error('token无效');
    })
}

export default router