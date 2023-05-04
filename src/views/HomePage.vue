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
        <el-pagination background layout="prev, pager, next" :total="total" @current-change="currentChange"/>
    </div>
    <addVue :isShow="isShow" :info="info" @closeAdd="closeAdd"></addVue>
</template>
<script lang="ts" setup>
    import { ref,onMounted } from 'vue'
    import {Search} from '@element-plus/icons-vue'
    import addVue from "../components/add.vue"
    import FileInfo from "../class/fileInfo"
    import PageInfo from "../class/PageInfo"
    import { fileList } from '../http'

    onMounted(async()=>{
        await load()
    })

    const tableData = ref<any[]>([])
    const SearchVal=ref("")
    const total=ref(100)
    const pageInfo=ref<PageInfo>(new PageInfo())
    const load=async()=>{
       let res=await fileList(pageInfo.value)
       tableData.value=res.data.data
       tableData.value.forEach((val)=>{
        val.created=new Date(val.created*1000)
       })
    }
    const currentChange=(val:number)=>{
        console.log(val);
        
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
        margin: 100px auto;
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