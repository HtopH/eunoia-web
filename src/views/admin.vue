<template>
    <el-form :model="form" label-width="120px" class="container">
      <el-form-item label="操作等级">
        <el-input v-model="form.num" type="number"/>
      </el-form-item>
      <el-form-item label="操作密码">
        <el-input v-model="form.password" />
      </el-form-item>
      <el-form-item label="操作对象">
        <el-radio-group v-model="form.resource" @change="onRadioChange">
          <el-radio :label=1>CPU</el-radio>
          <el-radio :label=2>内存</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script lang="ts" setup>
  import { reactive } from 'vue'
  import { getPerformanceLevel,setPerformance } from '../http'
  // do not use same name with ref
  const form = reactive({
    num: 0,
    resource: 0,
    password:'',
  })

  const onSubmit = () => {
    setLevel()
  }
  const onRadioChange=()=>{
    getLevel()
  }
  const getLevel=async()=>{
    getPerformanceLevel(form.resource.toString()).then(res=>{
      form.num=res.data
    }).catch(err=>{
      alert(err.data)
    })
  }
  const setLevel=async()=>{
    let type=form.resource==2?"setMemory":"setCPU"
    setPerformance(type,form.num.toString(),form.password).then(res=>{
      alert(res.data)
    }).catch(err=>{
      alert(err.data)
    })
    
  }
  </script>
<style>

.container {
        margin:0 auto;
        width: 70%;
    }
</style>