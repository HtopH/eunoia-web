import axios,{ AxiosInstance,AxiosResponse } from "axios"
import PageInfo from "../class/PageInfo"
import querystring from "querystring"
import store from "../store"

//根据环境判断代理url
let baseUrl:any=import.meta.env.DEV?'/baseUrl':''

let axiosInstance:AxiosInstance = axios.create({
    baseURL: baseUrl,//设置baseUrl,会在请求前加入到请求路径
    headers: { //统一设置头部
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
    },
    transformRequest: [
        function(data) {
            //由于使用的 form-data传数据,所以要格式化
            data = querystring.stringify(data);
            return data;
        }
    ]
});

// axios实例拦截响应
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    // 请求失败
    (error: any) => {
      const {response} = error;
      if (response) {
        // 请求已发出，但是不在2xx的范围
        return Promise.reject(response.data);
      }
    }
);

export const RequstUrl=baseUrl

//刷新token
export const UpdateToken=()=>{
    axiosInstance.defaults.headers.common['token']=store.state.token
}

//查询用户信息
export const getUserInfo=() => {
    return axiosInstance.get("/api/user/info").then(res=>res.data);
}

//查询用户作品列表
export const fileList=(page:PageInfo) => {
    return axiosInstance.get("/api/user/fileList?page="+page.page+"&size="+page.size).then(res=>res.data);
}

//查询首页作品列表
export const indexList=(page:PageInfo) => {
    return axiosInstance.get("/api/index/fileList?page="+page.page+"&size="+page.size).then(res=>res.data);
}

//查询性能等级
export const getPerformanceLevel=(resource:String) => {
    return axiosInstance.get("/api/blockChain/getLevel?resource="+resource).then(res=>res.data);
}

//设置CPU
export const setPerformance=(type:string,num:string,password:string) => {
    return axiosInstance.get("/api/blockChain/"+type+"?num="+num+"&password="+password).then(res=>res.data);
}

//创建作品
export const createProduct=(param:any) => {
    return axiosInstance.post("/api/user/createProduct",param).then(res=>res.data)
}

//编辑作品
export const editProduct=(param:any) => {
    return axiosInstance.post("/api/user/editProduct",param).then(res=>res.data)
}

//查询节点信息
export const indexNodeList=(page:PageInfo,sort:any) => {
    return axiosInstance.get("/api/node/indexList?page="+page.page+"&size="+page.size+"&sort="+sort).then(res=>res.data);
}

//查询节点信息
export const nodeLogList=(page:PageInfo,nid:any) => {
    return axiosInstance.get("/api/node/node_log?page="+page.page+"&size="+page.size+"&nid="+nid).then(res=>res.data);
}