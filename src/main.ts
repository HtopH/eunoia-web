import { createApp } from 'vue'
// import './style.css'
import "./assets/css/reset.css"
import App from './App.vue'
import router from "./router/index"
import store from './store/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router).use(store).mount('#app')
