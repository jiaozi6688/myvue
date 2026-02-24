<template>
  <el-container class="container">
    <!-- 头部占位元素 -->
    <div v-if="isScroll" class="header-placeholder"></div>
    <!--============================= 头部 ========================================-->
    <el-header :class="['header', isScroll ? 'header headerfixed' : '']">
      <!-- 商城标题，图标，导航菜单，用户登录注册，购物车 都放在一行-->
      <!-- 商城标题，图标 -->
      <div>
        <img src="/1bde467bd1f2ad1227592b995a2c364d.jpg" alt="logo">
        <h1>商城名称</h1>
      </div>
      <!-- 导航菜单 -->
      <div id="daohang" :class="zk ? 'daohang' : 'daohang1'">
        <span v-if="zk" @click="showdh = !showdh">
          <el-icon>
            <Menu />
          </el-icon>
        </span>
        <div v-show="showdh">
          <p>首页</p>
          <p>商品分类</p>
          <p>商品列表</p>
          <p>购物车</p>
          <p>用户中心</p>
        </div>
      </div>
      <!-- 用户头像 名称 -->
      <div>
        <!-- 用户头像 当鼠标进去头像的时候 放大并显示用户信息弹窗 鼠标离开弹窗信息之后返回原始大小 -->
        <!-- 'imghover': showUserInfo  是一个类名 当showUserInfo为true时 才会添加这个类名 -->
        <div @mouseenter="showUserInfo = true" @mouseleave="showUserInfo = false">
          <div>
            <img :class="{ 'imghover': showUserInfo }" v-if="loginStore.islogin"
              src="/1bde467bd1f2ad1227592b995a2c364d.jpg" alt="">
            <a v-if="!loginStore.islogin" href="/login">点击登录</a>
          </div>
          <!-- 用户弹窗 -->
          <!--  -->
          <div class="user-info" v-if="showUserInfo && isLogin">
            <!-- 鼠标样式 -->
            <p class="user-info-header" style="cursor: pointer;">
              <el-icon>
                <User />
              </el-icon>
              {{ loginStore.userInfo?.username || '用户名称' }}
            </p>
            <p style="cursor: pointer;">
              <el-icon>
                <Message />
              </el-icon>
              {{ loginStore.userInfo?.email || '用户邮箱' }}
            </p>
            <RouterLink to="/addgoods" v-if="role === 'admin'">
              <el-icon>
                <UserFilled />
              </el-icon>
              上架商品
            </RouterLink>
            <RouterLink to="/mycenter">
              <el-icon>
                <UserFilled />
              </el-icon>
              个人中心
            </RouterLink>
            <RouterLink to="/login" @click="loginStore.logout">
              <el-icon>
                <SwitchButton />
              </el-icon>
              退出登录
            </RouterLink>
            <RouterLink to="/tuodongdiv">
              <el-icon>
                <SwitchButton />
              </el-icon>
              拖动
            </RouterLink>
          </div>
        </div>
      </div>
      <!-- 购物车 -->
      <div>
        <div>
          <RouterLink to="/cart" target="_blank">
            <span> <el-icon><shopping-cart /></el-icon></span>
            <p>
              购物车({{ cartStore.cartlist.length }})
            </p>
          </RouterLink>
        </div>
      </div>
    </el-header>
    <!-- ================主体================ -->
    <el-main class="main">
      <!-- 第一个div是合并的，占满整行 -->
      <div>
        <img src="/1bde467bd1f2ad1227592b995a2c364d.jpg" alt="">
      </div>
      <!-- 商品分类 -->
      <div v-for="item in goodslist" :key="item._id" @click="handleClick(item._id)">
        <img :src="`http://localhost:3000${item.image}`" alt="">
        <p class="title">{{ item.name }}</p>
        <p class="desc">{{ item.description }}</p>
        <p class="price">¥{{ item.price }}</p>
      </div>

    </el-main>
    <!-- ================底部================ -->
    <el-footer class="footer">
      <p>copyright @ 2023</p>
      <p>联系我们：1234567890</p>
      <p>地址：中国 北京</p>
      <p>邮箱：123@qq.com</p>
      <p>客服微信：1234567890</p>
      <p>客服 QQ：1234567890</p>
      <p>客服电话：1234567890</p>

    </el-footer>
  </el-container>

</template>

<script setup lang="ts">
import { useLoginStore } from '@/pinia/loginstor';
import { useCartStore } from '@/pinia/Cartstor';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { User, Menu, UserFilled, Message, SwitchButton, ShoppingCart } from '@element-plus/icons-vue';
import axios from 'axios';
import router from '@/router';
import { el } from 'element-plus/es/locales.mjs';
// 初始化登录状态
const loginStore = useLoginStore();
const role = loginStore.userInfo?.userInfo?.role;
// http://127.0.0.1:3000/images/image-1767081632414-984166025.jpg
console.log('用户角色', role);
loginStore.initLoginState();

// 获取购物车数据
const cartStore = useCartStore();
// 判断是否有登录用户
const isLogin = computed(() => loginStore.islogin);
if (isLogin.value) {
  console.log('用户已登录');
} else {
  console.log('用户未登录');
}
console.log('是否登录', isLogin.value);
// 存放所有商品列表
const goodslist = ref<any>([]);
// 用户弹窗
const showUserInfo = ref(false);
const isScroll = ref(false);
const scrollProgress = ref(0);
let lastScrollTime = 0;
// 添加变量声明
let lastScrollY = 0;
// 添加节流控制变量
let lastResizeTime = 0;
const zk = ref(false);
// 导航栏是否折叠
const showdh = ref(true);
// 定义 resize 事件处理函数
const handleResize = () => {
  const now = Date.now();
  // 使用节流控制，每 100ms 执行一次
  if (now - lastResizeTime < 100) return;
  const width = window.innerWidth < 768;
  if (width) {
    // 添加类名
    zk.value = true;
    showdh.value = false;
  }
  else {
    zk.value = false;
    showdh.value = true;
  }
  lastResizeTime = now;
};

// 添加 resize 事件监听器 passive: true 避免事件冒泡
window.addEventListener('resize', handleResize, { passive: true });







// 使用节流函数处理滚动事件，实现更流畅的效果
// 优化后的滚动处理函数
const handleScroll = () => {
  const now = Date.now();
  // 使用节流控制，每16ms执行一次（约60fps）
  if (now - lastScrollTime < 16) return;
  // 获取当前滚动位置 - 使用兼容性更好的方法
  const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  // 只有当滚动位置发生变化时才更新
  if (scrollY !== lastScrollY) {
    // 当滚动大于5px时，添加headerfixed类
    isScroll.value = scrollY > 5;
    // 计算滚动进度（0到1之间），用于动态效果
    scrollProgress.value = Math.min(scrollY / 100, 1);
    lastScrollTime = now;
    lastScrollY = scrollY;
  }
}


// 数据加载状态标记
const dataLoaded = ref(false);
// 商品分类点击事件处理函数
function getGoodsList() {
  // 检查是否已加载数据
  if (dataLoaded.value) return;
  // 挂载前拿到整个商品列表
  axios.get('http://127.0.0.1:3000/getgoodslist/').then((res) => {
    if (res.data.code === 200) {
      console.log('商品列表', res.data.data);
      goodslist.value = res.data.data;
      // 加载完成后设置标记为true
      dataLoaded.value = true;
    }
  }).catch((err) => {
    console.log('获取商品列表失败', err);
  });
}


// 点击商品分类，跳转到商品详情页
const handleClick = (id: string) => {
  console.log('点击了商品', id);
  // 跳转到商品详情页
  // resolve方法返回一个包含href属性的对象
  const routeData = router.resolve({
    path: '/goodsdetail',
    query: {
      id: id
    }
  });
  // 打开新窗口
  window.open(routeData.href, '_blank');
}
// const handleClick = (id: string) => {
//   console.log('点击了商品', id);
//   const routeData = router.resolve({
//     path: '/goodsdetail',
//     query: {
//       id: id
//     }
//   });
//   window.open(routeData.href, '_blank');
// }

// 监听滚动事件  挂载时添加事件监听
onMounted(() => {
  getGoodsList();
  window.addEventListener('scroll', handleScroll, { passive: true });
  // 手动执行一次 resize 处理逻辑，初始化导航菜单状态
  handleResize();
});
// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
});
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;

}

/* Element Plus 样式变量覆盖 */
:root {
  /* 基础字体大小 */
  --el-font-size-base: 16px;
  /* 组件尺寸 */
  --el-component-size: 20px;
  /* 图标大小 */
  --el-icon-size: 20px;
}

.container {
  width: 100%;
  height: auto;
}

/* header占位元素，保持布局稳定 */
.header-placeholder {
  width: 100%;
  height: 70px;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

/* 头部 */
.header {
  /* 鼠标样式*/
  cursor: default;
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  background-color: rgba(223, 224, 224, 0.144);
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  position: static;
  /* 硬件加速 */
  will-change: transform, background-color, box-shadow;
  /* 启用硬件加速 */
  transform: translateZ(0);

  /* 启用GPU加速 */
  &.headerfixed {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    padding: 10px 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    background-color: rgba(240, 248, 255, 0.95);
    /* 半透明背景 */
  }

  /*  */
  img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    transition: all 0.5s;
    border: 1px solid #ccc;
  }

  /* 导航菜单，用户头像 名称，购物车 都放在一行*/
  >div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  /* 商城标题，图标 */
  >div:nth-child(1) {
    flex: 0.7;
    gap: 15px;

    h1 {
      font-size: 2.3rem;
    }

    img {
      margin-left: 20px;
    }
  }

  .daohang {
    position: relative;
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    div {
      width: 100%;
      position: absolute;
      top: 45px;
      background-color: #9ea3a8;
    }
  }

  /* 导航菜单 */
  .daohang1 {
    flex: 2;

    div {
      display: flex;
      flex-direction: row;

      p {
        font-size: 1.1rem;
        margin: 0 .3rem;
      }
    }
  }



  /* 用户头像 名称 */
  >div:nth-child(3) {

    /* flex: 0.33; */
    /* 头像div和用户弹窗div 都放在一行 */
    div {

      /* 头像div */
      div:nth-child(1) {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;

        /* 鼠标移入头像放大 */
        .imghover {
          /* 绝对定位，头像div和用户弹窗div 都放在一行 */
          position: absolute;
          z-index: 2;
          /* 鼠标移入头像放大时，头像在最上面 */
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
          transform: scale(2.2) translateY(15px) translateX(-10px);
        }

        a {
          display: inline-block;
          width: 80px;
          line-height: 40px;
          font-size: 0.9rem;
        }
      }

      /* 用户弹窗div  */
      .user-info {
        --size: 10px;
        /* 用户弹窗,脱离文档 */
        font-size: 10px;
        position: absolute;
        top: calc(100% + calc(var(--size)*1.5));
        right: calc(15% - 75px);
        display: flex;
        flex-direction: column;
        gap: 15px 0;
        width: 150px;
        height: auto;

        /* 只让背景色模糊，文字不模糊 */
        backdrop-filter: blur(5px);
        background-color: rgba(228, 241, 247, 0.705);
        border: 1px solid #56e9b105;
        border-radius: 15px;
        padding: 25px 30px 0px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        animation: user-info-show 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        /* 弹窗从右上角出现 */
        transform-origin: top right;
        /* 设置动画原点 */
        transition: all 0.2s;
        /* 增加鼠标悬停效果的过渡 */

        /* 鼠标悬停效果 */
        &:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          transform: scale(1.02);
        }

        p,
        a {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0 10px;
          font-size: 1.1rem;
          padding: 3px 0;

          color: black;

          svg {
            font-size: 20px;
          }
        }

        a:last-child {
          margin-bottom: 15px;
        }

        p:hover {
          color: #007bff;
        }

        a:hover {
          color: #007bff;
        }


      }
    }
  }

  /* 购物车 */
  >div:nth-child(4) {
    flex: 0.45;
    /* 购物车文字居中 */
    justify-content: flex-start;

    div {
      a {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: default;
      }

      span {
        font-size: 20px;
        padding: 10px;
        margin-left: 20px;
      }

      p {
        font-size: 1rem;
      }

      &:hover {
        color: #e06142;
      }

      &:hover a {
        color: #e06142;
      }
    }
  }

}

/* 主体 */
.main {
  width: 90%;
  min-height: 86vh;
  height: auto;
  margin: 0 auto;
  padding-top: 10px;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  grid-gap: 20px;

  >div {
    min-height: 290px;
    margin-bottom: 10px;
    overflow: hidden;
  }



  >div:first-child {
    /* 第一个商品，占2列2行 */
    grid-column: span 2;
    grid-row: span 2;
    height: 610px;
    overflow: hidden;
    border-radius: 15px;

    img {
      width: 100%;
      height: calc(155 * 2)px;
      /* 图片等比例缩放 */
      object-fit: none;

    }
  }

  >div:not(:first-child):hover {
    transform: scale(1.01);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  }

  div:not(:first-child) {
    display: flex;
    flex-direction: column;
    border: 0.2px solid #0e0d0d2f;
    border-radius: 15px;

    img {
      width: 100%;
      height: 150px;
      /* 图片等比例缩放 */
      object-fit: contain;
      border-radius: 15px;
    }

    p {
      flex: 1;
      margin: 5px 10px;
    }

    /* margin 和padding 都算在宽度内css? box-sizing: border-box; */
    .title {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .desc {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: .8;
      font-size: 1rem;
    }

    .price {
      text-align: right;
      font-size: 1.2rem;
      font-weight: bold;
      margin-right: 15px;
      color: #e06142;
    }
  }
}

/* 底部 */
.footer {
  height: 3vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: rgba(228, 224, 224, 0.308);


  p {
    margin: 0 10px;
    font-size: 1rem;
  }
}



/* 响应式断点设计 */
@media (max-width: 1200px) {
  .header {
    height: auto;

    >div:nth-child(1) {
      h1 {
        font-size: 1.6rem;
      }
    }

    >div:nth-child(2) {
      gap: 12px;
    }

    >div:nth-child(4) {
      div {
        p {
          font-size: 1rem;
        }
      }
    }
  }

  .main {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));

    >div:not(:first-child) {
      .title {
        margin-top: 5px;
        font-size: 1.2rem;
      }

      .desc {
        font-size: 0.8rem;
        margin-top: 20px;
        margin-bottom: 10px;
        color: #9c9b9b;
      }

      .price {
        font-size: 1.2rem;
      }
    }
  }
}

@media (max-width: 940px) {
  .header {
    /* 响应式布局，
    当屏幕宽度小于等于999px时，header 中的div 垂直排列 */
    flex-wrap: wrap;
    height: auto;
    min-height: 70px;
    padding: 10px 16px;

    >div:nth-child(1) {
      /* order 控制元素在flex容器中的排列顺序 */
      order: 1;

      h1 {
        font-size: 1.rem;
      }
    }

    >div:nth-child(2) {
      order: 2;
      justify-content: center;
      margin-top: 10px;
    }

    /* 登录注册按钮 */
    >div:nth-child(3) {
      /* order是什么意思 ？  控制元素在flex容器中的排列顺序 */
      order: 3;
      margin-left: auto;
    }

    /*  */
    >div:nth-child(4) {
      order: 4;
      background-color: #e06142;

      div {
        span {
          font-size: 20px;
        }

        p {
          font-size: 0.6rem;
        }
      }
    }

    &.headerfixed {
      height: auto;
      min-height: 70px;
    }

  }

  .header-placeholder {
    height: 100px;
  }

  .main {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;

    >div:not(:first-child) {
      .title {
        margin-top: 5px;
        font-size: 1.2rem;
      }

      .desc {
        font-size: 0.8rem;
        margin-top: 20px;
        margin-bottom: 10px;
        color: #9c9b9b;
      }

      .price {
        font-size: 1.2rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .header {
    >div:nth-child(1) {
      h1 {
        font-size: 1rem;
      }

      img {
        width: 2rem;
        height: 2rem;
      }
    }

    >div:nth-child(2) {
      gap: 8px;
    }


    >div:nth-child(3) {
      div div:nth-child(1) {
        width: 2rem;
        height: 2rem;

        a {
          width: 70px;
          font-size: 0.8rem;
        }
      }
    }

    >div:nth-child(4) {
      div p {
        font-size: 0.8rem;
      }
    }
  }

  .main {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    padding: 20px 12px;
    gap: 12px;

    >div:nth-child(1) {
      height: 250px;
    }

    >div:not(:first-child) {
      .title {
        margin-top: 5px;
        font-size: 1.2rem;
      }

      .desc {
        font-size: 0.8rem;
        margin-top: 20px;
        margin-bottom: 10px;
        color: #9c9b9b;
      }

      .price {
        font-size: 1.2rem;
      }
    }
  }

  .footer {

    padding: 16px 12px;

    p {
      font-size: 10px;
      padding: 5px 10px;
    }
  }
}

/* 动画 */
@keyframes user-info-show {
  0% {
    /* 弹窗从右上角出现 */
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }

  100% {
    /* 弹窗完全出现 */
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>