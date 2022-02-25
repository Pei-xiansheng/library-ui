<template>
    <div class="main">
        <el-row class="main-row">
            <el-col :span="16" class="welcome-img">
                <el-card class="box-card-one">
                    <div class="post-header">
                        <h1>公告栏</h1>
                    </div>
                    <div class="post-edit">
                        <el-form :inline="true" :model="postForm" class="demo-form-inline">
                            <el-form-item label="主题">
                                <el-input v-model="postForm.postTitle" placeholder="公告主题"></el-input>
                            </el-form-item>
                            <el-form-item label="发布者">
                                <el-select v-model="postForm.userId" placeholder="选择姓名">
                                    <el-option :label="roleItem.roleName" :value="roleItem.id" v-for="roleItem in roleList" :key="roleItem.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="发布时间">
                                <el-date-picker
                                    v-model="postForm.postTime"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                              <el-button type="primary" @click="sendPost()">发布</el-button>
                            </el-form-item>
                        </el-form>
                        <textarea class="write-info" v-model="postForm.postContent"></textarea>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card-two">
                    <div class="post-header">
                        <h1>公告列表</h1>
                    </div>
                    <div class="post-list">
                        <ul>
                            <li v-if="postList.length!==0" class="post-item" v-for="item in postList" :key="item.id" @click=lookPostInfo(item)>
                                <h2><span style="color: sienna;font-style: italic;">{{item.userName}}</span></h2>
                                <p>{{item.postContent}}</p>
                            </li>
                            <li v-if="postList.length===0" class="empty-item">
                                <p>您还未编辑过任何公告</p>
                            </li>
                        </ul>
                    </div>
                </el-card>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import perInfo from '../api/perInfo.js'
import bookInfo from '../api/bookInfo.js'
export default {
    data() {
        return {
            postForm: { //公告信息
                userId: '',
                postTime:'',
                postTitle:'',
                postContent:'',
            },
            roleList:[],
            postList:[]
        }
    },
    methods: {
        //获取发布者列表
        getRoleList(){
            perInfo.getRoleList()
            .then(responce=>{
                this.roleList=responce.data.roleList
            })
        },
        //发布公告
        sendPost(){
            bookInfo.sendPost(this.postForm)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type: 'success',
                    message: '公告发布成功!'
                });
                this.getPostList()
                this.postForm=''
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
        //查看公告详情
        lookPostInfo(postInfo){
            this.postForm=postInfo
        }
    },
    created() {
        this.getRoleList()
        this.getPostList()
    },
}
</script>
<style scoped>
.main{
    position: relative;
    width: 100%;
    height: 95%;
}
li{
    list-style: none;
}
.main-row{
    position: absolute;
    top: 10%; 
    width: 85%;
    margin-left: 6%;
    /* border: rgb(102, 37, 15) 1px solid; */
}
.box-card-one{
    width: 95%;
}
.box-card-two{
    width: 100%;
}
.post-header h1{
    width: 90%;
    font-size: 25px;
    margin: 0px auto;
    text-align: left;
    padding-left: 10%;
    border-left: tomato 5px solid;
}
.post-edit{
    margin-top: 15px;
    height: 400px;
}
.write-info{
    width: 95%;
    height: 250px;
    border-radius: 2px;
    background: transparent;
    background-color: seashell;
    margin: 0px auto;
    font-size: 18px;
    color: brown;
    outline: none;
    border: none;
    resize: none;
}
.write-info::-webkit-scrollbar {
    display: none;
}
.post-list{
    margin-top: 15px;
    height: 400px;
    overflow-y: scroll;
}
.post-list::-webkit-scrollbar {
    display: none;
}
.post-item{
    width: 95%;
    height: 50px;
    margin: 5px auto;
    cursor: pointer;
    border-bottom: 2px rgb(201, 247, 221) solid;
}
.post-item h2{
    font-size: 18px;
    font-weight: 500;
    text-align: left;
}
.post-item p{
    text-align: left;
    color: rgb(94, 91, 91);
    text-indent: 2em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.empty-item{
    width: 100%;
    height: 50px;
    font-size: 20px;
    font-style: italic;
    line-height: 50px;
    margin-top: 30%;
    color: rgb(94, 91, 91);
}
</style>