<template>
  <div class="header">
    <div class="navigation">
      <router-link to="/dist">首页</router-link>
      <router-link to="/user">作品管理</router-link>
      <router-link to="/node">节点信息</router-link>
      <router-link to="/admin">后台</router-link>
      <!-- <router-link to="/product">商品</router-link> -->
    </div>
    <div class="wallet">
      <el-tooltip :content="store.getters.getToken" placement="top">
        <el-button type="text"  class="truncate-text" icon="el-icon-wallet" @click="connectWallet">{{walletAddress}}</el-button>  
      </el-tooltip>
    </div>
  </div>
  <router-view></router-view>
</template>

<script setup lang="ts">

  import {ref,onMounted } from 'vue'
  import {useStore} from 'vuex';
  import { UpdateToken,getUserInfo } from './http'
  //生命周期函数请求数据列表
  onMounted(async()=>{
      
  })
  const store=useStore()
  const connectWallet=()=>{
    console.log("点击连接钱包")
    window.ethereum.request({ method: 'eth_requestAccounts'}).then((res: any) => {
      //保存地址
      store.commit('setToken',res[0])
      UpdateToken()
      getUserInfo().then(res=>{
          console.log(res)
      }).catch(err=>{
        console.log(err)
      })
      walletAddress.value=store.state.token.substring(0,8)+'...'
    }).catch((err: any) => {
      console.log(err)
      if (err.code == 4001) {
        console.log('用户拒绝连接')
      }
    })      
  }
  const walletAddress=ref('连接钱包')
 
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f0f0f0;
}
.navigation {
  display: flex;
  gap: 20px;
}
.navigation a {
  font-size: 18px;
  color: #333;
  text-decoration: none;
}
.navigation a.active {
  color: #1890ff;
  font-weight: bold;
}
.wallet {
  display: flex;
  align-items: center;
}
.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px; /* set the maximum width of the button */
}
</style>
