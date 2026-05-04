// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({

  // esbuild: {
  //   drop: ['console'],
  // },
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
  server: {
    // 把报错里的域名直接填在这里
    allowedHosts: ["multicuspidate-nena-filosus.ngrok-free.dev"]
  },
  // 关键配置：配置代理，将API请求转发到后端服务器
  // proxy: {
  //   // 代理配置，将API请求转发到后端服务器
  //   // 把所有请求都转发到后端服务器
  //   '/': {
  //     // 目标后端服务器地址
  //     // 这里假设后端服务器在 http://localhost:3000 上运行
  //     target: 'http://localhost:3000',
  //     changeOrigin: true,
  //   }
  // },
  // 可选：确保打包后的资源输出路径清晰
  build: {
    outDir: 'dist', // 打包输出目录（默认就是dist，可省略）
    assetsDir: 'assets', // 静态资源目录
    // rollup 配置，确保资源路径正确输出
    rollupOptions: {
      // output 配置，确保资源路径正确输出
      output: {
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
        manualChunks(id: string) {
          // 包含module的模块，都放到axios模块中
          if (id.includes('module')) {
            return 'moduleqqq'
          }
        },
      },
    },
    // esbuild 配置，确保资源路径正确输出
    // esbuild 配置已移除，Vite 5+ 中不再支持在 build 中直接配置 esbuild
    // 如需移除 console，请使用 rollup 插件或其他方式
  },
})