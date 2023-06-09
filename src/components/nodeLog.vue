<template>
    <el-dialog v-model="dialogVisible" title='节点日志' width="50%" draggable @open="handleDialogVisibleChange" @close="closeLog">
        <div class="table-page">
      <el-card>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="hashrate" label="算力" width="220" align="center">
            <template #default="scope">
                <div :style="getRateBackgroundColor(scope.row)">
                    {{ scope.row.hashrate }}
                </div>
            </template>
          </el-table-column>
          <el-table-column prop="node_cpu_str" label="cpu" width="220" align="center">
            <template #default="scope">
                <div :style="getCPUBackgroundColor(scope.row)">
                    {{ scope.row.node_cpu_str }}
                </div>
            </template>

          </el-table-column>
          <el-table-column prop="node_memory_str" label="内存" width="220" align="center">
                <template #default="scope">
                    <div :style="getMemBackgroundColor(scope.row)">
                        {{ scope.row.node_memory_str }}
                    </div>
                </template>
          </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :page-size="50" :total="pageInfo.total" @current-change="currentChange"/>
      </el-card>
    </div>
    </el-dialog>

</template>

<script lang="ts" setup>
    import { ref,Ref,computed } from 'vue'
    import PageInfo from "../class/PageInfo"
    import { nodeLogList } from '../http'
    import router from '../router'
    const maxRate=ref(0)
    const maxCPU=ref(0)
    const maxMem=ref(0)
    //表格数据组
    const tableData = ref<any[]>([])
    //分页数据
    const pageInfo:Ref<PageInfo>=ref<PageInfo>(new(PageInfo))
    pageInfo.value.size='50'
    const props=defineProps({
        isShow: Boolean,
        nid: Number,
        nMemory:Number,
    })
    //computed计算属性，实现联动效果，isShow改变时，dialogVisible会跟着改变
    const dialogVisible=computed(()=>props.isShow)

    const load=async()=>{
        nodeLogList(pageInfo.value,props.nid).then(res=>{
        tableData.value=res.data.list
        pageInfo.value.total=res.data.total
        tableData.value.forEach((val)=>{
            val.node_cpu_str=val.node_cpu+'%'
            val.node_memory_str=(val.node_memory*(props.nMemory as number)/100).toFixed(2)+'GB'

            if (val.hashrate>maxRate.value){
                maxRate.value=val.hashrate
            }
            if (val.node_cpu>maxCPU.value){
                maxCPU.value=val.node_cpu
            }
            if (val.node_memory>maxMem.value){
                maxMem.value=val.node_memory
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
    
    const handleDialogVisibleChange=()=>{
        load()
        startTimer()
    }
    //调用父组件方法
    const emits=defineEmits(["closeNodeLog"])
    const closeLog=()=>{
        emits("closeNodeLog")
        stopTimer()
        maxRate.value=0
        maxCPU.value=0
        maxMem.value=0
    }
    const getRateBackgroundColor=(row:any) =>{
        let left=(row.hashrate*100/(maxRate.value*2)).toFixed(2)
        // let right=100-Number(left)     
        const gradientColor = `linear-gradient(to right, red `+left+`%,white `+left+`%)`;
        return `background: ${gradientColor};`;
    }
    const getCPUBackgroundColor=(row:any) =>{
        let left=(row.node_cpu*100/(maxCPU.value*2)).toFixed(2)
        const gradientColor = `linear-gradient(to right, yellow `+left+`%,white `+left+`%)`;
        return `background: ${gradientColor};`;
    }
    const getMemBackgroundColor=(row:any) =>{
        let left=(row.node_memory*100/(maxMem.value*2)).toFixed(2)
        const gradientColor = `linear-gradient(to right, green `+left+`%,white `+left+`%)`;
        return `background: ${gradientColor};`;
    }
    
    const intervalId =ref<any>()
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
</style>

