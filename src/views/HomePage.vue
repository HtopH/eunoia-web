<template>
    <div class="container">
        <el-row>
            <el-col :span="12">
                <el-input v-model="SearchVal" placeholder="Please input" class="input-with-select" @keyup.enter="enterSearch">
                    <template #append>
                        <el-button :icon="Search" @click="enterSearch"/>
                    </template>
                </el-input>
            </el-col>
            <el-col :span="12">
                <el-button type="primary" @click="openAdd">add</el-button>
                <!-- <el-button type="danger" @click="onDel">delete</el-button> -->
            </el-col>
        </el-row>
        <el-table :data="tableData" style="width: 100%">
            <!-- <el-table-column type="selection" width="55" /> -->
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="uid" label="UID" width="70" />
            <el-table-column  prop="path" label="文件" width="180">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-image 
                            :src="scope.row.path"
                            style="width: auto;height: auto;"
                            :preview-src-list="[scope.row.path]"
                            hide-on-click-modal
                            preview-teleported
                        />
                    </div>
                </template>
            </el-table-column>

            <el-table-column prop="fileHash" label="文件hash"  width="300"/>
            <el-table-column prop="created" label="创建时间" />
            <el-table-column label="Operations">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.$index,scope.row)">Edit</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index,scope.row)">Delete</el-button> 
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :page-size="10" :total="pageInfo.total" @current-change="currentChange"/>
    </div>
    <addVue :isShow="isShow" :info="info" @closeAdd="closeAdd"></addVue>
</template>
<script lang="ts" setup>
    import { ref,Ref,onMounted } from 'vue'
    import {Search} from '@element-plus/icons-vue'
    import addVue from "../components/add.vue"
    import FileInfo from "../class/fileInfo"
    import PageInfo from "../class/PageInfo"
    import { fileList } from '../http'
    import {useStore} from 'vuex';
    import router from '../router'
    
    //获取全局状态
    const store=useStore()


    //生命周期函数请求数据列表
    onMounted(async()=>{
        await load()
    })
    //表格数据组
    const tableData = ref<any[]>([])
    const SearchVal=ref("")
    //分页数据
    const pageInfo:Ref<PageInfo>=ref<PageInfo>(new(PageInfo))
    const load=async()=>{
        if (store.state.token==""){
            router.push({path:"/"})
            alert("请先连接钱包")
            return
        }
        fileList(pageInfo.value,store.state.token).then(res=>{
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
    const enterSearch=()=>{

    }
    const openAdd=()=>{
        isShow.value=true
    }
    // const onDel=()=>{

    // }
   
    const isShow=ref(false)
    const info=ref<FileInfo>(new FileInfo())
    const handleEdit=(index:Number,row: FileInfo)=>{
        console.log(index); 
        info.value=row
        isShow.value=true
    }
    const handleDelete=(index:Number,row: any)=>{
        console.log(index,row);
    }

    const closeAdd=(message: String)=>{
        isShow.value=false
        info.value=new FileInfo()
        console.log(message);
        
    }

    

</script>

<style lang="scss" srcoped>
    .container {
        margin:20 auto;
        width: 70%;
    }
    .table{
        margin : 10px 0;
    }
    .input-with-select {
        width: 300px;
        margin-right:20px;
    }

</style>