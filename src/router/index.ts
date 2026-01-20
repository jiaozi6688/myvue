import login from '@/views/login.vue'
import { createRouter,createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //  登录
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        title: '登录',
        requireAuth: false, //未登录的用户才能访问
      },
    },
    //  注册
    {
      path: '/register',
      name: 'register',
      meta: {
        title: '注册',
        requireAuth: false,//未登录的用户才能访问
      },
      component: () => import('@/views/register.vue'),
    },
    //  首页
    {
      path: '/home',
      name: 'home',
      meta: {
        title: '首页',
        requireAuth: false, //requireAuth是是否需要登录才能访问
      },
      component: () => import('@/views/home.vue'),
    },
    //  购物车
    {
      path: '/cart',
      name: 'cart',
      meta: {
        title: '购物车',
        requireAuth: false, //未登录的用户不可以访问
      },
      component: () => import('@/views/cart.vue'),
    },
    //  结算页面
    {
      path: '/jiesuan',
      name: 'jiesuan',
      meta: {
        title: '结算',
        requireAuth: true, //未登录的用户也可以访问
      },
      component: () => import('@/views/jiesuan.vue'),
    },
    //  添加新地址
    {
      path: '/newaddress',
      name: 'newaddress',
      meta: {
        title: '添加新地址',
        requireAuth: true, //需要登录才能访问
      },
      component: () => import('@/views/newaddress.vue'),
    },
    //  个人中心
    {
      path: '/mycenter',
      name: 'mycenter',
      meta: {
        title: '个人中心',
        requireAuth: true, //未登录的用户也可以访问
      },
      component: () => import('@/views/mycenter.vue'),
    },
    //  商家添加商品
    {
      path: '/addgoods',
      name: 'addgoods',
      meta: {
        title: '添加商品',
        requireAuth: true, //需要登录才能访问
        //  角色权限判断
        roles: ['admin'], //只有admin角色才能访问
      },
      component: () => import('@/views/addgoods.vue'),
    },
    //  404路由
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      meta: {
        title: '404',
        requireAuth: false, //未登录的用户也可以访问
      },
      component: () => import('@/views/404.vue'),
    },
    // 商品详细页面
    {
      path: '/goodsdetail',
      name: 'goodsdetail',
      meta: {
        title: '商品详细',
        requireAuth: false, //未登录的用户也可以访问
      },
      component: () => import('@/views/goodsdetail.vue'),
    },
    // 在线客服页面
    {
      path: '/chat',
      name: 'chat',
      meta: {
        title: '在线客服',
        requireAuth: false, //未登录的用户也可以访问
      },
      component: () => import('@/views/chat.vue'),
    },
    // tuodong
    {
      path: '/tuodongdiv',
      name: 'tuodongdiv',
      meta: {
        title: '拖动',
        requireAuth: false, //未登录的用户也可以访问
      },
      component: () => import('@/views/tuodongdiv.vue'),
    },
    //  默认跳转路由
    {
      //  默认跳转路由
      path: '/',
      redirect: '/home',
    },

  ],
})
// 检查是否允许访问结算页面的函数
const canAccessJiesuan = () => {
  // 从sessionStorage获取结算访问权限
  const canAccess = sessionStorage.getItem('canAccessJiesuan');
  return canAccess === 'true';
}

router.beforeEach((to, from, next) => {
  // 每次路由跳转时都重新获取token，确保拿到最新的登录状态
  const token = localStorage.getItem('token');
  // 如果需要登录才能访问
  if (to.meta.requireAuth) { //从to.meta.requireAuth获取是否需要登录才能访问
    // 如果token不存在则跳转到登录页面
    if (!token) {
      // 跳转到登录页面
      next('/login');
      return;
    }
  }

  // 结算页面特殊权限检查
  // if (to.name === 'jiesuan') {
  //     // 检查是否有权限访问结算页面
  //     if (!canAccessJiesuan()) {
  //         // 没有权限，跳转到购物车页面并提示
  //         console.log('请从购物车页面点击结算按钮进入');
  //         next('/cart');
  //         return;
  //     }
  // }

  // 角色权限判断
  if (to.name === 'addgoods') { //从to.meta.roles获取角色权限
    // 从localStorage.getItem('userInfo')获取用户角色 includes('admin')判断用户角色是否包含admin
    const adminRole = localStorage.getItem('userInfo')?.includes('admin');
    console.log(adminRole);

    if (!adminRole) {
      // 跳转到首页
      // 提示用户没有权限
      console.log('您没有权限添加商品');
      next('/home');
      return;
    }
  }
  next();
})

export default router


