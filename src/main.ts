import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { useLoginStore } from './pinia/loginstor'
import { setupCart } from './pinia/Cartstor'
const app = createApp(App);
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(ElementPlus)
app.use(router)

// 初始化登录状态
const loginStore = useLoginStore()
loginStore.initLoginState()

// 初始化购物车
setupCart()

app.mount('#app')
