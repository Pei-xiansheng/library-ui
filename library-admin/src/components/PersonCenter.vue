<template>
    <div class="main">
        <el-card class="box-card">
            <div class="content">
                <h1>管理信息中心</h1>
                <div class="body-down">
                    <div class="info">
                        <el-form :label-position="labelPosition" label-width="80px" :model="userInfoForm">
                        <el-form-item label="用户名">
                          <el-input v-model="userInfoForm.userName" class="info-input" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="用户昵称">
                          <el-input v-model="userInfoForm.nickName" class="info-input" placeholder="请输入昵称"></el-input>
                        </el-form-item>
                        <el-form-item label="修改密码">
                          <el-input v-model="userInfoForm.passWord" class="info-input" placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item label="用户邮箱">
                            <el-input v-model="userInfoForm.email" class="info-input" @blur="checkEmail()" placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                        <el-form-item label="用户年龄">
                            <el-input v-model="userInfoForm.age" class="info-input" placeholder="请输入年龄"></el-input>
                        </el-form-item>
                        <el-form-item label="用户性别">
                            <el-select v-model="userInfoForm.gender" placeholder="选择性别">
                                <el-option label="男" value="true"></el-option>
                                <el-option label="女" value="false"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="身份信息">
                            <el-input v-model="userInfoForm.identityId" class="info-input" placeholder="请输入身份信息"></el-input>
                        </el-form-item>
                        <el-form-item label="用户头像">
                            <el-upload
                                class="avatar-uploader"
                                :action="baseUrl+'/lib/file/upload'"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :on-error="handleAvatarFail"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="userInfoForm.userAvatar" :src="userInfoForm.userAvatar" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-dialog
                            title="更新用户信息"
                            :visible.sync="centerDialogVisible"
                            width="30%"
                            center>
                            <span>您是否确认修改信息?</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="cancelSubmit()">取 消</el-button>
                                <el-button type="primary" @click="confirmSubmit()">确 定</el-button>
                            </span>
                        </el-dialog>
                        <el-button @click="centerDialogVisible = true" class="submitBtn">保存信息</el-button>
                    </el-form>
                </div>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
import cookie from 'js-cookie'
import userInfo from '../api/userInfo.js'
export default {
    data() {
        return {
            activeIndex: '1',
            id:'',
            name:'',
            timeout:null,
            baseUrl:'http://localhost:9527',
            userInfoForm:{
                id:null,
                userName: null,
                nickName: null,
                passWord: null,
                userAvatar:null,
                email:null,
                age:null,
                gender:null,
                identityId:null
            },
            labelPosition: 'right',
            centerDialogVisible: false,
        }
    },
    methods: {
        //获取用户信息
        getUserInfo(){
        var userStr=cookie.get('user_Info')
            if(userStr){
            var userInfo = JSON.parse(userStr)
            console.log(userInfo)
            this.userInfoForm=userInfo
        }
        },
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
            this.userInfoForm.userAvatar=res.data.pictureUrl
            this.$message({
                type: 'success',
                message: '上传头像成功!'
            });
        },
        //上传失败
        handleAvatarFail(err, file){
            this.$message.error(err.data.msg)
        },
        //校验邮箱格式
        checkEmail(){
            var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if(this.userInfoForm.email != '' && !regEmail.test(this.userInfoForm.email)) {
                this.$message({
                    message: '邮箱格式不正确',
                    type: 'error'
                })
                this.userInfoForm.email = null
            }
        },
        confirmSubmit(){
        //关闭弹窗
        this.centerDialogVisible = false
        userInfo.updateUserInfo(this.userInfoForm)
        .then(responce=>{
            if(responce.code===20000){
                this.$message({
                type: 'success',
                message: '更新信息成功!'
            });
            //重置用户信息
            cookie.set('user_Info',JSON.stringify(this.userInfoForm))
            }else{
                this.$message({
                type: 'warning',
                message: '更新信息失败!'
              });
            }
        })
    },
    //取消提交信息
    cancelSubmit(){
        this.centerDialogVisible = false
        this.$message.warning('取消更新个人信息!')
    }, 
    },
    created() {
        this.getUserInfo()
    },
}
</script>
<style scoped>
.main{
    position: relative;
    width: 100%;
    height: 95%;
}
.box-card {
    width: 60%;
    position: absolute;
    top: 50px;
    left: 50%;
    margin-left: -30%;
}
.content>h1{
    font-size: 22px;
    color: rgb(226, 126, 93);
}
.head-select{
    margin-top: 10px;
    margin-left: 10px;
}
.info{
    margin: 20px;
}
.info-input{
    width: 50% !important;
}
.avatar-uploader{
    border: 1px dashed #d17171;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    /* overflow: hidden; */
  }
.avatar-uploader:hover {
    border-color: #409EFF;
    width: 200px;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 200px;
    line-height: 200px;
    text-align: center;
}
.avatar {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    display: block;
    transition: all 1s;
}
.avatar:hover{
    transform: rotate(-360deg);
}
.submitBtn:hover{
    background-color: rgb(123, 178, 233);
}
.submitBtn{
    color: firebrick;
    margin-left: 80%;
}
</style>