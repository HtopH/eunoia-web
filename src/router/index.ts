import { createRouter, createWebHistory } from 'vue-router'

const router=createRouter({
    history:createWebHistory(),
    routes:[
        {   
            name:"home",
            path:"/dist",
            component:()=>import("../views/IndexPage.vue")
        },
        {   
            name:"product",
            path:"/product",
            component:()=>import("../views/ProductView.vue")
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
        },
        {
            name:"node",
            path:"/node",
            component:()=>import("../views/NodePage.vue")
        }
    ]
})

export default router