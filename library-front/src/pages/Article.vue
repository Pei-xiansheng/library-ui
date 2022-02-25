<template>
    <div class="main">
        <div class="art-header">
            <div class="art-hd-info">
                <img :src="articleDetail.userAvatar" :alt="articleDetail.userName">
                <div class="art-hd-con">
                    <h1>{{articleDetail.userName}}</h1>
                    <p>吹过昨天的风!</p>
                </div>
            </div>
            <div class="art-box">
                <div class="art-box-hd">
                    <h1>{{articleDetail.artTitle}}</h1>
                    <p>时间:{{articleDetail.artTime}} 阅读:{{articleDetail.artSee}}</p>
                </div>
                <div id="aoli" class="art-box-con" v-html="articleDetail.artContent">
                </div>
                <div class="component">
                    <div class="com-hd">
                        <h1>精选评论</h1>
                    </div>
                    <div class="com-write">
                        <img src="../images/boy.jpg" alt="">
                        <a v-if="!isWrite" @click="changeWriteStatus()">写评论...</a>
                        <div v-if="isWrite" class="write-con">
                            <textarea v-model="comContent.text"></textarea>
                            <el-button type="primary" class="btn" @click="submitCom()">发表</el-button>
                        </div>
                    </div>
                    <div class="com-list">
                        <ul>
                            <li class="com-item" v-for="comItem in componentList" :key="comItem.id">
                                <img :src="comItem.userAvatar" alt="">
                                <div class="com-info">
                                    <h1>{{comItem.userName}}</h1>
                                    <p>{{comItem.comContent}}</p>
                                    <i class="el-icon-thumb"><span style="font-size: 18px;">{{comItem.comClick}}</span></i>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="pg">
                        <el-pagination
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next, total"
                        :total="total" 
                        :page-size="limit"
                        :current-page="current">
                      </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import bookInfo from '../api/bookInfo.js'
import cookie from 'js-cookie'
export default {
    data() {
        return {
            isWrite:false,
            artId:'',
            articleDetail:{},
            componentList:[],
            comContent:{
                artId:'',
                userId:'',
                text:''
            },
            current: 1, //当前页
            limit:4,
            total: 0, //总记录数
        }
    },
    methods: {
        //写评论
        changeWriteStatus(){
            this.isWrite=!this.isWrite
        },
        //获取文章内容
        getArticleDetail(){
            if(this.$route.params.id!==undefined){
                localStorage.setItem('artId',this.$route.params.id)
            }
            var ad = localStorage.getItem('artId')
            this.getComponentList()
            bookInfo.getArticleDetail(ad)
            .then(responce=>{
                if(responce.code===20000){
                    this.articleDetail=responce.data.article
                }else{
                    console.log('未获取到文章详情!')
                }
            })  
        },
        //获取评论列表
        getComponentList(){
            var ad = localStorage.getItem('artId')
            bookInfo.getComponentList(ad,this.current)
            .then(responce=>{
                if(responce.code===20000){
                    this.componentList=responce.data.pageInfo.records
                    this.total=responce.data.pageInfo.total
                }else{
                    console.log('未获取到文章评论详情!')
                }
            })
        },
        //发表评论
        submitCom(){
            //文章Id和用户Id
            this.comContent.artId=localStorage.getItem('artId')
            this.comContent.userId=localStorage.getItem('logId')
            if(!this.comContent.text||this.comContent.text.trim()===""){
                this.$message({
                type:'warning',
                message:'请填写评论内容!'
            })
            }else{
            bookInfo.submitCom(this.comContent)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type: 'success',
                    message: '评论成功!'
                });
                this.comContent.text=''
                this.getComponentList()
                }else{
                    this.$message({
                    type: 'warning',
                    message: '评论失败!'
                });
                }
            })
            }
        },
        //当前分页
        handleCurrentChange(val){
            this.current = val
            //获取用户点击的当前页后刷新页面数据
            this.getComponentList()
        },
    },
    created() {
        this.getArticleDetail()
    },
}
</script>
<style scoped>
a{
    text-decoration: none;
}
li{
    list-style: none;
}
.main{
    width: 100%;
    /* height: 2200px; */
}
.art-header{
    width: 100%;
    height: 100px;
    /* border: thistle 1px solid; */
}
.art-hd-info{
    width: 60%;
    height: 80px;
    margin: 10px auto;
    border-bottom: thistle 3px solid;
}
.art-hd-info img{
    width: 60px;
    height: 60px;
    margin: 10px 20px;
    border-radius: 30px;
    display: block;
    float: left;
}
.art-hd-con{
    display: block;
    float: left;
    width: 80%;
    height: 60px;
    margin: 10px 30px;
    /* border: steelblue 1px solid; */
}
.art-hd-con h1{
    font-size: 20px;
    font-weight: 520;
    text-align: left;
}
.art-hd-con p{
    font-size: 18px;
    font-weight: 500;
    color: #999;
    text-align: left;
}
.art-box-hd{
    width: 60%;
    height: 100px;
    margin: 10px auto;
    /*border: thistle 1px solid;*/
}
.art-box-hd h1{
    font-size: 36px;
    font-weight: 400;
    text-align: left;
    margin: 5px 0px 15px 0px;
}
.art-box-hd p{
    font-size: 18px;
    color: #999;
    text-align: left;
}
.art-box-con{
    width: 60%;
    margin: 20px auto;
    font-size: 20px;
    text-align: left;
    /*border: thistle 1px solid;*/
}
.art-box-con>p{
    width: 60%;
    height: 40px !important;
    border: darkkhaki;
}
.component{
    width: 60%;
    margin: 10px auto;
    /* border: thistle 1px solid; */
}
.com-hd{
    border-bottom: thistle 1px solid;
}
.com-hd h1{
    width: 10%;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    padding-left: 10px;
    font-weight: 600;
    text-align: left;
    border-bottom:saddlebrown solid 2px ;
}
.com-write{
    display: block;
    float: left;
    width: 100%;
    /* border: thistle 1px solid; */
}
.com-write img{
    width: 60px;
    height: 60px;
    border-radius: 30px;
    display: block;
    margin: 10px;
    float: left;
}
.com-write a{
    display: block;
    float: left;
    font-size: 18px;
    color: slategrey;
    font-style: italic;
    margin: 25px 20px;
}
.write-con{
    display: block;
    float: left;
    width: 80%;
    height: 160px;
    margin: 10px 20px;
    position: relative;
    border: thistle 1px solid;
}
.write-con textarea{
    width: 90%;
    height: 100px;
    margin: 15px 15px 5px 15px;
    background: transparent;
    background-color: rgb(250, 247, 245);
    font-size: 18px;
    color: brown;
    outline: none;
    border: none;
    resize: none;
}
.btn{
    width: 70px;
    height: 35px;
    text-align: center;
    position: absolute;
    bottom: 5px;
    right: 5px;
}
.com-list{
    width: 100%;
    margin: 10px auto;
    font-size: 50px;
    display: block;
    float: left;
    /* border: thistle 1px solid; */
}
.pg{
    width: 100%;
    display: block;
    float: left;
    margin: 10px auto;
    /* border: thistle 1px solid; */
}
.pg /deep/ .el-pager .number,.el-icon{
    font-size: 18px;
}
.com-item{
    width: 100%;
    /* height: 160px; */
    margin: 10px auto 0px auto;
    display: block;
    float: left;
    /* border: thistle 1px solid; */
}
.com-item img{
    width: 60px;
    height: 60px;
    border-radius: 30px;
    display: block;
    float: left;
    margin: 5px;
}
.com-info{
    width: 90%;
    /* height: 130px; */
    display: block;
    float: left;
    margin: 20px 5px;
    position: relative;
    border-left: thistle 2px solid;
}
.com-info h1{
    width: 100%;
    height: 20px;
    font-size: 18px;
    font-weight: 600;
    margin: 0px;
    padding-left: 10px;
    /* border: thistle 1px solid; */
}
.com-info p{
    width: 100%;
    /* height: 86px; */
    font-size: 16px;
    margin: 6px auto;
    padding-left: 10px;
    text-align: left;
    text-indent: 2em;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    letter-spacing: 1px;
    line-height: 25px;
    /* border: thistle 1px solid; */
}
.com-info>i{
    width: 3%;
    margin: 5px;
    display: block;
    font-size: 20px;
    cursor: pointer;
    /* border: thistle 1px solid; */
}
</style>