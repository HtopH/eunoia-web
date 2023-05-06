import axios,{ AxiosInstance,AxiosHeaderValue,AxiosResponse } from "axios"
import PageInfo from "../class/PageInfo"
import querystring from "querystring"
export interface ResponseData {
    code: number;
    data?: any;
    msg: string;
}

let baseUrl:any=import.meta.env.DEV?'/baseUrl':''

let axiosInstance:AxiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    },
    transformRequest: [
        function(data) {
            //由于使用的 form-data传数据所以要格式化
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

//查询用户作品列表
export const fileList=(page:PageInfo,account:AxiosHeaderValue) => {
    return axiosInstance.get("/api/user/fileList?page="+page.page+"&size="+page.size,{
        headers:{
            token:account,
        }
    }).then(res=>res.data);
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