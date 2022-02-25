<template>
    <div class="main">
        <div class="brown-book-info">
            <div class="bk-img"><img :src="bookDetail.bookAvatar" :alt="bookDetail.bookName"></div>
            <div class="bk-info">
                <h1>{{bookDetail.bookName}}</h1>
                <div class="bk-intro">
                    <p>作者:&nbsp;&nbsp; {{bookDetail.author}} <span style="margin-left: 100px;">类别:&nbsp;&nbsp; {{bookDetail.bookCat}}</span></p>
                    <p class="intro">简介:&nbsp;&nbsp; {{bookDetail.bookIntro}}</p>
                    <p>被借次数:&nbsp;&nbsp; {{bookDetail.brownNum}}</p>
                    <div class="sto-dre">
                        <span>书店:&nbsp;&nbsp; {{bookDetail.storeName}}</span>
                        <img :src="bookDetail.stoImg" :alt="bookDetail.storeName" class="sto-img">
                    </div>
                </div>
            </div>
        </div>
        <div class="brown-table">
            <h1>借阅星愿单</h1>
            <div class="table-info">
                <el-form :inline="true" :model="starForm" class="demo-form-inline">
                    <el-form-item label="选择借阅时间">
                        <el-date-picker
                            v-model="starForm.brownTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="选择归还时间">
                        <el-date-picker
                            v-model="starForm.brownBackTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <div v-if="starForm.brownTime!=null&&starForm.brownBackTime!=null">
                    <table class="starInfo">
                        <tr>
                            <th>借阅人</th>
                            <th>借阅书籍</th>
                            <th>借阅时间</th>
                            <th>归还时间</th>
                            <th>登记书店</th>
                        </tr>
                        <tr>
                            <td>{{loginInfo.userName}}</td>
                            <td>{{bookDetail.bookName}}</td>
                            <td>{{starForm.brownTime}}</td>
                            <td>{{starForm.brownBackTime}}</td>
                            <td>{{bookDetail.storeName}}</td>
                        </tr>
                    </table>
                    <el-button class="bro-btn" @click="submitBrownInfo()">预约借阅</el-button>
                </div>
            </div>
        </div>
        <div class="com-box-center">
            <div class="component">
                <div class="com-cen-hd">
                    <h3>精选评论</h3>
                </div>
                <div class="com-write">
                    <img src="../images/boy.jpg" alt="">
                    <a v-if="!isWrite" @click="changeWriteStatus()">写评论...</a>
                    <div v-if="isWrite" class="write-con">
                        <textarea v-model="bookContent.text"></textarea>
                        <el-button type="primary" class="btn" @click="submitBookCom()">发表</el-button>
                    </div>
                </div>
                <div class="com-list">
                    <ul>
                        <li class="com-item" v-for="comItem in componentList" :key="comItem.id">
                            <img :src="comItem.userAvatar" :alt="comItem.userName">
                            <div class="com-info">
                                <h1>{{comItem.userName}}</h1>
                                <p>{{comItem.comContent}}</p>
                                <i class="el-icon-thumb" @click="userClick(comItem)"><span style="font-size: 18px;margin-left: 10px;">{{comItem.comClick}}</span></i><i class="el-icon-chat-line-round" style="float: right;font-size: 18px;" @click="changeBackStatus(comItem)"><span style="margin-left: 10px;">回复</span></i>
                            </div>
                            <!-- <div v-if="isBack" class="write-back-con">
                                <textarea v-model="bookContent.text"></textarea>
                                <el-button type="primary" class="btn" @click="submitBookCom(comItem)">发表</el-button>
                            </div> -->
                            <el-dialog :title="title" :visible.sync="dialogFormVisible">
                                <el-form :model="bookContent">
                                    <el-form-item label="请输入回复信息" :label-width="formLabelWidth">
                                        <el-input v-model="bookContent.backText"></el-input>
                                    </el-form-item>
                                </el-form>
                                <div slot="footer" class="dialog-footer">
                                    <el-button @click="cancelBtn()">取 消</el-button>
                                    <el-button type="primary" @click="submitBackBookCom()">确 定</el-button>
                                </div>
                            </el-dialog>
                            <ul v-if="comItem.children.length!==0">
                                <li class="com-child-item" v-for="item in comItem.children" :key="item.id">
                                    <img :src="item.userAvatar" alt="">
                                    <div class="com-info">
                                        <h1>{{item.userName}}</h1>
                                        <p>{{item.comContent}}</p>
                                        
                                    </div>
                                </li>
                            </ul>
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
</template>
<script>
import orderInfo from '../api/orderInfo.js'
import userInfo from '../api/userInfo.js'
import cookie from 'js-cookie'
export default {
    data() {
        return {
            starForm:{
                bookId:null,
                userId:null,
                brownTime:null,
                brownBackTime:null,
                storeName:null
            },
            bookContent:{
                bookId:null,
                userId:null,
                parentId:null,
                text:'',
                backText:''
            },
            userLike:{
                likeUserId:null,
                likeBookId:null,
                likeComId:null
            },  
            bookDetail:{},
            loginInfo:{},
            bookId:'',
            isWrite:false,
            isBack:false,
            componentList:[],
            current: 1, //当前页
            limit:4,
            total: 0, //总记录数
            dialogFormVisible:false,
            formLabelWidth:"50",
            title:''
        }
    },
    methods: {
        //写评论
        changeWriteStatus(){
            this.isWrite=!this.isWrite
        },
        //回复评论
        changeBackStatus(item){
            this.title='回复用户'+'<'+item.userName+'>'
            this.dialogFormVisible=true
            this.bookContent.parentId=item.id
        },
        //取消回复
        cancelBtn(){
            this.dialogFormVisible=false
            this.bookContent.parentId=null
            this.bookContent.backText=null
        },
        //获取评论列表
        getBookComponentList(bookId){
            orderInfo.getBookComponentList(bookId,this.current)
            .then(responce=>{
                if(responce.code===20000){
                    this.componentList=responce.data.pageInfo.records
                    console.log(responce.data.pageInfo.records)
                    this.total=responce.data.pageInfo.total
                }
            })
        },
        //发表评论
        submitBookCom(){
            if(!this.bookContent.text||this.bookContent.text.trim()===""){
                this.$message({
                type:'warning',
                message:'请填写评论内容!'
            })
            }else{
            this.bookContent.bookId=localStorage.getItem('bookId')
            this.bookContent.userId=localStorage.getItem('logId')
            orderInfo.submitBookCom(this.bookContent)
                .then(responce=>{
                    if(responce.code===20000){
                        this.$message({
                        type: 'success',
                        message: '评论成功!'
                    });
                    this.getBookComponentList(localStorage.getItem('bookId'))
                    this.bookContent.text=''
                    if(this.bookContent.parentId!==null){
                        this.dialogFormVisible=false
                        this.bookContent.backText=''
                    }
                    }
                })
            }
        },
        //回复评论
        submitBackBookCom(){
            if(!this.bookContent.backText||this.bookContent.backText.trim()===""){
                this.$message({
                type:'warning',
                message:'请填写评论回复内容!'
            })
            }else{
            this.bookContent.bookId=localStorage.getItem('bookId')
            this.bookContent.userId=localStorage.getItem('logId')
            orderInfo.submitBookCom(this.bookContent)
                .then(responce=>{
                    if(responce.code===20000){
                        this.$message({
                        type: 'success',
                        message: '评论回复成功!'
                    });
                    this.getBookComponentList(localStorage.getItem('bookId'))
                        this.dialogFormVisible=false
                        this.bookContent.backText=''
                    }
                })
            }
        },
        //用户点赞
        userClick(item){
            this.userLike.likeUserId=localStorage.getItem('logId')
            this.userLike.likeBookId=localStorage.getItem('bookId')
            this.userLike.likeComId=item.id
            userInfo.userClick(this.userLike)
            .then(responce=>{
                if(responce.code===20000){
                    this.getBookComponentList(localStorage.getItem('bookId'))
                }
            })
        },
        //获取用户信息
        getUserInfo(){
        var userStr=cookie.get('user_front_Info')
            if(userStr){
                var userInfo = JSON.parse(userStr)
                this.loginInfo=userInfo
                this.starForm.userId=userInfo.id
            }
        },
        //获取图书内容
        getBookDetail(){
            if(this.$route.params.id!==undefined){
                localStorage.setItem('bookId',this.$route.params.id)
            }
            var ad = localStorage.getItem('bookId')
            orderInfo.getBookDetail(ad)
            .then(responce=>{
                if(responce.code===20000){
                    this.bookDetail=responce.data.bookDetail
                    this.starForm.bookId=responce.data.bookDetail.id
                    this.starForm.storeName=responce.data.bookDetail.storeName
                    this.getBookComponentList(this.starForm.bookId)
                }else{
                    console.log('未获取到图书详情!')
                }
            })  
        },
        //提交借阅信息
        submitBrownInfo(){
            this.$confirm('您将预约借阅《'+this.bookDetail.bookName+'》,是否继续?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }).then(() => {
            orderInfo.submitBrownInfo(this.starForm)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type:'success',
                    message:'预约心愿单成功!'
                })
                }
            })
        }).catch(() => {
            this.$message({
                type: 'warning',
                message: '已经取消预约!'
            });          
        });
        },
        //当前分页
        handleCurrentChange(val){
            this.current = val
            //获取用户点击的当前页后刷新页面数据
            this.getBookComponentList(localStorage.getItem('bookId'))
        },
    },
    created() {
        this.getBookDetail()
        this.getUserInfo()
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
}
.brown-book-info{
    width: 70%;
    margin: 3% 15%;
    display: block;
    float: left;

}
.bk-img{
    width:25%;
    height: 350px;
    display: block;
    float: left;
    margin: 1%;
    overflow: hidden;
}
.bk-img img{
    width:100%;
    height: 100%;
    transition: 0.8s;
}
.bk-img img:hover{
    transform: scale(1.1);
}
.bk-info{
    width: 70%;
    height: 350px;
    display: block;
    float: left;
    margin: 1%;
    border: tan 3px solid;
}
.bk-info h1{
    width: 90%;
    height: 40px;
    margin: 10px auto;
    text-align: left;
    border-bottom: sienna 2px solid;
}
.bk-info p{
    width: 90%;
    text-align: left;
    margin: 10px auto;
    font-size: 20px;

}
.bk-info .intro{
    width: 90%;
    font-size: 18px;
    line-height: 28px;
    color: #999;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
.sto-dre{
    width: 90%;
    margin: 0px auto;
    text-align: left;

}
.sto-dre>span{
    width: 30%;
    font-size: 20px;
    margin-right: 20%;
    vertical-align: top;
    display: inline-block;

}
.sto-img{
    width: 30%;
    display: inline-block;
    height: 100px;
}
.brown-table{
    width: 70%;
    margin: 0px 15%;
    display: block;
    float: left;
    border: indianred 2px solid;
}
.brown-table h1{
    width: 95%;
    font-size: 30px;
    font-style: italic;
    margin: 5px auto;
    border-left: sienna 3px solid;
}
.demo-form-inline{
    width: 90%;
    text-align: left;
    margin: 10px auto;
}
.starInfo{
    font-size: 20px;
    color: #999;
    text-align: center;
    border-spacing: 0px 0px;
    border-collapse:collapse;
    margin: 10px auto;
}
.starInfo td,th{
    width: 200px;
    height: 30px;
    line-height: 30px;
    border: 1px solid sienna;
}
.el-date-picker{
    cursor: pointer;
}
.bro-btn{
    background-color: rgb(250, 213, 206);
    float: right;
    margin: 10px 50px;
}
.com-box-center{
    width: 95%;
    margin: 10px auto;
}
.component{
    width: 70%;
    margin: 10px auto;
    /* border: thistle 1px solid; */
}
.com-cen-hd{
    border-bottom: thistle 1px solid;
}
.com-cen-hd>h3{
    width: 10%;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    padding-left: 10px;
    font-weight: 600;
    text-align: left;
    display: block;
    float: left;
    border-bottom:saddlebrown solid 2px !important;
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
.write-back-con{
    display: block;
    float: left;
    width: 80%;
    height: 160px;
    margin: 10px 160px;
    position: relative;
    border: thistle 1px solid;
}
.write-back-con textarea{
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
    border-bottom: rgb(240, 234, 240) 0.5px solid;
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
    width: 10%;
    margin: 5px;
    display: block;
    font-size: 20px;
    cursor: pointer;
    text-align: center;
    /* border: thistle 1px solid; */
}
.com-child-item{
    width: 90%;
    /* height: 160px; */
    margin: 10px 0px 0px 80px;
    display: block;
    float: left;
    border-bottom: rgb(240, 234, 240) 0.5px solid;
}
</style>