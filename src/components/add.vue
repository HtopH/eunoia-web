<template>
    <el-dialog v-model="dialogVisible" :title="info?.fileHash ? '修改':'新增'" width="30%" @close="$emit('closeAdd')" draggable>
        <el-form>
            <el-form-item label="名称" prop="name">
            <el-input v-model="form.fileHash" />
            </el-form-item>

            <el-form-item label="时间" prop="date">
                <el-date-picker v-model="form.created" type="date" placeholder="请选择一个时间" :disableDate="disableDate"/>
            </el-form-item>

            <el-form-item label="图片" prop="address">
                <el-upload
                    class="avatar-uploader"
                    action="http://127.0.0.1:10223/api/user/upload"
                    :headers="myHeaders"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :on-error="handleAvatarError"
                >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>

            </el-form-item>
            

            <el-form-item>
                <el-button @click="closeAdd()">Cancel</el-button>
                <el-button type="primary" @click="save()">Add</el-button>
            </el-form-item>

        </el-form>
    </el-dialog>

</template>
<script lang="ts" setup>
    import {ref,Ref,computed,watch} from 'vue'
    import { Plus } from '@element-plus/icons-vue'
    import FileInfo from "../class/fileInfo"
    import {useStore} from 'vuex';
    //获取全局状态
    const store=useStore()


    const props=defineProps({
        isShow: Boolean,
        info: FileInfo,
    })

    //computed计算属性，实现联动效果，isShow改变时，dialogVisible会跟着改变
    const dialogVisible=computed(()=>props.isShow)

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
                fileHash:newInfo.fileHash,
                created:newInfo.created
            }
            imageUrl.value=newInfo.path.toString()
        }
    })
    const form:Ref<FileInfo> =ref<FileInfo>({
        id:0,
        uid:0,
        path: "",
        fileHash: "",
        created:""
    })  
    const disableDate=(time: any)=>{
        //最大时间，从今天开始
        const _maxTime=Date.now()-24*60*60*1000*1
        return time.getTime()<=_maxTime
    }
    const emits=defineEmits(["closeAdd"])
    const closeAdd=()=>{
        emits("closeAdd","关闭")
    }
    const save=()=>{
        emits("closeAdd","保存")
    }
    
    
    const imageUrl = ref("")
    const myHeaders=ref<any>({
        token:""
    })
    const handleAvatarSuccess=(
        response: any,
    ) => {
        imageUrl.value=response.data.url
    }
    const handleAvatarError=(
        response: any,
    ) => {
        console.log(response);
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

