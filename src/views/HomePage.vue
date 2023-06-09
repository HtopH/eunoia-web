<template>
    <div class="table-page">
      <el-card>
        <div style="display: flex; align-items: center;">
          <el-button type="primary" :icon="RefreshRight" @click="Refresh" style="margin-right: 10px;"></el-button>
          <el-button type="primary" @click="openAdd">添加</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" >
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
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
          <el-table-column prop="fileHash" label="文件Hash" width="300"></el-table-column>
          <el-table-column prop="price" label="价格" width="70"></el-table-column>
          <el-table-column prop="use" label="有用数" width="70"></el-table-column>
          <el-table-column prop="unuse" label="无用数" width="70"></el-table-column>
          <el-table-column prop="quote" label="引用数" width="70"></el-table-column>
          <el-table-column prop="status" label="状态" :formatter="statusFormatter" width="120"></el-table-column>
          <el-table-column prop="created" label="创建时间" width="280"></el-table-column>
          <el-table-column label="显示">
            <template #default="scope">
                <el-switch  v-if="scope.row.status>0"
                    v-model="scope.row.status"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    :active-value="1"
                    :inactive-value="2"
                    @change="switchChange(scope.row.id,scope.row.status,scope.row.price)"
                />
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.row)">Edit</el-button>
            </template>
          </el-table-column>

        </el-table>
        <el-pagination background layout="prev, pager, next" :page-size="10" :total="pageInfo.total" @current-change="currentChange"/>
      </el-card>
    </div>
    <addVue :isShow="isShow" :info="info" @closeAdd="closeAdd"></addVue>
  </template>
  
<script lang="ts" setup>
    import { ref,Ref,onMounted  } from 'vue'
    // import {Search} from '@element-plus/icons-vue'
      
    import FileInfo from "../class/fileInfo"
    import PageInfo from "../class/PageInfo"
    import { fileList,editProduct } from '../http'
    import router from '../router'
    import {RefreshRight} from '@element-plus/icons-vue'

    //生命周期函数请求数据列表
    onMounted(async()=>{
        await load()
    })
    //表格数据组
    const tableData = ref<any[]>([])
    // const SearchVal=ref("")
    //分页数据
    const pageInfo:Ref<PageInfo>=ref<PageInfo>(new(PageInfo))
    const load=async()=>{
        fileList(pageInfo.value).then(res=>{
            tableData.value=res.data.list
            pageInfo.value.total=res.data.total
            tableData.value.forEach((val)=>{
                val.created=new Date(val.created*1000)
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
    // const enterSearch=()=>{

    // }
    const openAdd=()=>{
        isShow.value=true
    }
    
    const isShow=ref(false)
    const info=ref<FileInfo>(new FileInfo())
    const handleEdit=(row: FileInfo)=>{
        info.value=row
        isShow.value=true
    }
    //   const handleDelete=(index:Number,row: any)=>{
    //       console.log(index,row);
    //   }
      
    const switchChange=(id:Number,status: Number,price:Number)=>{
        editProduct({
            "id":id,
            "status":status,
            "price":price
        }).then(res=>{
            console.log(res); 
        }).catch(err=>{
            alert(err.msg)
            return
        }) 
    }
    const closeAdd=()=>{
        isShow.value=false
        info.value=new FileInfo()
        load()    
    }
    const statusFormatter=(row:any)=>{
        return row.status==0?"未上链":"已上链"
    }
    const Refresh=()=>{
        load() 
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
  </style>
  