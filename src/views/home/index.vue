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
        <ul v-show="showdh">
          <li>首页</li>
          <li>商品分类</li>
          <li>商品列表</li>
          <li>购物车</li>
          <li>用户中心</li>
        </ul>
      </div>

      <!-- 搜索框  -->
      <div>
        <el-input v-model="searchText" @keyup.enter="handleSearch(searchText)" placeholder="请输入搜索内容">
          {{ searchText }}
        </el-input>
      </div>

      <!-- 用户头像 名称 -->
      <div>
        <!-- 用户头像 当鼠标进去头像的时候 放大并显示用户信息弹窗 鼠标离开弹窗信息之后返回原始大小 -->
        <!-- 'imghover': showUserInfo  是一个类名 当showUserInfo为true时 才会添加这个类名 -->
        <div @mouseenter="showUserInfo = true" @mouseleave="showUserInfo = false">
          <div>
            <img :class="[showUserInfo ? 'imghover' : '']" v-if="loginStore.islogin"
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
import searchGoods from '@/api/search';
import message from '@/components/modal/message';
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
// 搜索框
const searchText = ref('');
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
async function getGoodsList() {
  // 检查是否已加载数据
  if (dataLoaded.value) return;
  // 挂载前拿到整个商品列表
  await axios.get('http://127.0.0.1:3000/getgoodslist/').then((res) => {
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

// 搜索商品
function handleSearch(value: string) {
  if (!value) {
    message.error('请输入搜索内容');
    return;
  }
  searchGoods(value).then((res) => {
    console.log('搜索商品成功', res.data.data);
    goodslist.value = res.data.data;
  }).catch((err) => {
    console.log('搜索商品失败', err);
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
<style lang="scss" scoped>
/* 全局修复：消除页面横向滚动条 */
html,
body {
  margin: 0 !important;
  padding: 0 !important;
  /* 禁止横向滚动 */
  overflow-x: hidden !important;
  width: 100% !important;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Element Plus 样式变量覆盖 */
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
  cursor: default;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(223, 224, 224, 0.144);
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  position: static;
  will-change: transform, background-color, box-shadow;
  transform: translateZ(0);


  &.headerfixed {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    padding: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    background-color: rgba(240, 248, 255, 0.95);
  }

  img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    transition: all 0.5s;
    border: 1px solid #ccc;
    // 防止图片溢出
    object-fit: cover;
  }

  >div {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 10px;
    gap: 10px;
  }

  /* 导航栏 */
  >div:nth-child(1) {
    flex: 1;

    h1 {
      font-size: 1.2rem;
    }
  }

  >div:nth-child(2) {
    flex: 3;

    ul {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      list-style: none;
    }
  }

  // 搜索框
  >div:nth-child(3) {
    width: 260px;
    color: black;
    transition: all 0.3s ease;

    &:focus-within {
      width: 300px;
    }

    &:focus-within ::placeholder {
      opacity: 0;
      transition: all 0.3s ease;
    }
  }

  // 商城头像
  >div:nth-child(4) {
    /* 关键：父级设为相对定位，作为绝对定位弹窗的基准 */
    position: relative;
    flex: 0;
    z-index: 9999 !important;
    /* 父级最高层级 */

    .imghover {
      position: relative;
      z-index: 99999 !important;
      /* 头像放大顶级层级 */
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
      /* 优化放大中心点，更美观 */
      transform-origin: center;
      transform: scale(2.2) translateY(15px) translateX(-10px);
      /* 禁止被任何元素裁剪 */
      clip-path: none !important;
    }

    a,
    p {
      display: inline-block;
      width: 80px;
      line-height: 40px;
      font-size: 0.9rem;
    }

    .user-info {
      --size: 10px;
      font-size: 0.8rem;
      /* 绝对定位，脱离文档流 */
      position: absolute;
      top: calc(89% + calc(var(--size)*2));
      right: -70px;
      /* 弹窗顶级层级，不被任何元素遮挡 */
      z-index: -1 !important;
      display: flex;
      flex-direction: column;
      width: 260px;
      height: auto;
      backdrop-filter: blur(5px);
      background-color: rgba(228, 241, 247, 0.705);
      border-radius: 15px;
      padding: 15px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      animation: user-info-show 0.3s cubic-bezier(0.23, 1, 0.32, 1);
      transform-origin: top right;
      transition: all 0.2s;

      &:hover {
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        transform: scale(1.02);
      }
    }
  }

  >div:nth-child(5) {
    font-size: 1rem;
    flex: 0.3;
    text-align: center;

    span {
      font-size: 20px;
    }
  }
}

/* 主体 */
.main {
  width: 90%;
  padding: 10px;
  min-height: 86vh;
  margin: 0 auto;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  display: grid;
  // 自适应网格：最小260px，自动填充
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  grid-gap: 20px;

  >div {
    min-height: 290px;
    margin-bottom: 10px;
    overflow: hidden;
    border-radius: 15px;
    transition: all 0.3s;
  }

  // 第一个商品（轮播/大图）
  >div:first-child {
    grid-column: span 2;
    grid-row: span 2;
    height: 610px;

    img {
      width: 100%;
      height: 100%;
      // 修复原代码错误的图片高度写法，自适应填充
      object-fit: cover;
    }
  }

  >div:not(:first-child):hover {
    transform: scale(1.01);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
  }

  div:not(:first-child) {
    display: flex;
    flex-direction: column;
    border: 0.2px solid #0e0d0d2f;

    img {
      width: 100%;
      height: 150px;
      object-fit: contain;
      border-radius: 15px;
    }

    p {
      flex: 1;
      margin: 5px 10px;
    }

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
  height: auto;
  min-height: 3vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  background-color: rgba(228, 224, 224, 0.308);
  padding: 15px 10px;
  gap: 10px;

  p {
    margin: 0 5px;
    font-size: 1rem;
    white-space: nowrap;
  }
}

/* 动画 */
@keyframes user-info-show {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }

  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* ====================== 响应式媒体查询 ====================== */
// 1. 平板设备 (768px - 1024px)
@media (max-width: 1024px) and (min-width: 768px) {
  .header {
    height: 65px;
  }

  .header>div:nth-child(3) {
    width: 200px;
  }

  .main>div:first-child {
    height: 500px;
  }
}

// 2. 移动端/手机 (小于768px，核心适配)
@media (max-width: 768px) {

  // 全局字体缩小
  html {
    font-size: 14px;
  }

  // 头部占位符高度适配
  .header-placeholder {
    height: 60px;
  }

  // 头部核心适配
  .header {
    height: 60px;
    padding: 0 5px;
    // 小屏幕允许头部换行
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .headerfixed {
    padding: 5px !important;
  }

  // 隐藏商城标题，节省空间
  .header>div:nth-child(1) h1 {
    display: none;
  }

  // 导航栏适配：缩小间距
  .header>div:nth-child(2) ul {
    gap: 5px;

    li {
      font-size: 0.85rem;
    }
  }

  // 搜索框适配：宽度大幅缩小
  .header>div:nth-child(3) {
    width: 180px;

    &:focus-within {
      width: 160px;
    }
  }

  .header>div:nth-child(4) {
    .imghover {
      transform: scale(1.5) translateY(15px) translateX(-10px);
    }

    .user-info {
      --size: 10px;
      width: 200px;
      font-size: 0.8rem;
      /* 绝对定位，脱离文档流 */
      position: absolute;
      top: calc(95% + calc(var(--size)*2));
      right: -40px;
      border-radius: 0 15px 15px 15px;
      transition: all 0.2s;

      &:hover {
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      }
    }
  }



  // 购物车文字隐藏，只留图标
  .header>div:nth-child(5){
    p {
      display: none;
    }
    span {
      font-size: 20px;
    }
  }

  // 主体商品适配
  .main {
    width: 95%;
    grid-template-columns: 1fr !important; // 移动端单列展示
    grid-gap: 15px;
  }

  // 取消第一个商品跨列跨行，移动端普通卡片展示
  .main>div:first-child {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
    height: 200px;
  }

  // 商品卡片图片高度适配
  .main div:not(:first-child) img {
    height: 120px;
  }

  // 底部适配：垂直排列，字体缩小
  .footer {
    flex-direction: column;
    text-align: center;

    p {
      font-size: 0.85rem;
    }
  }
}

// 3. 超小屏幕 (小于375px，如迷你手机)
@media (max-width: 375px) {
  .header>div:nth-child(2) {
    display: none; // 隐藏导航栏，完全依赖汉堡菜单
  }

  .header>div:nth-child(3) {
    width: 100px;
  }

}
</style>