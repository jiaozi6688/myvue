<template>
  <RouterView />
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
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
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}
</style>
<style scoped></style>
