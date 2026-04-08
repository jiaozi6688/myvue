// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // 关键配置：设置为相对路径，适配 file:// 协议访问
  base: './', 
  plugins: [
    vue(),
  ],
  resolve: {
    // 可选：配置路径别名（如果你的项目用了 @ 别名，需要加这个）
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // 可选：确保打包后的资源输出路径清晰
  build: {
    outDir: 'dist', // 打包输出目录（默认就是dist，可省略）
    assetsDir: 'assets', // 静态资源目录
    rollupOptions: {
      // 确保打包后的资源路径正确
      output: {
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
      },
    },
  },
})