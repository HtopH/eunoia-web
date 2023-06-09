<template>
<div class="product-list">
    <el-card>
        <el-row>
            <el-col :span="12" v-for="product in tableData" :key="product.id">
                <el-card>
                    <img :src="product.path" alt="product image" class="product-image">
                    <div class="product-info">
                        <div class="product-name">{{ product.name }}</div>
                        <div class="product-attributes">
                            <div class="product-attribute">价格:{{ product.price }}</div>
                            <div class="product-attribute">引用数量: {{ product.quote }}</div>
                            <div class="product-attribute">有用数量: {{ product.use }}</div>
                            <div class="product-attribute">无用数量:{{ product.unuse }}</div>
                        </div>
                        <div class="product-attributes">
                            <div class="product-attribute">作者:{{product.actor}}</div>
                        </div>
                        <el-button type="primary" @click="productQuote(product)">引用</el-button>
                        <el-button type="primary" @click="productUse(product,1)">有用</el-button>
                        <el-button type="primary" @click="productUse(product,2)">无用</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <div class="pagination">
            <el-pagination background layout="prev, pager, next" :page-size="10" :total="pageInfo.total" @current-change="currentChange"/>
        </div>
    </el-card>
    
</div>
</template>
  
<script lang="ts" setup>
import { Ref,ref,onMounted } from 'vue'
import PageInfo from "../class/PageInfo"
import { indexList } from '../http'
import Web3 from "web3";
import {useStore} from 'vuex';
import eunoiaAbiJson from "../assets/json/eunoiaAbi.json"
import BigNumber from 'bignumber.js'

const store=useStore()
//区块链相关
const web3=ref<any>(new Web3(window.ethereum))
const eunoiaAbi=eunoiaAbiJson
const eunoiaContract=new web3.value.eth.Contract(eunoiaAbi,store.state.eunoiaContract)

//表格数据组
const tableData = ref<any[]>([])
//分页数据
const pageInfo:Ref<PageInfo>=ref<PageInfo>(new(PageInfo))


onMounted(async()=>{
    await load()
})
const checkToken=()=>{
    if (store.state.token=="" || typeof window.ethereum == "undefined"){
        return false
    }
    return true
}
const checkChainProduct=(hash:string)=>{
    console.log("checkChainProduct",hash);
    return true
}
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

const productUse=async (product:any,doType:number)=>{
    if (!checkToken() || !checkChainProduct(product.fileHash)){
        alert("请安装钱包或连接钱包")
        return
    }
    await eunoiaContract.methods.useProduct(product.fileHash,doType).send({
        from:store.state.token
    }).on('trasactionHash',(hash:string)=>{
        console.log("Transaction hash:",hash);
        load()
    }).on('receipt',(receipt:any)=>{
        console.log("receipt",receipt);
    }).on('error',(error:Error)=>{
        console.log("error",error);
    })
}

const productQuote=async (product:any)=>{
    if (!checkToken() || !checkChainProduct(product.fileHash)){
        alert("请安装钱包或连接钱包")
        return
    }
    let pay = ref(new BigNumber(product.price).times(new BigNumber(10).pow(18)).toString())
    await eunoiaContract.methods.quoteProduct(product.fileHash).send({
        from:store.state.token,
        value:pay.value,
    }).on('trasactionHash',(hash:string)=>{
        console.log("Transaction hash:",hash);
        load()
    }).on('receipt',(receipt:any)=>{
        console.log("receipt",receipt);
    }).on('error',(error:Error)=>{
        console.log("error",error);
    })
}
</script>
  
<style scoped>
.product-list {
padding: 20px;
}
.product-image {
width: 100%;
height: 200px;
object-fit: cover;
}
.product-info {
margin-top: 10px;
text-align: center;
}
.product-name {
font-size: 18px;
font-weight: bold;
}
.product-price {
margin-top: 5px;
font-size: 16px;
font-weight: bold;
}
.product-attributes {
display: flex;
justify-content: space-between;
padding: 5px;
}
.product-attribute {
  margin-right: 10px;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}   
</style>
  