import VueRouter from 'vue-router'
import cookie from 'js-cookie'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Article from '../pages/Article.vue'
import ArticleList from '../pages/ArticleList.vue'
import MapList from '../pages/MapList.vue'
import Login from '../pages/Login.vue'
import StoreList from '../pages/StoreList.vue'
import Store from '../pages/Store.vue'
import PostDetail from '../pages/PostDetail.vue'
import Category from '../pages/Category.vue'
import UserBrown from '../pages/UserBrown.vue'
import ChatOnline from '../pages/ChatOnline.vue'
import MiddlePage from '../pages/MiddlePage.vue'
import PersonCenter from '../pages/PersonCenter.vue'

const router =  new VueRouter({
    routes:[
        {
            path:'/',
            component:Home,
            meta:{title:'首页'},
            redirect:'/welcome',
            children:[
                {
                    path:'welcome',
                    name:'首页',
                    component:Welcome,
                    meta:{title:'首页'},
                },
                {
                    path:'postDetail',
                    name:'公告页',
                    component:PostDetail,
                    meta:{isAuth:true,title:'公告页'},
                },
                {
                    path:'article',
                    name:'书贴',
                    component:Article,
                    meta:{title:'书贴'},
                },
                {
                    path:'articleList',
                    name:'书贴列表',
                    component:ArticleList,
                    meta:{title:'书贴列表'},
                },
                {
                    path:'mapList',
                    name:'附近图书',
                    component:MapList,
                    meta:{title:'附近图书'},
                },
                {
                    path:'storeList',
                    name:'热门书店',
                    component:StoreList,
                    meta:{title:'热门书店'},
                },
                {
                    path:'store',
                    name:'书店详情',
                    component:Store,
                    meta:{title:'书店详情'},
                },
                {
                    path:'category',
                    name:'全部分类',
                    component:Category,
                    meta:{title:'全部分类'},
                },
                {
                    path:'middlePage',
                    name:'加载页',
                    component:MiddlePage,
                    meta:{title:'加载页'},
                },
                {
                    path:'chatOnline',
                    name:'在线寻书',
                    component:ChatOnline,
                    meta:{isAuth:true,title:'在线寻书'},
                },
                {
                    path:'userBrown',
                    name:'图书借阅',
                    component:UserBrown,
                    meta:{isAuth:true,title:'图书借阅'},
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
            path:'/login',
            component:Login,
            meta:{title:'用户登录'},
        }
    ]   
})

//前
router.beforeEach((to,from,next)=>{
    if(to.meta.isAuth===true){
        var userToken = cookie.get('user_front_token')
        if(userToken){
            next()
        }else{
            next('/login')
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