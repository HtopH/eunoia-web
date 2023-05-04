import axios from "axios"
import PageInfo from "../class/PageInfo"

axios.defaults.headers.common['token']=`0x722759d3f019F8B04D4E14FC7486e637Ed5DE5EC`;

//查询列表
export const fileList=(page:PageInfo) => {
    return axios.get("/baseUrl/api/user/fileList?page="+page.page+"&size="+page.size)
}
