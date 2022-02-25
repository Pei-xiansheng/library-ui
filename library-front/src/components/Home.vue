<template>
    <div class="main">
        <!-- 头部信息 -->
        <div class="header">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
                <el-menu-item @click="gotoWelcome()">
                    <img :src="homeImg" class="homeImg">
                </el-menu-item>
                <el-menu-item index="1-2" @click="gotoCategory()">全部分类</el-menu-item>
                <el-menu-item index="1-5" @click="gotoMapList()">附近图书</el-menu-item>
                <el-submenu index="1-6">
                    <template slot="title">推荐</template>
                        <el-menu-item @click="gotoStoreList()">热门书店</el-menu-item>
                        <el-menu-item @click="gotoArticleList()">书香阁</el-menu-item>
                </el-submenu>
                <el-menu-item index="1-4" @click="gotoChatOnline()">在线寻书</el-menu-item>
                <el-menu-item>
                    <form>
                    <el-autocomplete
                    v-model="searchInfo"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入书名/作者"
                    @select="handleSelect"
                    ></el-autocomplete>
                    <i class="el-icon-search" @click="gotoBookContent()" id="iSearch"></i>
                    </form>
                </el-menu-item>
                <li v-if="!loginInfo.userName" class="open">
                <el-menu-item index="1-7" class="userInfo reg" @click="gotoLogin()">
                    <span>登录&nbsp;/&nbsp;注册</span>
                </el-menu-item>
                </li>
                <li v-if="loginInfo.userName" class="close">
                    <el-menu-item index="1-8" style="float: right;">
                        <el-dropdown>
                            <span id="logName" class="el-dropdown-link">
                            <i class="el-icon-s-custom"></i>{{loginInfo.userName}}
                            </span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item icon="el-icon-message-solid"><span @click="gotoPersonCenter()">个人中心</span></el-dropdown-item>
                              <el-dropdown-item icon="el-icon-s-promotion" style="display: block;"><span @click="userLogOut()">登出</span></el-dropdown-item>
                            </el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                    </el-menu-item>
                    <el-menu-item index="1-8" style="float: right;">
                        <img :src="loginInfo.userAvatar" :alt="loginInfo.userName">
                    </el-menu-item>
                </li>
            </el-menu>
        </div>
        <!-- 主体信息 -->
        <router-view></router-view>
        <div class="footer">
            <div class="footer-left">
                <h1>鹏程书院</h1>
            </div>
            <div class="footer-right">
                <h1>网站导航</h1>
                <div class="r-one">
                    <h1>联系方式</h1>
                    <ul>
                        <li>电话:18272826399</li>
                        <li>邮箱:1641984918@qq.com</li>
                    </ul>
                </div>
                <div class="r-two">
                    <h1>友情链接</h1>
                    <ul>
                        <li>寝室412</li>
                        <li>寝室412</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import cookie from 'js-cookie'
import userInfo from '../api/userInfo.js'
import bookInfo from '../api/bookInfo.js'
export default {
    data() {
        return {
            activeIndex: '1',
            homeImg:'https://edu-guli-apeng.oss-cn-beijing.aliyuncs.com/bookTest/shouye.png',
            loginInfo:{},
            searchInfo:'',
            timeout:null,
            id:'',
            current:1,
        }
    },
    methods: {
    //搜索功能
    querySearchAsync(queryString,cb) {
        clearTimeout(this.timeout);
        var results = []
        if (queryString == ''){
            cb(results);
	        }else{
                bookInfo.getBookInfoList(queryString,this.current)
                .then(responce=>{
                    if(responce.code===20000){
                    var result = responce.data.pageInfo.records
                    for(let i=0;i<result.length;i++){
                        const element = result[i];
                        results.push({
	                    value: element.bookName,
	                    id: i
	                  })
                    }
                    cb(results);
                }else{
                    results = []
	                cb(results);
                }
            })
        }   
    },
    handleSelect(item) {
        this.id = item.id
        this.searchInfo = item.value
    },
    //搜索框
    gotoBookContent(){
        if(!this.searchInfo){
            this.$message({
                type: 'warning',
                message: "请输入书名或作者!"
              });
        }else{
            this.$router.push({
                name:'加载页',
                params:{
                    searchName:this.searchInfo
                }
            })
        }
    },  
    //用户信息
    userLogin(){
        this.$router.push({
            path: '/login'
        })
    },
    userLogOut(){
        cookie.set('user_front_token','')
        cookie.set('user_front_Info','')
        userInfo.userLogOut(this.loginInfo)
        .then(responce=>{
          if(responce.code===20000){
              this.$message({
                message: '用户已登出!'
            });
            localStorage.removeItem('log_Id',)
              this.$router.push({
              path: '/login'
          })
          }
        })
    },
    getUserInfo(){
        var userStr=cookie.get('user_front_Info')
            if(userStr){
            var userInfo = JSON.parse(userStr)
            this.loginInfo=userInfo
            //将用户ID存入localStorage
            localStorage.setItem('logId',this.loginInfo.id)
        }
    },
    //去往地图
    gotoMapList(){
        this.$router.push({
            path: '/mapList'
        })
    },
    //去往首页
    gotoWelcome(){
        this.$router.push({
            path: '/'
        })
    },
    //去往寻书
    gotoChatOnline(){
        this.$router.push({
            path: '/chatOnline'
        })
    },
    //去往热门书店
    gotoStoreList(){
        this.$router.push({
            path: '/storeList'
        })
    },
    //去往书贴列表
    gotoArticleList(){
        this.$router.push({
        path: '/articleList',
    })
    },
    //去往登录或注册
    gotoLogin(){
        this.$router.push({
            path: '/login'
        })
    },
    //去往全部分类
    gotoCategory(){
        this.$router.push({
            path: '/category',
        })
    },
    //去往个人中心
    gotoPersonCenter(){
        this.$router.push({
            path: '/personCenter',
        })
    }
    },
    created() {
        this.getUserInfo()
    },
}
</script>
<style>
.main{
    width: 100%;
}
a{
    text-decoration: none;
}
li{
    list-style: none;
}
.homeImg{
    width: 300px;
    height: 100%;
    display: block;
    margin-left: 0px;
}
.userInfo{
    float: right !important;
}
.reg{
    margin-right: 20px !important;
}
.header{
    width: 100%;
    /* position: fixed; */
}
.close :nth-child(2)>img{
    display: block;
    float: right; 
    width: 45px;
    height: 45px;
    border-radius: 25px;
    margin-top: 5px;
}
#logName{
    display: block;
    width: 90px;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.header /deep/ .el-menu-item:hover{
    border-bottom: salmon 2px solid;
}
.footer{
    width: 100%;
    height: 200px;
    margin-top: 20px;
    display: block;
    float: left;
    border-top: #999 2px solid;
}
.footer-left{
    display: block;
    width: 40%;
    height: 200px;
    float: left;
    /* border: springgreen 1px solid; */
}
.footer-left>h1{
    text-align: center;
    margin: 20px;
}
.footer-right{
    display: block;
    width: 58%;
    height: 200px;
    float: right;
    /* border: solid 1px sienna; */
}
.footer-right>h1{
    text-align: left;
    margin: 20px;
    /* border-bottom: firebrick dashed 1px; */
}
.r-one{
    display: block;
    float: left;
    width: 30%;
    height: 80px;
    text-align: left;
    margin: 10px 20px;
    color: #999;
    /* border: sienna 1px solid; */
}
.r-two{
    display: block;
    float: left;
    width: 30%;
    height: 80px;
    text-align: left;
    margin: 10px 20px;
    color: #999;
    /* border: sienna 1px solid; */
}
.el-autocomplete{
    width: 360px;
    margin-bottom: 10px;
}
.el-autocomplete:focus{
    outline: none !important;
}
#iSearch{
    margin-bottom: 10px;
    color: rgb(229, 182, 182); 
    margin-left: 5px;
    background-color: #E9EEF3; 
    border: 1px solid rgb(238, 214, 214);
    width: 65px;
    height: 38px;
    font-size: 35px;
    border-radius: 10px;
}
</style>