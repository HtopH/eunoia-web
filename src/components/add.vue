<template>
    <el-dialog v-model="dialogVisible" :title="info?.fileHash ? '修改':'新增'" width="30%" @close="$emit('closeAdd')" draggable>
        <el-form>
            <!-- <el-form-item label="时间" prop="date">
                <el-date-picker v-model="form.created" type="date" placeholder="请选择一个时间" :disableDate="disableDate"/>
            </el-form-item> -->
            <el-form-item v-if="info?.path" label="图片" prop="address">
                <img  :src="imageUrl" class="avatar" />
            </el-form-item>
            <el-form-item v-else label="图片" prop="address">
                <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :headers="myHeaders"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :on-error="handleAvatarError"
                    :on-remove="handleRemove"
                >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>
            
            <el-form-item label="价格" prop="price">
                <el-input-number v-model="form.price" :precision="2" :step="0.1" :max="10" />
            </el-form-item>
            
            <el-form-item v-if="form.fileHash" label="hash" prop="fileHash">
                <el-input v-model="form.fileHash" disabled/>
            </el-form-item>

            <el-form-item>
                <el-button v-if="info?.path" type="primary" @click="edit()">编辑</el-button>
                <el-button v-else type="primary" @click="save()">添加</el-button>
                <el-button @click="closeAdd()">取消</el-button>
            </el-form-item>

        </el-form>
    </el-dialog>

</template>

<script lang="ts" setup>
    import {ref,Ref,computed,watch} from 'vue'
    import { Plus } from '@element-plus/icons-vue'
    import FileInfo from "../class/fileInfo"
    import {useStore} from 'vuex';
    import { RequstUrl,createProduct } from '../http'
    import Web3 from "web3";
    import eunoiaAbiJson from "../assets/json/eunoiaAbi.json"
    import BigNumber from 'bignumber.js'
    
    const uploadUrl=ref<string>(RequstUrl+'/api/user/upload')
    //获取全局状态
    const store=useStore()
    //区块链相关
    const web3=ref<any>(new Web3(window.ethereum))
    const eunoiaAbi=eunoiaAbiJson
    const eunoiaContract=new web3.value.eth.Contract(eunoiaAbi,store.state.eunoiaContract)
    const checkToken=()=>{
        if (store.state.token=="" || typeof window.ethereum == "undefined"){
            return false
        }
        return true
    }
    const checkChainProduct=(hash:String)=>{
        console.log("checkChainProduct",hash);
        return true
    }


    const props=defineProps({
        isShow: Boolean,
        info: FileInfo,
    })
    //computed计算属性，实现联动效果，isShow改变时，dialogVisible会跟着改变
    const dialogVisible=computed(()=>props.isShow)
    const imageUrl = ref("")
    const myHeaders=ref<any>({
        token:""
    })

    const form:Ref<FileInfo> =ref<FileInfo>({
        id:0,
        uid:0,
        path: "",
        price:0,
        fileHash: "",
        created:"",
        status:0
    })  

    watch(()=>props.isShow,()=>{
        myHeaders.value.token=store.state.token
    })

    watch(()=>props.info,(newInfo)=>{
        if (newInfo)
        {
            form.value={
                id:newInfo.id,
                uid:newInfo.uid,
                path:newInfo.path,
                price:newInfo.price,
                fileHash:newInfo.fileHash,
                created:newInfo.created,
                status:newInfo.status
            }
            imageUrl.value=newInfo.path.toString()
        }
    })
    
    // const disableDate=(time: any)=>{
    //     //最大时间，从今天开始
    //     const _maxTime=Date.now()-24*60*60*1000*1
    //     return time.getTime()<=_maxTime
    // }
    //调用父组件方法
    const emits=defineEmits(["closeAdd"])
    const closeAdd=()=>{
        // emits("closeAdd","关闭")可传参，关闭为字符串参数
        emits("closeAdd")
    }
    const save=async()=>{
        productToChain()
        createProduct({
            path:form.value.path,
            price:form.value.price
        }).then(res=>{
            emits("closeAdd",res.msg)
        }).catch(err=>{  
            alert(err.data)
            return
        }) 
    }

    const edit=async()=>{
        if (props.info?.price!=form.value.price){
            await updateToChain()
            // editProduct({
            //     "id":props.info?.id,
            //     "status":props.info?.status,
            //     "price":form.value.price
            // }).then(res=>{
            //     console.log(res); 
            // }).catch(err=>{
            //     alert(err.msg)
            //     return
            // }) 
        }
        emits("closeAdd")
    }
    //作品上链
    const productToChain=async()=>{
        if (!checkToken() || !checkChainProduct(form.value.fileHash)){
            alert("请安装钱包或连接钱包")
            return
        }
        let pay = ref(new BigNumber(form.value.price).times(new BigNumber(10).pow(18)).toString())
        console.log(form.value.fileHash,pay.value);
        await eunoiaContract.methods.createProduct(form.value.fileHash,pay.value).send({
            from:store.state.token
        }).on('trasactionHash',(hash:string)=>{
            console.log("Transaction hash:",hash);
        }).on('receipt',(receipt:any)=>{
            console.log("receipt",receipt);
        }).on('error',(error:Error)=>{
            console.log("error",error);
        })
    }

    const updateToChain=async()=>{
        if (!checkToken() || !checkChainProduct(form.value.fileHash)){
            alert("请安装钱包或连接钱包")
            return
        }
        let pay = ref(new BigNumber(form.value.price).times(new BigNumber(10).pow(18)).toString())
        console.log(form.value.fileHash,pay.value);
        await eunoiaContract.methods.editProduct(form.value.fileHash,pay.value).send({
            from:store.state.token
        }).on('trasactionHash',(hash:string)=>{
            console.log("Transaction hash:",hash);
        }).on('receipt',(receipt:any)=>{
            console.log("receipt",receipt);
        }).on('error',(error:Error)=>{
            console.log("error",error);
        })
    }
    
    const handleAvatarSuccess=(
        response: any,
    ) => {
        imageUrl.value=response.data.url
        form.value.fileHash=response.data.file_hash
        form.value.path=response.data.save_url
    }
    const handleAvatarError=(
        response: any,
    ) => {
        console.log(response);
    }
    const handleRemove=()=>{
        console.log('handleRemove')
    }
    
</script>


<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

