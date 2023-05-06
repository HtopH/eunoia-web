import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  base:'./',
  server:{
    open:true,//自动打开浏览器
    host:"127.0.0.1",//站点ip
    port:8081,//站点端口
    proxy:{
      '/baseUrl':{
        target:"http://127.0.0.1:10223",
        changeOrigin:true,
        rewrite(path){
          return path.replace(/^\/baseUrl/,'')
        }
      }
    }
  },
  
  css:{
    preprocessorOptions:{
      scss:{
        additionalData:`@import "./src/styles/common.scss";`
      }
    }
  }
})
