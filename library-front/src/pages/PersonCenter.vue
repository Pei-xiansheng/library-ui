<template>
    <div class="main">
        <el-col :span="4" class="user-left-box">
            <el-card class="user-post-card">
                <ul>
                    <li class="u-item" @click="changeEditStatus()">个人信息</li>
                    <li class="u-item" @click="changeReadStatus()">我的心愿单</li>
                </ul>
            </el-card>
        </el-col>
        <el-col :span="20" class="user-right-box">
            <el-card class="user-box-card">
                <div class="user-content" v-if="isEdit">
                    <h1>用户个人信息中心</h1>
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
                <div v-if="isRead" class="star-info">
                    <h1>个人心愿单列表</h1>
                    <div class="star-info-list">
                    <el-table
                        :data="starInfoList"
                        :border=true
                        class="content-table">
                        <el-table-column
                            prop="storeName"
                            label="借阅书店">
                        </el-table-column>
                        <el-table-column
                            prop="bookName"
                            label="借阅书籍"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="broTime"
                            label="借阅时间"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="broBackTime"
                            label="归还时间"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="agreeStatus"
                            label="是否通过审核"
                            width=80>
                            <template slot-scope="scope">
                                {{ scope.row.agreeStatus?'是':'否' }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="backStatus"
                            label="归还状态"
                            width=90>
                            <template slot-scope="scope">
                                {{ scope.row.backStatus?'已归还':'未归还' }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="backOverStatus"
                            label="是否逾期"
                            width=90
                            >
                            <template slot-scope="scope">
                                {{ scope.row.backOverStatus?'逾期':'未逾期' }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="operation"
                            label="申请延期"
                            width="90">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="applyDelayTime(scope)" v-if="!scope.row.backStatus">申请</el-button>
                                <el-button type="warning" @click="applyDelayTime(scope)" v-if="scope.row.backStatus">失效</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-dialog
                        title="审核心愿单"
                        :visible.sync="applyDialogVisible"
                        width="30%"
                        center>
                        <span>是否申请延期借阅《{{staApplyForm.bookName}}》?</span>
                            <el-date-picker
                                style="margin: 15px;"
                                v-model="staApplyForm.endTime"
                                type="date"
                                placeholder="选择延期日期"/>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="warning" @click="applyDialogVisible=false">取 消</el-button>
                            <el-button type="primary" @click="applySubmit()">确 定</el-button>
                        </span>
                    </el-dialog>
                    </div>
                    <div class="pg">
                        <el-pagination
                        background
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next, total"
                        :total="total" 
                        :page-size="limit"
                        :current-page="current">
                      </el-pagination>
                    </div>
                </div>
            </el-card>
        </el-col>
    </div>
</template>
<script>
import cookie from 'js-cookie'
import userInfo from '../api/userInfo.js'
import orderInfo from '../api/orderInfo.js'
export default {
    data() {
        return {
            isEdit:true,
            isRead:false,
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
            applyDialogVisible:false,
            staApplyForm:{
                id:null,
                bookName:null,
                endTime:null
            },
            sId:null,
            limit:6,
            total: 0, //总记数
            current:1,
            starInfoList:[

            ]
        }
    },
    methods: {
        //编辑用户信息
        changeEditStatus(){
            this.isEdit=true
            this.isRead=false
        },
        //查看心愿单状态
        changeReadStatus(){
            this.isEdit=false
            this.isRead=true
        },
        //获取用户信息
        getUserInfo(){
        var userStr=cookie.get('user_front_Info')
            if(userStr){
            var userInfo = JSON.parse(userStr)
            this.userInfoForm=userInfo
        }
        },
        //获取用户心愿单列表
        getStarInfoList(){
            orderInfo.getStarInfoList(localStorage.getItem('logId'),this.current)
            .then(responce=>{
                this.starInfoList=responce.data.pageInfo.records
                this.total=responce.data.pageInfo.total
            })
        },
        //延长借阅期限
        applyDelayTime(scope){
            if(scope.row.backStatus){
                this.$message({
                type: 'warning',
                message: '图书已归还,无需延长借阅期限!'
            });
            }else if(scope.row.backOverStatus){
                this.$message({
                type: 'error',
                message: '图书已逾期请尽快前往【'+scope.row.storeName+'】进行处理!'
            });
            }else{
                this.applyDialogVisible=true
                this.staApplyForm.bookName=scope.row.bookName
                this.staApplyForm.id=scope.row.id
            }
        },
        applySubmit(){
            orderInfo.applyDelayTime(this.staApplyForm)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type: 'success',
                    message: '图书延长借阅期限成功!'
                });
                this.getStarInfoList()
                this.applyDialogVisible=false
                }
            })
        },
        //当前分页
        handleCurrentChange(val){
            this.current = val
            //获取用户点击的当前页后刷新页面数据
            this.getStarInfoList()
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
            cookie.set('user_front_Info',JSON.stringify(this.userInfoForm))
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
        this.getStarInfoList()
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
.user-left-box{
    width: 15%;
    margin-top: 2%;
    margin-left: 8%;
}
.user-right-box{
    width: 65%;
    margin-top: 2%;
    margin-left: 5%;
}
.user-box-card {
    width: 100%;
}
.u-item{
    width: 66%;
    height: 40px;
    font-size: 20px;
    font-weight: 500;
    line-height: 40px;
    text-align: left;
    padding-left: 50px;
    margin: 5px auto;
    border-left: tan 2px solid;
}
.u-item:hover{
    background-color: rgb(255, 242, 242);
    cursor: pointer;
}
.user-content>h1{
    width: 90%;
    margin: 5px auto;
    font-size: 23px;
    padding: 5px;
    color: rgb(226, 126, 93);
    border-left: 3px saddlebrown solid;
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
.star-info{
    width: 100%;
    min-height: 300px;
}
.star-info>h1{
    width: 95%;
    font-size: 30px;
    font-style: italic;
    margin: 10px auto;
    border-left: sienna 3px solid;
}
.content-table{
    width: 100%;
    margin: 10px 0;
    text-align: center !important;
}
.star-info /deep/ .el-table__cell{
    text-align: center;
    padding: 5px !important;
}
.el-button{
    padding: 8px 18px;
}
.star-info /deep/.el-dialog{
    width: 30% !important;
}
.pg{
    width: 100%;
    display: block;
    float: left;
    margin: 10px auto;
    /* border: thistle 1px solid; */
}
</style>