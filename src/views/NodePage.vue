<template>
    <div class="table-page">
      <el-card>
        <div style="display: flex; align-items: center;">
          <el-button type="primary" :icon="RefreshRight" @click="Refresh" style="margin-right: 10px;"></el-button>
          <el-select v-model="sortValue" class="custom-select" placeholder="排序" size="default" @change="sortChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          
            <el-link type="primary" :underline="false" href="http://121.8.169.179:221" target="_blank">
              <el-button type="primary" style="margin-left: 10px;margin-right: 10px;">
              区块浏览器
            </el-button>
            </el-link>
          
          
        </div>
        <el-table :data="tableData" style="width: 100%"  @row-click="handleRowClick">
          <el-table-column prop="ip" label="IP" width="80">
            <template #default="scope">
                <el-tooltip :content="scope.row.ip" placement="top">{{scope.row.shortIP}}</el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="hashrate" label="算力" width="80"></el-table-column>
          <el-table-column prop="shortAddr" label="矿工地址" width="120">
            <template #default="scope">
                <el-tooltip :content="scope.row.coinbase" placement="top">{{scope.row.shortAddr}}</el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="blockNumber" label="出块数" width="120"></el-table-column>
          <el-table-column prop="blockPercent" label="出块率" width="120"></el-table-column>
          <el-table-column prop="reward" label="出块奖励" width="120"></el-table-column> 
          <!-- <el-table-column prop="name" label="节点类型" width="340"></el-table-column> -->
          <el-table-column prop="cpu_name" label="芯片型号" width="120">
            <template #default="scope">
                <el-tooltip :content="scope.row.cpu_name" placement="top">{{scope.row.shortCpu}}</el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="host_cores" label="主机核数" width="90" align="center"></el-table-column>
          <el-table-column prop="node_cpu" label="占用cpu" width="90" align="center"></el-table-column>
          <el-table-column prop="host_memory_str" label="主机内存" width="90" align="center"></el-table-column>
          <el-table-column prop="node_memory" label="占用内存" width="90" align="center"></el-table-column>
          <el-table-column prop="node_num" label="可部署节点" width="100" align="center"></el-table-column>
          <el-table-column prop="runTime" label="时长" width="120" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" :formatter="statusFormatter" width="120"></el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :page-size="10" :total="pageInfo.total" @current-change="currentChange"/>
      </el-card>
    </div>
    <nodeLogVue :isShow="isShow" :nid="nid" :nMemory="nMemory" @closeNodeLog="closeNodeLog"></nodeLogVue>
  </template>
  
<script lang="ts" setup>
    import { ref,Ref,onMounted,onUnmounted  } from 'vue'
    import PageInfo from "../class/PageInfo"
    import { indexNodeList } from '../http'
    import router from '../router'
    import {RefreshRight} from '@element-plus/icons-vue'
    import nodeLogVue from "../components/nodeLog.vue"
    //生命周期函数请求数据列表
    onMounted(async()=>{
        await load()
        startTimer()
    })
    onUnmounted(async()=>{
      stopTimer()
    })
    //当前时间
    let now=Number(new Date())
    //表格数据组
    const tableData = ref<any[]>([])
    //分页数据
    const pageInfo:Ref<PageInfo>=ref<PageInfo>(new(PageInfo))
    //排序
    const sortValue = ref('1')
    //日志页面传递参数
    const isShow=ref(false)
    const nid=ref(0)
    const nMemory=ref(0)
    //定时器
    const intervalId =ref<any>()
    const load=async()=>{
        now=Number(new Date())
        indexNodeList(pageInfo.value,sortValue.value).then(res=>{
            tableData.value=res.data.list
            pageInfo.value.total=res.data.total
            tableData.value.forEach((val)=>{
                val.node_num=100/(val.node_cpu as number)>100/(val.node_memory as number)?100/(val.node_memory as number):100/(val.node_cpu as number)
                val.node_num=parseInt(val.node_num)
                val.blockPercent=((val.blockNumber as number)*100/res.data.blockNumber).toFixed(2)+'%'
                // val.blockPercent=Math.round(val.blockPercent)

                val.created=new Date(val.created*1000)

                val.shortAddr=val.coinbase.substring(0,8)+'...'
                val.shortIP=val.ip.substring(0,4)+'...'
                val.shortCpu=val.cpu_name.substring(0,8)+'...'

                val.node_cpu=val.node_cpu+'%'
                val.node_memory=(val.host_memory*val.node_memory/100).toFixed(2)+'GB'
                val.host_memory_str=val.host_memory+"GB"

                if ((now/1000)-val.updated<=35){
                  val.runTime=((now/1000-val.start)/3600).toFixed(2)+"h"
                } else {
                  val.runTime=((now/1000-val.updated)/3600).toFixed(2)+"h"
                } 
            })
        }).catch(err=>{
            alert(err.msg)
            router.push({path:"/dist"})
            return
        }) 
    }
    const currentChange=(val:string)=>{
        pageInfo.value.page=val
        load()
    }
    const sortChange=()=>{
      load()
    }
    const statusFormatter=(row:any)=>{
        return (now/1000)-row.updated>35?"离线":"在线"
    }
    const Refresh=()=>{
        load() 
    }
    
    const options = [
      {
        value: '1',
        label: '算力',
      },
      {
        value: '2',
        label: '出块',
      },  
    ]
    
    const handleRowClick=(row:any)=>{
      isShow.value=true
      nid.value=row.id
      nMemory.value=row.host_memory
    }
    const closeNodeLog=()=>{
        isShow.value=false
        nid.value=0
        nMemory.value=0
    }
    
    const startTimer=()=>{
      intervalId.value=setInterval(()=>{
          load()
      },20000)
    }
    const stopTimer=()=>{
        clearInterval(intervalId.value)
    }
</script>
  <style scoped>
  .table-page {
    padding: 20px;
  }
  
  .table-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 300px;
  }
  
  .add-button,
  .refresh-button {
    margin-left: 20px;
  }
  
  .table-image {
    max-width: 100px;
    max-height: 100px;
    display: block;
    margin: 0 auto;
  }
  .custom-select{
    width: 100px;
  }
</style>
  