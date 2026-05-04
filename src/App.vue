<template>
  <RouterView v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </RouterView>
  <ChatAI v-if="!isAuthPage"></ChatAI>
</template>
<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import ChatAI from '@/views/ChatAI/ai.vue'
import { computed } from 'vue'

const route = useRoute()

// 计算当前是否为认证页面（登录或注册）
const isAuthPage = computed(() => {
  const authRoutes = ['/login', '/register']
  return authRoutes.includes(route.path)
})
</script>
<style>
* {
  margin: 0px;
  padding: 0px;
}

a {
  color: #000;
  text-decoration: none;
}

/* 全局背景色设置 */
html {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  min-height: 100vh;
}

body {
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}
</style>
<style scoped>
/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
