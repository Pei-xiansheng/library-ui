import VueRouter from 'vue-router'
import cookie from 'js-cookie'
import Home from '../components/Home.vue'
import Login from '../pages/Login.vue'
import Welcome from '../pages/Welcome.vue'
import Permission from '../pages/Permission.vue'
import UserList from '../pages/UserList.vue'
import BannerList from '../pages/BannerList.vue'
import BookList from '../pages/BookList.vue'
import PostEdit from '../pages/PostEdit.vue'
import MsgCenter from '../components/MsgCenter.vue'
import Borrow from '../pages/Borrow.vue'
import Stock from '../pages/Stock.vue'
import DealUser from '../pages/DealUser.vue'
import Discharge from '../pages/Discharge.vue'
import Hotspot from '../pages/Hotspot.vue'
import PersonCenter from '../components/PersonCenter.vue'


const router =  new VueRouter({
    routes:[
        {
            path:'/home',
            name:'首页',
            component:Home,
            meta:{isAuth:true,title:'首页'},
            redirect:'/home/welcome',
            children:[
                {
                    path:'welcome',
                    name:'欢迎页',
                    component:Welcome,
                    meta:{isAuth:true,title:'欢迎页'},
                },
                {
                    path:'personCenter',
                    name:'个人中心',
                    component:PersonCenter,
                    meta:{isAuth:true,title:'个人中心'},
                },
            ]
        },
        {
            path:'/user',
            name:'用户管理',
            component:Home,
            meta:{title:'用户管理'},
            redirect:'/user/permission',
            children:[
                {
                    path:'permission',
                    name:'权限管理',
                    component:Permission,
                    meta:{title:'权限管理',},
                },
                {
                    path:'userList',
                    name:'用户列表',
                    component:UserList,
                    meta:{title:'用户列表',},
                }
            ]
        },
        {
            path:'/front',
            name:'前台管理',
            component:Home,
            meta:{title:'前台管理'},
            redirect:'/front/bannerList',
            children:[
                {
                    path:'bannerList',
                    name:'图片上传',
                    component:BannerList,
                    meta:{title:'图片上传',},
                }
            ]
        },
        {
            path:'/book',
            name:'图书管理',
            component:Home,
            meta:{title:'图书管理'},
            redirect:'/book/bookList',
            children:[
                {
                    path:'bookList',
                    name:'图书列表',
                    component:BookList,
                    meta:{title:'图书列表',},
                },
                {
                    path:'borrow',
                    name:'借阅信息',
                    component:Borrow,
                    meta:{title:'借阅信息',},
                },
                {
                    path:'stock',
                    name:'库存操作',
                    component:Stock,
                    meta:{title:'库存操作',},
                },
                {
                    path:'dealUser',
                    name:'借阅处理',
                    component:DealUser,
                    meta:{title:'借阅处理',},
                }
            ]
        },
        
        {
            path:'/statistics',
            name:'统计图表',
            component:Home,
            meta:{title:'统计图表'},
            redirect:'/statistics/discharge',
            children:[
                {
                    path:'discharge',
                    name:'流量分析',
                    component:Discharge,
                    meta:{title:'流量分析',},
                },
                {
                    path:'hotspot',
                    name:'热点统计',
                    component:Hotspot,
                    meta:{title:'热点统计',},
                },
            ]
        },
        {
            path:'/notice',
            name:'公告通知',
            component:Home,
            meta:{title:'公告通知'},
            redirect:'/notice/postEdit',
            children:[
                {
                    path:'postEdit',
                    name:'公告编辑',
                    component:PostEdit,
                    meta:{title:'公告编辑',},
                },
                {
                    path:'msgCenter',
                    name:'信息中心',
                    component:MsgCenter,
                    meta:{title:'信息中心',},
                },
            ]
        },
        {
            path:'/',
            component:Login,
            meta:{title:'用户登录'}
        },
        
    ]   
})

//前
router.beforeEach((to,from,next)=>{
    if(to.meta.isAuth===true){
        var userToken = cookie.get('user_token')
        if(userToken){
            next()
        }else{
            next('/')
        }
    }else{
        next()
    }
})
//后
router.afterEach((to,from)=>{
    document.title=to.meta.title
})

export default router