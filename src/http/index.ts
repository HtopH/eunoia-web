import axios from "axios"
import PageInfo from "../class/PageInfo"

//查询列表
export const fileList=(page:PageInfo,token:String) => {
    return axios.get("/baseUrl/api/user/fileList?page="+page.page+"&size="+page.size,{
        headers:{
            'token':token,
        }
    })
}
