<template>
    <div class="main">
        <el-row :gutter="20" class="main-row">
            <el-col :span="12" class="">
                <el-card class="box-card-one">
                    <h1>轮播图上传</h1>
                    <div class="banner-info">
                        <el-upload
                            class="avatar-uploader"
                            :action="baseUrl+'/lib/file/upload'"
                            :show-file-list="true"
                            :on-success="handleAvatarSuccess"
                            :on-error="handleAvatarFail"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="bannerForm.bannerName" :src="bannerForm.bannerImg" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <div class="banner-list">
                            <ul>
                                <li v-if="bannerList.length!==0" class="banner-item" v-for="item in bannerList" :key="item.bannerName">
                                    <img :src="item.bannerImg" :alt="item.bannerName">
                                    <p>{{item.bannerName}}</p>
                                </li>
                                <li v-if="bannerList.length===0" class="empty-item">
                                    <h2 style="color: #8c939d;font-style: italic;font-size: 20px;">您还未上传最新轮播图!</h2>
                                </li>
                            </ul>
                        </div>
                        <el-button type="primary" style="position: absolute;bottom: 0px; right: 0px;" @click="saveBannerList()">上传</el-button>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card-two">
                    <h1>书店录入</h1>
                    <el-form :inline="true" :model="storeInfoForm" class="demo-form-inline">
                        <el-form-item label="管理员名称">
                            <el-select v-model="storeInfoForm.id" placeholder="请选择角色">
                                <el-option v-for="item in manageList" :key="item.id" :label="item.userName+'---'+item.roleName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="书店名称">
                          <el-input v-model="storeInfoForm.storeName" placeholder="请输入书店名称"></el-input>
                        </el-form-item>
                        <el-form-item label="书店介绍">
                            <el-input v-model="storeInfoForm.recReason" placeholder="请输入书店介绍" style="width: 500px;"></el-input>
                        </el-form-item>
                        <el-form-item label="推荐指数">
                            <el-select v-model="storeInfoForm.recStar" placeholder="请输入书店推荐指数">
                                <el-option label="一星" value="1"></el-option>
                                <el-option label="两星" value="2"></el-option>
                                <el-option label="三星" value="3"></el-option>
                                <el-option label="四星" value="4"></el-option>
                                <el-option label="五星" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="书店地址">
                            <el-input v-model="storeInfoForm.address" placeholder="请输入书店地址"></el-input>
                        </el-form-item>
                        <el-form-item label="上传书店图片" style="float: left;">
                            <el-upload
                                class="avatar-uploader"
                                :action="baseUrl+'/lib/file/upload'"
                                :show-file-list="false"
                                :on-success="handleStoreSuccess"
                                :on-error="handleStoreFail"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="storeInfoForm.stoImg" :src="storeInfoForm.stoImg" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                    <el-button type="primary" style="position: absolute;bottom: 20px; right: 25px;" @click="saveBookStore()">上传</el-button>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import bookInfo from '../api/bookInfo.js'
import perInfo from '../api/perInfo.js'
export default {
    data() {
        return {
            baseUrl:'http://localhost:9527',
            bannerForm:{
                bannerImg:'',
                bannerName:''
            },
            bannerList:[],
            manageList:[],
            storeInfoForm:{
                id:null,
                storeName:null,
                recReason:null,
                recStar:null,
                address:null,
                stoImg:null
            }
        }
    },
    methods: {
        //上传之前
        beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        //上传成功
        handleAvatarSuccess(res, file){
            this.bannerForm.bannerName=file.name
            this.bannerForm.bannerImg=res.data.pictureUrl
            this.bannerList.push({
                bannerImg:res.data.pictureUrl,
                bannerName:file.name
            })
            this.$message({
                type: 'success',
                message: '上传头像成功!'
            });
        },
        //上传失败
        handleAvatarFail(err, file){
            this.$message.error(err.data.msg)
        },
        //保存轮播图
        saveBannerList(){
            bookInfo.saveBannerList(this.bannerList)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type: 'success',
                    message: '上传轮播图成功!'
                });
                this.bannerList=[]
                this.bannerForm.bannerImg=''
                }
            })
        },
        //上传书店图片
        handleStoreSuccess(res,file){
            this.storeInfoForm.stoImg=res.data.pictureUrl
            this.$message({
                type: 'success',
                message: '上传书店图片成功!'
            });
        },
         //上传失败
         handleStoreFail(err, file){
            this.$message.error(err.data.msg)
        },
        //获取角色列表
        getManageList(){
            perInfo.getManageList()
            .then(responce=>{
                this.manageList=responce.data.manageList
            })
        },
        //上传书店信息
        saveBookStore(){
            var flag=confirm("是否要提交书店信息!")
            if(flag){
                bookInfo.saveBookStore(this.storeInfoForm)
                .then(responce=>{
                    if(responce.code===20000){
                        this.$message({
                        type: 'success',
                        message: '上传书店信息成功!'
                    });
                    }else{
                        this.$message({
                        type: 'warning',
                        message: '上传书店图片失败!'
                    });
                    }
                })
            }else{
                this.$message({
                    type: 'warning',
                    message: '取消提交书店信息!',
                });
            }
        }
    },
    updated() {
        
    },
    created() {
        this.getManageList()
    },
}
</script>
<style scoped>
.main{
    width: 100%;
    height: 95%;
}
.main-row{
    top: 6%; 
    width: 100%;
    /* border: darksalmon 1px solid; */
}
a{
    text-decoration: none;
}
li{
    list-style: none;
}
.box-card-one{
    width: 100%;
    height: 520px;
    margin-left: 10px;
}
.box-card-one h1,.box-card-two h1{
    width: 90%;
    font-size: 25px;
    color: thistle;
    margin: 0px auto;
    border-left: tomato 5px solid;
}
.banner-info{
    width: 90%;
    height: 450px;
    margin: 15px auto;
    position: relative;
    /* border-top: 2px solid sienna; */
}
.box-card-two{
    width: 100%;
    height: 520px;
    margin-left: 10px;
}
.demo-form-inline{
    margin-top: 50px;
    padding: 10px;
}
.demo-form-inline /deep/ .el-form-item__label{
    font-size: 15px;
    font-weight: bold;
}
.avatar-uploader{
    border: 1px dashed #d17171;
    width: 180px;
    height: 180px;
    cursor: pointer;
    position: relative;
    top: 15%;
    left: 5%;
    display: block;
    float: left;
  }
.avatar-uploader:hover {
    border-color: #409EFF;
    width: 180px;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    height: 180px;
    line-height: 180px;
    text-align: center;
}
.avatar {
    width: 180px;
    height: 180px;
    display: block;
}
.banner-list{
    width: 50%;
    height: 350px;
    position: relative;
    top: 5%;
    right: 5%;
    display: block;
    float: right;
    border-radius: 5px;
    border: sienna 2px solid;
}
.banner-item{
    display: block;
    width: 100%;
    text-align: left;
    border-bottom: #d17171 3px solid;
}
.banner-item img{
    width: 50%;
    height: 80px;
    margin: 5px 10px;
    display: inline-block;
}
.banner-item p{
    width: 30%;
    height: 40px;
    line-height: 40px;
    text-align: left;
    margin: 20px 0px;
    vertical-align: top;
    color: #8c939d;
    font-size: 15px;
    border-left: olive 3px solid;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.empty-item{
    margin-top: 150px;
}
</style>