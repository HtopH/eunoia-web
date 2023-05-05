<script setup lang="ts">
  import {ref,onMounted } from 'vue'
  import {useStore} from 'vuex';
  import Web3 from "web3";
  //生命周期函数请求数据列表
  onMounted(async()=>{
      if (typeof window.ethereum !== "undefined") {
        console.log("安装了小狐狸");
      } else {
        console.log("没安装小狐狸");
      }
  })
  const web3=ref<any>()
  const store=useStore()
  const connectWallet=()=>{
    window.ethereum.request({ method: 'eth_requestAccounts' }).then((res: any) => {
      console.log(res, '这就是小狐狸地址')
      //保存地址
      store.commit('setToken',res[0])
      web3.value=new Web3(window.ethereum)
      let block=web3.value.eth.getBlockNumber()
      console.log(block)
    }).catch((err: any) => {
      console.log(err)
      if (err.code == 4001) {
        console.log('用户拒绝连接')
      }
    })
          
  }
</script>

<template>
  <el-page-header :icon="null">
    <template #content>
        <div class="flex items-center">
          <span class="text-large font-600 mr-3"><router-link to="/">首页</router-link></span> |
          <span class="text-large font-600 mr-3"><router-link to="/user">作品管理</router-link></span>
        </div>
    </template>
    <template #extra>
        <div class="flex items-center">
            <el-button type="primary" class="ml-2" @click="connectWallet">{{$store.getters.getToken}}</el-button>
        </div>
    </template>
  </el-page-header> 
<router-view></router-view>
</template>

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
</style>
