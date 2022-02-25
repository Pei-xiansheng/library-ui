<template>
    <div class="main">
        <el-col :span="18" class="left-box">
            <el-card class="post-card">
                <div class="post-title">
                    <h1>公告栏</h1>
                </div>
                <div class="post-list">
                    <ul>
                        <li class="post-item" @click="seePostDetail(item)" v-for="item in postList" :key="item.id">
                            <span>{{item.postTitle}}</span>
                            <div class="post-info">
                                <h2>{{item.userName}}</h2>
                                <p>{{item.postContent}}</p>
                                <span style="position: absolute; bottom: 5px;right: -151px;font-style: italic;color: rgb(207, 179, 119);">日期:{{item.postTime}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <el-drawer
                    :title="title"
                    :visible.sync="drawer"
                    :direction="direction"
                    >
                    <span>{{content}}</span>
                </el-drawer>
            </el-card>
        </el-col>
        <el-col :span="6" class="right-box">
            <el-card class="feed-card">
                <div class="feed-title">
                    <h2>反馈中心</h2>
                </div>
                <div class="feed-list">
                    <el-form :inline="true" :model="feedForm" class="demo-form-inline">
                        <el-form-item label="选择反馈管理员">
                            <el-select v-model="feedForm.toId" placeholder="选择反馈管理员">
                                <el-option v-for="item in manageList" :key="item.id" :label="item.userName+' '+item.roleName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div class="write">
                        <textarea v-model="feedForm.feedContent"></textarea>
                    </div>
                    <el-button class="btn" @click="submitFeed()">提交</el-button>
                </div>
            </el-card>
        </el-col>
    </div>
</template>
<script>
import bookInfo from '../api/bookInfo.js'
import userInfo from '../api/userInfo.js'
export default {
    data() {
        return {
            title:'',
            drawer: false,
            postList:[],
            content:'',
            direction:'ltr',
            manageList:[],//角色列表
            feedForm:{
                fromId:'',
                toId:'',
                feedContent:''
            }
        }
    },
    methods: {
        seePostDetail(item){
            this.drawer=true
            this.title=item.postTitle
            this.content=item.postContent
            bookInfo.increaSeeNum(item.id)
            .then(responce=>{
                
            })
        },
        getPostList(){
            bookInfo.getPostList()
            .then(responce=>{
                this.postList=responce.data.postList
            })
        },
        findPostDetail(){
            if(this.$route.params.title!==undefined){
                this.drawer=true
                this.title=this.$route.params.title
                this.content=this.$route.params.content
            }
        },
         //获取角色列表
         getManageList(){
            userInfo.getManageList()
            .then(responce=>{
                this.manageList=responce.data.manageList
            })
        },
        //提交反馈
        submitFeed(){
            var userId = localStorage.getItem('logId')
            this.feedForm.fromId=userId
            if(this.feedForm.toId===''){
                this.$message({
                type:'warning',
                message:'请选择反馈对象!'
            })
            }else if(!this.feedForm.feedContent||this.feedForm.feedContent.trim()===""){
                this.$message({
                type:'warning',
                message:'请填写反馈内容!'
            })
            }else{
            bookInfo.submitFeedContent(this.feedForm)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type: 'success',
                    message: '提交反馈成功!'
                });
                this.feedForm.feedContent=''
                }else{
                    this.$message({
                    type: 'warning',
                    message:responce.msg
                });
                }
            })
            }
        }
    },
    created() {
        //获取公告列表
        this.getPostList()
        //是否主页跳转查看
        this.findPostDetail()
        this.getManageList()
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
    height: 90vh;
}
.left-box{
    margin: 0px;
}
.right-box{
    margin: 0px;
}
.post-card{
    width: 90%;
    height: 650px !important;
    margin: 20px auto;
}
.post-title h1{
    width: 95%;
    font-size: 30px;
    font-style: italic;
    margin: 10px auto;
    background-color: rgb(232, 252, 245);
    border-left: sienna 3px solid;
}
.feed-card{
    width: 100%;
    height: 450px;
    margin: 20px auto;
}

.demo-form-inline{
    margin: 15px 20px 5px 20px;
    float: left;
}
.post-list{
    border: 1px dotted sienna;
    height: 550px;
    width: 95%;
    margin: 10px auto;
}
.post-list{
    overflow-y: scroll;
}
.post-list::-webkit-scrollbar {
    display: none;
}
.post-item{
    display: list-item;
    width: 100%;
    height: 80px;
    border-bottom: rgb(130, 187, 55) 3px solid;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.post-item:hover{
    background-color: rgb(247, 239, 239);
}
.post-item>span{
    width: 66px;
    height: 66px;
    line-height: 66px;
    border: rgb(197, 189, 165) 1px solid;
    background-color: rgb(255, 251, 252);
    border-radius: 33px;
    margin: 6px;
    display: block;
    float: left;
}
.post-info{
    width: 80%;
    display: block;
    float: left;
    margin: 5px;
    margin-left: 10px;
    border-left: rgb(163, 206, 241) 3px solid;
}
.post-info>h2{
    font-size: 20px;
    text-align: left;
    font-weight: 500;
    padding-left: 20px;
}
.post-info>p{
    text-align: left;
    color: #999;
    font-style: italic;
    text-indent: 2em;
    padding-left: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.el-drawer span{
    font-size: 20px;
    display: block;
    width: 100%;
    color: #999;
    text-align: left !important;
    text-indent: 2em !important;
}
.feed-title h2{
    height: 40px;
    line-height: 40px;
    font-style: italic;
    text-align: left;
    padding-left: 20px;
    margin-left: 30px;
    margin-top: 10px;
    background-color: rgb(232, 252, 245);
    border-left: 3px solid rgb(245, 238, 52);
}
.write{
    float: left;
    width: 100%;
}
.write textarea{
    width: 90%;
    height: 200px;
    margin: 10px 15px 5px 15px;
    background: transparent;
    background-color: rgb(250, 247, 245);
    font-size: 18px;
    color: brown;
    outline: none;
    border: none;
    resize: none;
}
.btn{
    float: right;
    margin: 15px 30px;
}
</style>