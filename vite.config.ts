import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    host: '0.0.0.0',
    port: 3000, // 设置服务启动端口号
    open: false, // 设置服务启动时是否自动打开浏览器
    https: false,
    cors: true // 允许跨域
  }
})
