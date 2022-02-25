<template>
    <div class="main">
        <el-row class="main-row">
            <el-card class="de-card-one">
                <div class="search-con">
                    <input type="text" v-model="queryBroForm.searchMsg" placeholder="请输入借阅人姓名">
                </div>
                <i class="el-icon-search" id="iSearch" @click="getBrownUserBookList()"></i>
            </el-card>
        </el-row>
        <el-row class="main-row">
            <el-card class="de-card-two">
                <h1>用户借阅表</h1>
                <el-table
                :data="broList"
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
                    prop="storeName"
                    label="所属书店"
                    >
                </el-table-column>
                <el-table-column
                    prop="bookCat"
                    label="类别"
                    width=80
                    >
                </el-table-column>
                <el-table-column
                    prop="backStatus"
                    label="状态"
                    width=80
                    >
                    <template slot-scope="scope">
                        {{ scope.row.backStatus?'归还':'未归还' }}
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
                    label="操作"
                    >
                    <template slot-scope="scope">
                        <el-button type="info" v-if="scope.row.backStatus">已归还</el-button>
                        <el-button type="primary" v-if="!scope.row.backStatus" @click="backBookToStore(scope)">归还</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog
                title="处理用户归还信息"
                :visible.sync="centerDialogVisible"
                width="30%"
                center>
                <span>您是否确认处理【{{userName}}】的归还状态?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible=false">取 消</el-button>
                    <el-button type="primary" @click="confirmDeal()">确 定</el-button>
                </span>
            </el-dialog>
            <el-pagination
                @current-change="handleCurrentChange"
                background
                layout="prev, pager,next,total"
                :total="total" 
                :page-size="limit"
                :current-page="queryBroForm.current"
                class="page">
            </el-pagination>
            </el-card>
        </el-row>
    </div>
</template>
<script>
import bookInfo from '../api/bookInfo.js'
export default {
    data() {
        return {
            limit:12,
            total: 0, //总记录数
            broList:[],
            bookId:null,
            userName:null,
            queryBroForm:{
                current:1,
                adminId:null,
                searchMsg:null
            },
            centerDialogVisible:false
        }
    },
    methods: {
        //当前分页
        handleCurrentChange(val){
            this.queryBroForm.current = val
            //获取用户点击的当前页后刷新页面数据
            this.getBrownUserBookList()
        },
        //获取用户借阅书籍
        getBrownUserBookList(){
            if(!this.queryBroForm.searchMsg||this.queryBroForm.searchMsg.trim()===""){
                this.$message({
                    type: 'warning',
                    message: '请输入查询信息!'
                });  
            }else{
            this.queryBroForm.adminId=localStorage.getItem('log_Id')
            bookInfo.getBrownUserBookList(this.queryBroForm)
            .then(responce=>{
                if(responce.code===20000){
                    if(responce.data.pageInfo.records===null){
                        this.$message({
                        type: 'warning',
                        message: '请核实用户名，未查询到该用户的借阅记录!'
                    });  
                    }else{
                        this.$message({
                        type: 'success',
                        message: '成功查询到该用户的借阅信息!'
                    });  
                    }
                    this.broList = responce.data.pageInfo.records
                    this.total=responce.data.pageInfo.total
                }else{
                    this.$message({
                    type: 'warning',
                    message: '请核实用户名或是否为本店用户!'
                });  
                }
            })
            }
        },
        //归还图书
        confirmDeal(){
            bookInfo.backBookToStore(this.bookId,this.userName)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type: 'success',
                    message: '归还图书成功!'
                });
                this.centerDialogVisible=false
                this.getBrownUserBookList()
                }else{
                    this.$message({
                    type: 'error',
                    message: responce.msg
                });  
                }
            })
        },
        backBookToStore(scope){
            this.centerDialogVisible=true
            this.bookId = scope.row.bookId
            this.userName=scope.row.userName
        }
    },
}
</script>
<style scoped>
.main{
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
.main-row{
    width: 100%;
    /* border: rgb(102, 37, 15) 1px solid; */
}
.de-card-one{
    width: 78%;
    margin: 1% auto;
    height: 50px;
}
.el-button{
    width: 61px;
    text-align: center !important;
    padding: 8px 10px !important;
}
.search-con input{
    font-size: 20px;
    height: 32px;
    line-height: 50px;
    width: 40%;
    border: pink 2px solid;
    color: #999;
    display: block;
    float: left;
    margin-left: 25%;
    padding-left: 15px;
}
.search-con input:focus{
    outline: none;
}
#iSearch{
    display: block;
    float: left;
    margin-left: 2%;
    color: rgb(173, 93, 93); 
    background-color: #E9EEF3; 
    border: 2px solid rosybrown;
    width: 55px;
    height: 30px;
    font-size: 30px;
    border-radius: 10px;
    cursor: pointer;
}
#iSearch:hover{
    background-color: rgb(252, 224, 230);
}
.de-card-two{
    width: 95%;
    height: 500px;
    margin: auto auto;
}
.de-card-two h1{
    width: 90%;
    font-size: 25px;
    margin: 20px auto;
    text-align: left;
    padding-left: 8%;
    border-left: rgb(230, 141, 156) 5px solid;
}
.de-card-two /deep/ .el-table__cell{
    text-align: center;
    padding: 5px !important;
    cursor: pointer;
}
.el-table{
    height: 380px;
}
</style>