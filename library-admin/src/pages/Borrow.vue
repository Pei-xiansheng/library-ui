<template>
    <div class="main">
        <el-card class="box-card">
            <h1>店内借阅信息记录</h1>
                <el-form :inline="true" :model="queryStarForm" class="demo-form-inline">
                    <el-form-item label="图书名称">
                      <el-input v-model="queryStarForm.bookName" placeholder="请输入图书名称"></el-input>
                    </el-form-item>
                    <el-form-item label="借阅人">
                        <el-input v-model="queryStarForm.userName" placeholder="请输入借阅人姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="归还状态">
                        <el-select v-model="queryStarForm.backStatus" placeholder="是否归还">
                            <el-option label="否" value="false"></el-option>
                            <el-option label="是" value="true"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核状态">
                        <el-select v-model="queryStarForm.agreeStatus" placeholder="是否审核">
                            <el-option label="否" value="false"></el-option>
                            <el-option label="是" value="true"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="逾期状态">
                        <el-select v-model="queryStarForm.backOverStatus" placeholder="是否逾期">
                            <el-option label="否" value="false"></el-option>
                            <el-option label="是" value="true"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="getBroStarInfoList()">查询</el-button>
                    </el-form-item>
                    <el-form-item class="allBtn">
                        <el-button type="primary" @click="checkAllBroStar()">全部审核</el-button>
                        <el-button type="warning" @click="getBroStarInfoList()">全部提醒</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    :data="starList"
                    :border=true
                    class="content-table">
                    <el-table-column
                        prop="bookName"
                        label="图书名称"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="userName"
                        label="借阅人"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="storeName"
                        label="所属书店"
                        width=110>
                    </el-table-column>
                    <el-table-column
                        prop="broTime"
                        label="借阅时间"
                        width=110
                        >
                    </el-table-column>
                    <el-table-column
                        prop="broBackTime"
                        label="归还时间"
                        width=110
                        >
                    </el-table-column>
                    <el-table-column
                        prop="agreeStatus"
                        label="是否审核"
                        width=96>
                        <template slot-scope="scope">
                            {{!scope.row.agreeStatus?'未审核':'已审核' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="backStatus"
                        label="是否归还"
                        width=96>
                        <template slot-scope="scope">
                            {{ scope.row.backStatus?'归还':'未归还' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="backOverStatus"
                        label="是否逾期"
                        width=97>
                        <template slot-scope="scope">
                            {{ scope.row.backOverStatus?'逾期':'未逾期' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="operation"
                        label="操作"
                        >
                        <template slot-scope="scope">
                            <el-button type="primary" v-if="!scope.row.agreeStatus" @click="checkStarInfo(scope)">审核</el-button>
                            <el-button type="info" v-if="scope.row.agreeStatus">已审核</el-button>
                            <el-button type="success" @click="seeBroUserInfo(scope)">查看</el-button>
                            <el-button type="warning"v-if="scope.row.backOverStatus&&!scope.row.backStatus" @click="remindUser(scope)">提醒</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="提醒用户归还图书" :visible.sync="dialogFormVisible">
                    <el-form :model="remindForm">
                        <el-form-item label="用户名称" :label-width="formLabelWidth">
                            <el-input v-model="remindForm.userName"></el-input>
                        </el-form-item>
                        <el-form-item label="提醒信息" :label-width="formLabelWidth">
                            <el-input v-model="remindForm.remindText"></el-input>
                        </el-form-item>
                        <el-form-item label="提醒日期" :label-width="formLabelWidth">
                            <el-date-picker
                                v-model="remindForm.remindTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancelRemBtn()">取 消</el-button>
                        <el-button type="primary" @click="submitRemBtn()">确 定</el-button>
                    </div>
                </el-dialog>
                <el-dialog
                        title="审核心愿单"
                        :visible.sync="centerDialogVisible"
                        width="30%"
                        center>
                        <span>是否通过{{broUser}}的心愿申请?</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="warning" @click="cancelSubmit()">取 消</el-button>
                            <el-button type="primary" @click="confirmSubmit()">确 定</el-button>
                        </span>
                </el-dialog>
                <el-dialog
                        title="查看用户信息"
                        :visible.sync="userDialogVisible"
                        center
                        class="userDialog">
                        <el-descriptions title="用户信息">
                            <el-descriptions-item label="用户名">{{userInfo.userName}}</el-descriptions-item>
                            <el-descriptions-item label="邮箱">{{userInfo.email}}</el-descriptions-item>
                            <el-descriptions-item label="年龄">{{userInfo.age}}</el-descriptions-item>
                            <el-descriptions-item label="性别" v-if="!userInfo.gender">男</el-descriptions-item>
                            <el-descriptions-item label="性别" v-if="userInfo.gender">女</el-descriptions-item>
                            <el-descriptions-item label="身份信息">{{userInfo.identityId}}</el-descriptions-item>
                        </el-descriptions>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="userDialogVisible=false">确 定</el-button>
                        </span>
                </el-dialog>
                <el-pagination
                    @current-change="handleCurrentChange"
                    background
                    layout="prev, pager,next,total"
                    :total="total" 
                    :page-size="limit"
                    :current-page="queryStarForm.current"
                    class="page">
                </el-pagination>
        </el-card>
    </div>
</template>
<script>
import bookInfo from '../api/bookInfo.js'
export default {
    data() {
        return {
            limit:6,
            total: 0, //总记录数
            broUser:'',
            starId:null,
            userInfo:{},
            queryStarForm:{
                current: 1, //当前页
                bookName:null,
                userName:null,
                userId:null,
                backStatus:null,
                backOverStatus:null,
                agreeStatus:null
            },
            starList:[],
            centerDialogVisible:false,
            userDialogVisible:false,
            dialogFormVisible:false,
            formLabelWidth:'80px',
            remindForm:{
                remindId:null,
                userName:null,
                bookId:null,
                remindText:null,
                remindTime:null
            }
        }
    },
    methods: {
        //当前分页
        handleCurrentChange(val){
            this.queryStarForm.current = val
            //获取用户点击的当前页后刷新页面数据
            this.getBroStarInfoList()
        },
        //获取用户所属书店心愿单
        getBroStarInfoList(){
            this.queryStarForm.userId=localStorage.getItem('log_Id')
            bookInfo.getBroStarInfoList(this.queryStarForm)
            .then(responce=>{
                if(responce.code===20000){
                    console.log(responce.data.pageInfo.records)
                    this.starList=responce.data.pageInfo.records
                    this.total=responce.data.pageInfo.total
                }else{
                    console.log(responce.msg)
                }
            })
        },
        //审核心愿单
        checkStarInfo(scope){
            this.broUser=scope.row.userName
            this.starId=scope.row.id
            this.centerDialogVisible=true
        },
        cancelSubmit(){
            this.centerDialogVisible=false
            this.broUser=''
            this.$message.warning('取消审核!')
        },
        confirmSubmit(){
            this.centerDialogVisible=false
            this.broUser=''
            bookInfo.checkStarInfo(this.starId)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type: 'success',
                    message: '审核成功!'
                });
                this.getBroStarInfoList()
                }
            })
        },
        //查看心愿单用户信息
        seeBroUserInfo(scope){
            bookInfo.seeBroUserInfo(scope.row.userName)
            .then(responce=>{
                if(responce.code=20000){
                    this.userInfo=responce.data.userInfo
                    this.userDialogVisible=true
                }else{
                    this.$message({
                    type: 'warning',
                    message: '未获取到用户信息!'
                });
                }
            })

        },
        //审核全部心愿单
        checkAllBroStar(){
            bookInfo.checkAllBroStar()
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type: 'success',
                    message: '审核心愿单成功!'
                });
                this.getBroStarInfoList()
                }
            })
        },
        //提醒用户还书
        remindUser(scope){
            this.remindForm.userName=scope.row.userName
            this.remindForm.bookId=scope.row.bookId
            this.remindForm.remindId=localStorage.getItem('log_Id')
            this.remindForm.remindText='尊敬的'+scope.row.userName+'同学您好!您借阅的《'+scope.row.bookName+'》已经到期!请及时去大和书店归还图书!否则会出现逾期未归还造成违约金!谢谢配合!祝您生活愉快!大和书店!'
            this.dialogFormVisible=true
        },
        cancelRemBtn(){
            this.dialogFormVisible=false
        },
        submitRemBtn(){
            this.dialogFormVisible=false
            bookInfo.remindUser(this.remindForm)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type: 'success',
                    message: '提醒成功!'
                });
                this.getBroStarInfoList()
            }
            })
        }
    },
    created() {
        this.getBroStarInfoList()
    },
}
</script>
<style scoped>
.main{
    position: relative;
    width: 100%;
    height: 95%;
}
a{
    text-decoration: none;
    cursor: pointer;
}
li{
    list-style: none;
}
.box-card {
    width: 95%;
    position: absolute;
    top: 5px;
    left: 50%;
    margin-left: -47.5%;
}
.box-card h1{
    font-size: 22px;
    margin: 5px;
    color: rgb(226, 126, 93);
}
.box-card /deep/ .el-table__cell{
    text-align: center;
    padding: 5px !important;
    cursor: pointer;
}
.el-button{
    width: 61px;
    text-align: center !important;
    padding: 8px 10px !important;
}
.allBtn{
    width: 800px;
    float: right;
    text-align: right;
}
.allBtn .el-button{
    width: 80px;
    margin: 0px 20px;
    padding: 8px 10px !important;
}
.userDialog{
    font-size: 30px !important;
}
.box-card /deep/.el-dialog{
    width: 60% !important;
}
.el-table{
    height: 376px;
}
</style>