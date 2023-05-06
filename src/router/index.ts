import { createRouter, createWebHistory } from 'vue-router'

const router=createRouter({
    history:createWebHistory(),
    routes:[
        {   
            name:"home",
            path:"/",
            component:()=>import("../views/IndexPage.vue")
        },
        {
            name:"user",
            path:"/user",
            component:()=>import("../views/HomePage.vue")
        },
        {
            name:"admin",
            path:"/admin",
            component:()=>import("../views/admin.vue")
        }
    ]
})

export default router