<template>
    <div class="main">
        <div class="art-header">
            <div class="art-box">
                <div class="art-box-hd">
                    <h1>{{storeDetail.storeName}}</h1>
                    <p>推荐指数:<el-rate
                        v-model="value"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}" class="star">
                    </el-rate>
                    </p>
                    <p>地址:{{storeDetail.address}}<span @click="gotoMap()">立即查询</span></p>
                </div>
                <div class="art-img">
                    <img :src="storeDetail.stoImg" :alt="storeDetail.storeName">
                </div>
                <div id="aoli" class="art-box-con" v-html="storeDetail.recReason">
                </div>
                <div class="component">
                    <div class="com-hd">
                        <h1>精选评论</h1>
                    </div>
                    <div class="com-write">
                        <img src="../images/boy.jpg" alt="">
                        <a v-if="!isWrite" @click="changeWriteStatus()">写评论...</a>
                        <div v-if="isWrite" class="write-con">
                            <textarea v-model="stoContent.text"></textarea>
                            <el-button type="primary" class="btn" @click="submitStoCom()">发表</el-button>
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
            stoId:'',
            value:3.6,
            storeDetail:{},
            componentList:[],
            stoContent:{
                stoId:'',
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
        //获取店铺内容
        getStoreDetail(){
            if(this.$route.params.id!==undefined){
                localStorage.setItem('stoId',this.$route.params.id)
            }
            var id = localStorage.getItem('stoId')
            this.getStoComponentList()
            bookInfo.getStoreDetail(id)
            .then(responce=>{
                if(responce.code===20000){
                    this.storeDetail=responce.data.store
                    this.value=responce.data.store.recStar
                }else{
                    console.log('未获取到店铺详情!')
                }
            })  
        },
        //获取评论列表
        getStoComponentList(){
            var id = localStorage.getItem('stoId')
            bookInfo.getStoComponentList(id,this.current)
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
        submitStoCom(){
            //店铺Id和用户Id
            this.stoContent.stoId=localStorage.getItem('stoId')
            this.stoContent.userId=localStorage.getItem('logId')
            if(!this.stoContent.text||this.stoContent.text.trim()===""){
                this.$message({
                type:'warning',
                message:'请填写评论内容!'
            })
            }else{
            bookInfo.submitStoCom(this.stoContent)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type: 'success',
                    message: '评论成功!'
                });
                this.stoContent.text=''
                this.getStoComponentList()
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
            this.getStoComponentList()
        },
        //去往地图页
        gotoMap(){
            this.$router.push({
            path: '/mapList'
        })
        }
    },
    created() {
        this.getStoreDetail()
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
.art-box-hd{
    width: 60%;
    height: 150px;
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
    height: 30px;
    color: #999;
    text-align: left;
    margin: 10px auto;
}
.art-box-hd p span{
    float:right;
    color: salmon;
    cursor: pointer;
}
.art-box-hd p span:hover{
    color: saddlebrown;
}
.art-img{
    width: 60%;
    height: 360px;
    margin: 10px auto;
}
.art-img img{
    width: 100%;
    height: 360px;   
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