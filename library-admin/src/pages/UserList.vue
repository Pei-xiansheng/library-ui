<template>
    <div class="main">
        <el-card class="box-card">
            <div class="content">
                <h1>用户列表信息</h1>
                <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                    <el-form-item label="用户名">
                      <el-input v-model="queryForm.userName" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄">
                        <el-input v-model="queryForm.age" placeholder="输入年龄"></el-input>
                      </el-form-item>
                    <el-form-item label="性别">
                        <el-select v-model="queryForm.gender" placeholder="选择性别">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="getUserInfoList()">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    :data="userList"
                    :border=true
                    class="content-table">
                    <el-table-column
                        prop="userName"
                        label="用户名"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="nickName"
                        label="昵称"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="email"
                        label="邮箱">
                    </el-table-column>
                    <el-table-column
                        prop="age"
                        label="年龄"
                        width=50>
                    </el-table-column>
                    <el-table-column
                        prop="gender"
                        label="性别"
                        width=50>
                        <template slot-scope="scope">
                            {{ scope.row.gender?'男':'女' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="identityId"
                        label="身份信息">
                    </el-table-column>
                    <el-table-column
                        prop="operation"
                        label="操作"
                        width="200">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="editManageUser(scope)">修改</el-button>
                            <el-button type="warning" @click="deleteUserInfo(scope)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @current-change="handleCurrentChange"
                    background
                    layout="prev, pager, next,total"
                    :total="total" 
                    :page-size="limit"
                    :current-page="current"
                    class="page">
                </el-pagination>
                <el-dialog title="修改用户信息" :visible.sync="dialogFormVisible">
                    <el-form :model="userInfoForm">
                        <el-form-item label="用户密码" :label-width="formLabelWidth">
                            <el-input v-model="userInfoForm.passWord"></el-input>
                        </el-form-item>
                        <el-form-item label="用户邮箱" :label-width="formLabelWidth">
                            <el-input v-model="userInfoForm.email" @blur="checkEmail()"></el-input>
                        </el-form-item>
                        <el-form-item label="用户身份信息" :label-width="formLabelWidth">
                            <el-input v-model="userInfoForm.identityId"></el-input>
                        </el-form-item>
                        <el-form-item label="设为管理员" :label-width="formLabelWidth">
                            <el-select v-model="userInfoForm.roleId" placeholder="请选择角色">
                                <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancelBtn()">取 消</el-button>
                        <el-button type="primary" @click="submitBtn()">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>
<script>
import userInfo from '../api/userInfo.js'
import perInfo from '../api/perInfo.js'
export default {
    data() {
        return {
            current: 1, //当前页
            limit:6,
            total: 0, //总记录数
            userList:[],//用户列表
            roleList:[],//角色列表
            dialogFormVisible:false,//模态框
            formLabelWidth:"80",
            queryForm: { //查询条件
                userName: null,
                age:'',
                gender:''
            },
            userInfoForm:{
                id:null,
                passWord:null,
                email:null,
                identityId:null,
                roleId:null
            }
        }
    },
    methods: {
        //当前分页
        handleCurrentChange(val){
            this.current = val
            //获取用户点击的当前页后刷新页面数据
            this.getUserInfoList()
        },
        //删除
        deleteUserInfo(scope){
            var r = confirm("是否要删除"+scope.row.userName+"的信息?")
            if(r){
            userInfo.deleteUserInfo(scope.row.id)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type: 'success',
                    message: '删除用户成功!',
                });
                this.getUserInfoList()
                }else{
                    this.$message({
                    type: 'warning',
                    message: '删除用户失败!',
                });
                }
            })
            }else{
                this.$message({
                    type: 'warning',
                    message: '取消删除用户信息!',
                });
            }
        },
        //获取用户列表
        getUserInfoList(){
            userInfo.getUserInfoList(this.current,this.queryForm)
            .then(responce=>{
                if(responce.code!==20000){
                    this.$message({
                    type: 'warning',
                    message: responce.msg,
                });
                }else if(responce.data.pageInfo.records===null){
                    this.userList=responce.data.pageInfo.records
                    this.$message({
                    type: 'warning',
                    message: '未查询到用户信息',
                });
                }else{
                    this.userList=responce.data.pageInfo.records
                    this.total=responce.data.pageInfo.total
                    // this.backQueryForm()
                }
            })
        },
        //恢复查询条件状态
        backQueryForm(){
            this.queryForm.userName=null
            this.queryForm.age=''
            this.queryForm.gender=''
        },
        //编辑
        editManageUser(scope){
            this.getRoleList()
            this.dialogFormVisible=true
            this.userInfoForm.id=scope.row.id //将用户id传入
        },
        //获取角色列表
        getRoleList(){
            perInfo.getRoleList()
            .then(responce=>{
                this.roleList=responce.data.roleList
            })
        },
        //提交用户修改信息
        submitBtn(){
            userInfo.resetUserInfoByAdmin(this.userInfoForm)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type: 'success',
                    message: responce.msg
                });
                this.getUserInfoList()
                }else{
                    this.$message({
                    type: 'warning',
                    message: responce.msg
                });
                }
            })
            this.backUserForm()
            this.dialogFormVisible=false
        },
        //取消
        cancelBtn(){
            this.dialogFormVisible=false
            this.backUserForm()
        },
        //回复用户提交表单信息
        backUserForm(){
            this.userInfoForm.email=null
            this.userInfoForm.passWord=null
            this.userInfoForm.identityId=null
            this.userInfoForm.selectRole=null

        },
        //校验邮箱格式
        checkEmail(){
            var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if(this.userInfoForm.email != '' && !regEmail.test(this.userInfoForm.email)) {
                this.$message({
                    message: '邮箱格式不正确',
                    type: 'error'
                })
                this.userInfoForm.email = ''
            }
        },
    },
    created() {
        //获取用户列表
        this.getUserInfoList()
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
    width: 80%;
    position: absolute;
    top: 50px;
    left: 50%;
    margin-left: -40%;
}
.content-table{
    width: 100%;
    height: 313px;
    margin: 10px 0;
    text-align: center !important;
}
.content>h1{
    font-size: 22px;
    margin: 10px;
    color: rgb(226, 126, 93);
}
.content /deep/ .el-table__cell{
    text-align: center;
    padding: 5px !important;
}
.page{
    margin: 15px 5px;
}
.el-button{
    padding: 8px 18px;
}
.content /deep/.el-dialog{
    width: 30% !important;
}
.el-table{
    height: 316px;
}
</style>