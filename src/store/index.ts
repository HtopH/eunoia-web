import { createStore } from 'vuex'
// 创建一个新的 store 实例
const store = createStore({
        state () {
                return {
                        token: "",
                        chainHttp:"http://121.8.169.179:211",
                        eunoiaContract:"0x46FB1429DA5484e2C4Cd58966227AB018Bb196c6",
                }
        },
        getters:{
                getToken(state: { token: String }) {
                        return state.token!=""?state.token:"连接钱包"
                }
        },
        mutations: {
                setToken (state: { token: String },payload: String) {
                        state.token = payload
                }
        },
    
        actions:{
                asyncAdd(store: { commit: (arg0: string, arg1: any) => void },payload: any){
                        setTimeout(()=>{
                                store.commit('setToken',payload)
                        },1000)
                }
        }
})
export default store