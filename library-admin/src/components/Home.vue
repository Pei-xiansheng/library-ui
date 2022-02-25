<template>
  <div class="main">
    <el-container>
        <!-- 头部 -->
        <el-header>
          <div class="header-l">
            <img src="../images/shouye.png" alt="鹏程书院" style="width: 100%;height: 100%;cursor: pointer;" @click="gotoHome()">
          </div>
          <div class="header-r">
            <div class="r-img">
              <img :src="loginInfo.userAvatar" alt="头像">
            </div>
            <div class="r-info">
                <el-dropdown class="info-sel">
                    <span class="el-dropdown-link">
                      <i class="el-icon-s-custom">{{loginInfo.userName}}</i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-message-solid"><span @click="gotoPersonCenter()">个人中心</span></el-dropdown-item>
                      <el-dropdown-item icon="el-icon-s-promotion" style="display: block;"><span @click="userLogOut()">登出</span></el-dropdown-item>
                    </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
          </div>
        </el-header>
        <el-container>
          <!-- 侧边栏 -->
          <el-aside :width="isCollapse ? '65px' : '200px'">
            <el-menu
              mode="vertical"
              :collapse="isCollapse"
              hide-timeout="300"
              class="el-menu-vertical-demo"
              default-active="1"
              background-color="rgb(240, 226, 215)"
              text-color="black"
              :router=true
              active-text-color="brown">
              <el-menu-item @click="changeCollapse">
                <h3 v-show="!isCollapse"><i class="el-icon-s-fold"></i></h3>
                <h3 v-show="isCollapse"><i class="el-icon-s-unfold"></i></h3>
              </el-menu-item>
              <el-submenu  v-for="menuItem in menuList" :index="menuItem.perPath" :key="menuItem.id">
                <template slot="title">
                  <i :class="menuItem.perIcon"></i>
                  <span>{{menuItem.perName}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="item in menuItem.children" :index="item.nextPath" :key="item.nextId">{{item.nextName}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-container>
            <!-- 中心 -->
            <el-main>
              <el-card class="bread">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item style="font-weight: bold;">您当前的位置</el-breadcrumb-item>
                  <el-breadcrumb-item v-for="item in breadList" :key="item.path" :to="{path:item.path}" class="breadPice">
                    {{item.meta.title}}
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </el-card>
              <div class="box-main">
                <router-view>
                </router-view>
              </div>
            </el-main>
            <!-- 底部 -->
            <el-footer>
              <h1 style="line-height: 60px;">@CopyRight 2021</h1>
            </el-footer>
          </el-container>
        </el-container>
    </el-container>
  </div>
</template>
<script>
import cookie from 'js-cookie'
import perInfo from '../api/perInfo.js'
import userInfo from '../api/userInfo.js'
export default {
    name: 'App',
    data() {
      return {
        isCollapse:false,
        loginInfo:{},
        menuList:[],
        breadList: []
      }
    },
    methods: {
    //控制侧边栏
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    getUserInfo(){
      var userStr=cookie.get('user_Info')
          if(userStr){
          var userInfo = JSON.parse(userStr)
          this.loginInfo=userInfo
          localStorage.setItem('log_Id',userInfo.id)
        }
    },
    //登出
    userLogOut(){
        cookie.set('user_token','')
        cookie.set('user_Info','')
        userInfo.userLogOut(this.loginInfo)
        .then(responce=>{
          if(responce.code===20000){
              this.$message({
                message: '用户已登出!'
            });
            localStorage.removeItem('log_Id',)
              this.$router.push({
              path: '/'
          })
          }
        })
    },
    getUserMenu(){
      perInfo.getMenuList(this.loginInfo.id)
      .then(responce=>{
        if(responce.code!==20000){
          this.$message({
              type: 'warning',
              message: responce.msg,
          });
        }else{
          this.menuList=responce.data.menuList
        }
      })
    },
    getBreadCrumb(){
          let breadCrumbList=this.$route.matched.filter(item=>item.name)
          this.breadList=breadCrumbList
    },
    //首页
    gotoHome(){
      this.$router.push({
            path: '/home'
        })
    },
    //去往个人中心
    gotoPersonCenter(){
      this.$router.push({
            name: '个人中心',
            params:{
              userId:this.loginInfo.id
            }
        })
    }
    },
    created() {
      //获取用户信息
      this.getUserInfo()
      //动态获取菜单
      this.getUserMenu()
      //获取动态路由导航
      this.getBreadCrumb()
    },
    watch:{
    // 监听路由
    $route(val) {
    //获取路由数组
      this.getBreadCrumb(val);
      }
    }
  }
</script>
<style>
.el-container {
    width: 100% !important;
    height: 100% !important;
}
.main{
    height: 100vh;
}
.el-header{
    background-color: rgb(229, 184, 147);
    color: rgb(45, 50, 53);
    padding: 0px !important;
}
.header-l{
    height: 100%;
    width: 200px;
    display: block;
    float: left;
}
.header-r{
    height: 100%;
    width: 11%;
    display: block;
    float: right;
}
.r-img{
    display: block;
    float: left;
    background-color: steelblue;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    margin: 3px 10px !important;
}
.r-img img{
    width: 100%;
    height: 100%;
    border-radius: 25px;
}
.r-info{
    display: block;
    float: right;
    width: 75px;
    height: 100px;
    margin-right: 15px !important;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.info-sel{
    cursor: pointer;
    line-height: 70px;
    font-size: 15px !important;
}
.el-footer {
    position: relative;
    background-color: rgb(229, 184, 147);
    color: rgb(45, 50, 53);
    padding: 0px !important;
} 
.el-aside {
    text-align: center !important;
}
.el-menu-item-group{
    text-align: center;
    background-color: rgb(241, 204, 156);
}
.el-submenu .el-menu-item{
    max-width: 200px !important;
    text-align: center;
    min-width: 200px !important;
    background-color: rgb(241, 204, 156) !important;
}
.el-submenu .el-menu-item:hover{
  background-color: rgb(216, 211, 211) !important;
}
.el-main {
    background-color: #E9EEF3;
    color: #333;
    padding: 0px;
}
.el-menu-vertical-demo{		
    height: 100%;
    position: relative;
    transition: all 0.1s !important;
}
.bread{
  width: 95%;
  margin: 0px auto;
  padding: 0px !important;
  height: 4%;
}
.box-main{
  width: 100%;
  height: 95%;
}
.el-card__body {
    padding: 7px;
}
.breadPice{
  cursor: pointer;
}
</style>
  