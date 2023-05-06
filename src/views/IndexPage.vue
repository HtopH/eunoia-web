<template>
    <div class="container">
        <el-row v-for="(item) in tableData" :key="item.id" >
            <el-col :span="7">
                <el-card :body-style="{ padding: '0px' }">
                    <img :src=item.path class="image"/>
                    <div style="padding: 14px">
                        <span>{{ item.fileHash }}</span>
                        <div class="bottom">
                            <time class="time">{{ item.created }}</time>
                            <el-button text class="button">Operating</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-pagination background layout="prev, pager, next" :page-size="10" :total="pageInfo.total" @current-change="currentChange"/>
    </div>
   
</template>
  
<script lang="ts" setup>
import { Ref,ref,onMounted } from 'vue'
import PageInfo from "../class/PageInfo"
import { indexList } from '../http'

onMounted(async()=>{
    await load()
})

//表格数据组
const tableData = ref<any[]>([])
//分页数据
const pageInfo:Ref<PageInfo>=ref<PageInfo>(new(PageInfo))

const load=async()=>{  
    indexList(pageInfo.value).then(res=>{
        tableData.value=res.data.list
        pageInfo.value.total=res.data.total
        tableData.value.forEach((val)=>{
            val.created=new Date(val.created*1000)
        })
    }).catch(err=>{
        alert(err.msg)
    })
   
    
} 


const currentChange=(val:string)=>{
    pageInfo.value.page=val
    load()
}
</script>
  
<style>
    .container {
        width: 70%;
        margin: auto;
    }

    .time {
    font-size: 12px;
    color: #999;
    }

    .bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    }

    .button {
    padding: 0;
    min-height: auto;
    }

    .image {
    width: 100%;
    display: block;
    }
</style>
  