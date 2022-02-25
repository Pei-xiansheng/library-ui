<template>
    <!-- 主体信息 -->
    <div class="center">
        <el-row class="main-row">
            <el-col :span="18" class="left-box">
                <el-card class="banner-card">
                    <el-carousel :interval="4000" type="card" height="280px">
                        <el-carousel-item v-for="bannerItem in bannerList" :key="bannerItem.bannerId">
                            <img :src="bannerItem.bannerImg" :alt="bannerItem.bannerName" style="
                            width:100%;
                            height:100%;
                            background-repeat: no-repeat;">
                        </el-carousel-item>
                    </el-carousel> 
                </el-card>
                <div class="book-card">
                    <el-card class="rank-card">
                        <div class="rank-title">
                            <h1>热度排行榜</h1>
                        </div>
                        <div class="rank-list">
                            <ul>
                                <li v-for="(rankItem,index) in rankList" :key="rankItem.id" @click="gotoBookDetail(rankItem)">
                                    <span>{{index+1}}</span>
                                    <span>{{rankItem.bookName}}</span>
                                    <span>{{rankItem.seeNum}}</span>
                                </li>
                            </ul>
                        </div>
                    </el-card>
                    <el-card class="list-card">
                        <div class="re-title">
                            <h1>图书推荐榜</h1>
                        </div>
                        <div class="re-list">
                            <ul>
                                <li class="re-item" v-for="recItem in recList" :key="recItem.id"  @click="gotoBookDetail(recItem)">
                                    <img :src="recItem.bookAvatar" :alt="recItem.bookName">
                                    <div class="re-con">
                                        <h1>{{recItem.bookName}}</h1>
                                        <p>作者:{{recItem.author}}</p>
                                        <p>{{recItem.bookIntro}}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </el-card>
                </div>
                <el-card class="brown-card">
                    <div class="brown-title">
                        <h1>精品借阅榜</h1>
                        <p>每一次借到的都是最爱的!</p>
                    </div>
                    <div class="brown-list">
                        <ul>
                            <li class="brown-item" v-for="broItem in broList" :key="broItem.id" @click="gotoBookDetail(broItem)">
                                <div>
                                    <img :src="broItem.bookAvatar" :alt="broItem.bookName">
                                </div>
                                <div class="brown-info">
                                    <h1>{{broItem.bookName}}</h1>
                                    <p class="brown-address">书店:{{broItem.storeName}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-card>
                <el-card class="circle-card">
                    <div class="circle-title">
                        <h1>推荐书贴</h1>
                        <a @click="gotoArticle()"><span>更多</i></span><i class="el-icon-arrow-right"></i></a>
                    </div>
                    <div class="circle-info">
                        <ul>
                            <li class="circle-item" v-for="artItem in articleList" :key="artItem.id" @click="gotoArticle(artItem)">
                                <img :src="artItem.artImg" :alt="artItem.artTitle">
                                <div class="item-info">
                                    <h1>【{{artItem.artTitle}}】</h1>
                                    <p>{{artItem.artContent}}</p>
                                    <span>{{artItem.artTime}} 阅读:{{artItem.artSee}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6" class="right-box">
                <el-card class="notice-card">
                    <div class="notice">
                        <div class="no-header">
                            <h1>书院最新公告</h1>
                            <a @click="goToPostDetail()"><span>历史公告</span><i class="el-icon-arrow-right"></i></a>
                        </div>
                        <div class="no-content">
                            <ul>
                                <li @click="goToPostDetail(postItem)" v-for="postItem in postList" :key="postItem.id">
                                    <div class="no-item">
                                        <h1>{{postItem.postTitle}}</h1>
                                        <div class="no-con">
                                            <p>{{postItem.postContent}}</p>
                                            <span><i class="el-icon-view"></i><span style="font-size: 15px;text-align: right;">&nbsp; 阅读:{{postItem.postSee}}</span></span>
                                        </div>
                                    </div>
                                </li>   
                            </ul>
                        </div>
                    </div>
                </el-card>
                <el-card class="store-card">
                    <div class="store-title">
                        <i class="el-icon-sunny"></i><h1>书友探店</h1>
                    </div>
                    <div class="store-list">
                        <ul>
                            <li class="store-item" v-for="stoItem in storeList" :key="stoItem.id" @click="gotoStoreDetail(stoItem)">
                                <div class="store-info">
                                    <h1>{{stoItem.storeName}}</h1>
                                    <span>推荐理由:</span>
                                    <p class="store-con">{{stoItem.recReason}}</p>
                                </div>
                                <div class="store-img">
                                    <img :src="stoItem.stoImg" :alt="stoItem.storeName">
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-card>
                <el-card class="comment-card">
                    <div class="comment-title">
                        <h1>书友论</h1><i class="el-icon-ship"></i>
                    </div>
                    <div class="comment-list">
                        <ul>
                            <li class="comment-item" v-for="comItem in ComponentList" :key="comItem.id">
                                <img :src="comItem.userAvatar" alt="comItem.userName">
                                <div class="com-info">
                                    <h1>笔名:{{comItem.userName}}</h1>
                                    <p>评论:{{comItem.comContent}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import bookInfo from '../api/bookInfo.js'
export default {
    data() {
        return {
            value: 3.7,//评分
            bannerList:[],
            postList:[],
            articleList:[],
            ComponentList:[],
            storeList:[],
            rankList:[],
            broList:[],
            recList:[],
            currentNum:1,
            current:1,
            queryForm:{//文章查询条件
                current:1,
                hot:true,
            }
        }
    },
    methods: {
        //获取轮播图
        getBannerList(){
            bookInfo.getBannerList()
            .then(responce=>{
                if(responce.code===20000){
                    this.bannerList=responce.data.bannerList
                }else{
                    console.log('获取轮播图失败!')
                }
            })
        },
        //获取公告列表
        getPostList(){
            bookInfo.getPostList()
            .then(responce=>{
                this.postList=responce.data.postList
            })
        },
        //去往公告详情
        goToPostDetail(postItem){
            if(postItem!==undefined){
                this.$router.push({
                name: '公告页',
                params:{
                    title:postItem.postTitle,
                    content:postItem.postContent
                }
            })
            bookInfo.increaSeeNum(postItem.id)
            .then(responce=>{
                
            })
            }else{
                this.$router.push({
                path: '/postDetail',
            })
            }
        },
        //去往文章页面
        gotoArticle(item){
            if(item!==undefined){
                this.$router.push({
                name: '书贴',
                params:{
                    id:item.id
                }
            })
            }else{
                this.$router.push({
                path: '/articleList',
            })
            }
        },
        //获取文章列表
        getArticleList(){
            bookInfo.getArticleList(this.queryForm)
            .then(responce=>{
                if(responce.code===20000){
                    this.articleList=responce.data.pageInfo.records
                }else{
                    console.log(responce.msg)
                }
            })
        },
        //获取图书推荐
        getBookList(){
            bookInfo.getBookList()
            .then(responce=>{
                this.rankList=responce.data.mapList.rankList
                this.recList=responce.data.mapList.recList
                this.broList=responce.data.mapList.broList
            })
        },
        //获取最热评论
        getHotComponentList(){
            bookInfo.getHotComponentList()
            .then(responce=>{
                this.ComponentList=responce.data.comList
            })
        },
        //获取最热店铺列表
        getHotStoreList(){
            bookInfo.getHotStoreList(this.currentNum)
            .then(responce=>{
                this.storeList=responce.data.pageInfo.records
            })
        },
        //去往店铺详情
        gotoStoreDetail(item){
            this.$router.push({
                name: '书店详情',
                params:{
                    id:item.id
                }
            })
        },
        //去往图书详情
        gotoBookDetail(item){
            this.$router.push({
            name: '图书借阅',
            params:{
                id:item.id
            }
        })
        },
        //查看是否有还书提示
        checkBackTips(){
            bookInfo.checkBackTips(localStorage.getItem('logId'),this.current)
            .then(responce=>{
                if(responce.data.pageInfo.records!==null){
                    const h = this.$createElement;
                    this.$notify({
                    title: '用户还书提示',
                    message: h('i', { style: 'color: #999;'}, responce.data.pageInfo.records[0].msgBody),
                    offset: 50
                    });
                }
            })
        },
    },
    created() {
        this.getBannerList()
        this.getBookList()
        this.getPostList()
        this.getArticleList()
        this.getHotComponentList()
        this.getHotStoreList()
        this.checkBackTips()
    },
}
</script>
<style>
a{
    text-decoration: none;
    cursor: pointer;
}
li{
    list-style: none;
}
.center{
    width: 100%;
    /* border: 1px solid rebeccapurple; */
    margin-top: 20px;
}
.main-row{
    width: 100%;
    /* border: darksalmon 1px solid; */
}
.banner-card {
    width: 100%;
}
.el-card__body{
    padding: 0px;
}
.left-box{
    margin-left: 3%;
    width: 65%;
    /* border: rebeccapurple 1px solid; */
}
.right-box{
    margin-right: 3%;
    margin-left: 1%;
    width: 28%;
    /* border: springgreen 1px solid; */
}
.notice-card{
    width: 100%;
    height: 400px;
}
.notice{
    width: 88%;
    height: 380px;
    /* border: 1px rgb(10, 0, 100) solid; */
    margin: 10px 6%;
}
.no-header{
    width: 100%;
    height: 60px;
    display: block;
    border-bottom: #999 2px solid;
}
.no-header>h1{
    display: block;
    width: 65%;
    height: 60px;
    line-height: 60px;
    float: left;
    text-align: left;
    /* border: 1px solid hotpink; */
}
.no-header>a{
    display: block;
    width: 30%;
    height: 60px;
    line-height: 60px;
    float: right;
    font-size: 18px;
    color: rgb(175, 168, 168);
    /* border: 1px solid hotpink; */
}
.no-content{
    width: 100%;
    height: 315px;
    overflow: hidden;
    /* border: 1px solid gold; */
}
.no-content>ul>li{
    display: list-item;
    width: 98%;
    height: 72px;
    margin-top: 5px;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.3s;
    background-color: rgb(250, 249, 249);
    /* border: gray 1px solid;  */
}
.no-content>ul>li:hover{
    transform: scale(1.05);
}
.no-item>h1{
    font-size: 15px;
    text-align: left;
    padding-left: 10px;
    color: darksalmon;
    /* border: tan 1px solid; */
}
.no-con>p{
    display: block;
    height: 30px;
    font-size: 15px;
    line-height: 30px;
    text-indent: 2em;
    font-style: italic;
    /* border: steelblue 1px solid; */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.no-con>span{
    float: right;
    color: sienna;
    width: 50%;
    margin-right: 10px;
    overflow: hidden;
    /* border: springgreen 1px solid; */
}
.no-con>span>i{
    color: indianred;
}
.store-card{
    width: 100%;
    height: 760px;
    margin-top: 20px;
}
.store-title{
    height: 50px;
    width: 90%;
    margin: 5px auto;
    border-bottom: 3px solid #999;
}
.store-title>h1{
    width: 45%;
    height: 40px;
    line-height: 40px;
    display: block;
    float: right;
    margin-right: 30px;
    border-left: 3px solid firebrick;
}
.store-title>i{
    width: 10%;
    display: block;
    float: left;
    font-size: 45px;
    animation-name: sun;
    animation-duration: 2s;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    /* border: firebrick 1px solid; */
}
@keyframes sun{
    0%{
        margin-left: 0px;
    }

    100%{
        margin-left: 120px;
    }
}
.book-card{
    width: 100%;
    height: 500px;
    margin-top: 20px;
    position: relative;
    /* border: indianred 1px solid; */
}
.rank-card{
    width: 32%;
    height: 500px;
    position: absolute;
    top: 0px;
    left: 0px;
}
.rank-title{
    height: 50px;
    width: 90%;
    margin: 0px auto;
    border-bottom: 3px solid #999;
}
.rank-title>h1{
    width: 90%;
    height: 40px;
    line-height: 40px;
    margin: 5px auto;
    border-left: 5px solid sandybrown;
    text-align: left;
    padding-left: 20px;
}
.rank-list{
    width: 90%;
    margin: 0px auto;
}
.rank-list ul{
    overflow: hidden;
}
.rank-list ul li{
    display: list-item;
    width: 99%;
    height: 40px;
    line-height: 40px;
    text-align: left;
    margin: 3px 0px;
    cursor: pointer;
    transition: 0.3s;
    border-bottom: 1px sandybrown solid;
}
.rank-list ul li:hover{
    transform: scale(1.1);
    background-color: rgb(250, 241, 229);
}
.rank-list ul li span{
    height: 40px;
    float: left;
    font-style: italic;
    /* border: 1px solid sienna; */
}
.rank-list ul li span:nth-child(2){
    display: block;
    width: 65%;
    height: 40px;
    color: sienna;
    line-height: 40px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* border: 1px solid sienna; */
}
.rank-list ul li span{
    margin-left: 15px;
}
.brown-card{
    width: 100%;
    height: 500px;
    margin-top: 20px;
}
.brown-title{
    height: 50px;
    width: 90%;
    margin: 0px auto;
    border-bottom: 3px solid #999;
}
.brown-title>h1{
    width: 30%;
    height: 40px;
    line-height: 40px;
    margin: 5px 50px;
    display: inline-block;
    border-left: 5px solid sandybrown;
    text-align: left;
    padding-left: 20px;
}
.brown-title>p{
    display: inline-block;
    width: 30%;
    font-size: 20px;
    font-weight: 400;
    font-style: italic;
    text-shadow: 2px 2px 2px #999;
    color: darkred;
    /* border: springgreen 1px solid; */
}
.brown-item{
    display: list-item;
    float: left;
    width: 15%;
    height: 200px;
    margin:  10px 8px;
    box-shadow: 0px 0px 3px 3px rgb(255, 240, 230);
    cursor: pointer;
    /* border-bottom: 1px sandybrown solid; */
}
.brown-item img{
    width: 95%;
    height: 150px;
    transition: 0.3s;
}
.brown-item img:hover{
    transform: scale(1.05);
}

.brown-info h1{
    font-size: 14px;
    font-weight: 400;
    width: 100%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* border: darkmagenta 1px solid; */
}
.brown-info p:nth-child(2){
    font-size: 13px;
    color: rgb(245, 189, 189);
    text-align: left;
    width: 100%;
    display: inline-block;  
    margin-left: 5px;
    /* border: 1px solid darkmagenta; */
}

.circle-card{
    width: 100%;
    height: 900px;
    margin-top: 20px;
}
.circle-title{
    position: relative;
    text-align: right;
    width: 95%;
    margin: 0px auto;
    border: cadetblue 2px dashed;
}
.circle-title>h1{
    width: 65%;
    height: 60px;
    line-height: 60px;
    text-align: left;
    font-size: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: absolute;
    top: 0px;
    left: 100px;
    /* border: 1px solid hotpink; */
}
.circle-title>a{
    width: 30%;
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    margin-right: 100px;
    color: rgb(175, 168, 168);
    cursor: pointer;
    /* border: 1px solid hotpink; */
}
.circle-item{
    width: 95%;
    height: 200px;
    margin: 10px auto;
    cursor: pointer;
    border-bottom: #999 2px solid;
}
.circle-item img{
    width: 160px;
    height: 160px;
    margin: 10px 0px;
    display: block;
    float: left;
}
.item-info{
    width: 76%;
    display: block;
    float: left;
    margin: 8px 18px;
    padding-left: 10px;
    text-align: left;
    border-left:  3px double #999;
}
.item-info h1{
    font-size: 18px;
}
.item-info p{
    width: 100%;
    height: 76px;
    margin: 10px 0px;
    font-size: 18px;
    font-weight: 500;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
.item-info span{
    font-size: 18px;
    color: #999;
    margin-left: 400px;
}
.list-card{
    width: 66%;
    height: 500px;
    position: absolute;
    top: 0px;
    right: 0px;
}
.re-title{
    height: 50px;
    width: 90%;
    margin: 0px auto;
    border-bottom: 3px solid #999;
}
.re-title>h1{
    width: 90%;
    height: 40px;
    line-height: 40px;
    margin: 5px auto;
    padding-left: 20px;
    border-left: 5px solid sandybrown;
    text-align: left;
}
.re-list{
    width: 95%;
    height: 430px;
    margin: 5px auto;
    /* border: 1px sienna solid;   */
}
.re-item{
    width: 45%;
    height: 200px;
    margin: 8px 10px;
    display: list-item;
    float: left;
    cursor: pointer;
    border-bottom: rgb(216, 109, 48) 2px solid;
}
.re-item img{
    width: 45%;
    height: 180px;
    display: block;
    float: left;
    margin: 10px;
    transition: 0.8s;
}
.re-item img:hover{
    transform: scale(1.1);
}
.re-con{
    width: 45%;
    display: block;
    float: left;
    text-align: left;
    /* border: springgreen 1px solid; */
}
.re-con h1{
    margin-top: 20px;
    font-size: 20px;
    font-weight: 400;
    color: #262626;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.re-con p:nth-child(2){
    font-size: 15px;
    color: #999;
    margin: 5px 0px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.re-con p:nth-child(3){
    width: 100%;
    height: 110px;
    font-size: 13.5px;
    text-indent: 2em;
    /* word-wrap: break-word; */
    overflow: hidden;
    /* white-space: nowrap; */
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
}
.store-item{
    width: 100%;
    height: 150px;
    margin-top: 20px;
    display: list-item;
    cursor: pointer;
    /* border: 1px solid darksalmon; */
}
.store-info{
    width: 55%;
    height: 150px;
    display: block;
    float: left;
    margin: 0px 10px;
    text-align: left;
    border-bottom: rgb(226, 149, 123) 2px solid;
}
.store-info h1{
    text-align: left;
    font-size: 20px;
    font-style: italic;
    /* border-bottom: 2px dashed firebrick; */
}
.store-info span{
    font-size: 15px;
    font-weight: 600;
    color:rgb(219, 172, 163);
}
.store-con{
    width: 100% !important;
    height: 78px;
    /* border: solid 1px springgreen; */
    font-size: 15px;
    font-style: italic;
    text-indent: 2em;
    color: #999;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
}
.star{
    display: inline-block;
    margin: 5px 10px;
    /* border: springgreen 1px solid; */
}
.store-img{
    width: 35%;
    height: 135px;
    display: block;
    float: left;
    margin: 5px 5px;
    /* border: palegreen 1px solid; */
}
.store-img img{
    width: 100%;
    height: 100%;
}
.comment-card{
    width: 100%;
    height: 600px;
    margin-top: 20px;
}
.comment-title{
    height: 50px;
    width: 90%;
    margin: 5px auto;
    border-bottom: 3px solid #999;
}
.comment-title>h1{
    width: 45%;
    height: 40px;
    line-height: 40px;
    display: block;
    float: left;
    margin-right: 30px;
    border-right: 3px solid firebrick;
}
.comment-title>i{
    width: 10%;
    display: block;
    float: right;
    font-size: 45px;
    animation-name: book;
    animation-duration: 2s;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    /* border: firebrick 1px solid; */
}
@keyframes book{
    0%{
        margin-right: 0px;
    }
    100%{
        margin-right: 120px;
    }
}
.comment-list{
    width: 90%;
    height: 500px;
    margin: 20px auto;
    /* border: 1px solid sienna; */
}
.comment-item{
    width: 100%;
    height: 120px;
    /* margin-bottom: 10px; */
    border-bottom: 3px solid sienna;
}
.comment-item img{
    display: block;
    float: left;
    width: 25%;
    height: 95px;
    margin: 10px;
    border-radius: 45px;
    transition: 2s;
}
.comment-item img:hover{
    transform: rotateY(360deg);
}
.com-info{
    width: 60%;
    display: block;
    float: left;
    text-align: left;
    /* border: sienna 1px solid; */
}
.com-info h1{
    font-size: 20px;
    font-weight: 500;
    margin: 10px 0px;
    padding-bottom: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* border-bottom: 2px sienna double; */
}
.com-info p{
    width: 100%;
    height: 45px;
    font-size: 16px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    /* border: firebrick 1px solid; */
}
</style>