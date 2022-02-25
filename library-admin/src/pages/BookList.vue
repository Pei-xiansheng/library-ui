<template>
    <div class="main">
        <el-card class="box-card">
            <h1>店内图书列表信息</h1>
                <el-form :inline="true" :model="queryBookForm" class="demo-form-inline">
                    <el-form-item label="图书名称">
                      <el-input v-model="queryBookForm.bookName" placeholder="请输入图书名称"></el-input>
                    </el-form-item>
                    <el-form-item label="作者">
                        <el-input v-model="queryBookForm.author" placeholder="请输入作者姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="类别">
                        <el-select v-model="queryBookForm.catName" placeholder="请选择类别">
                            <el-option :label="catItem.catName" :value="catItem.catName" v-for="catItem in catList" :key="catItem.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="queryBookForm.brownStatus" placeholder="是否借出">
                            <el-option label="否" value="false"></el-option>
                            <el-option label="是" value="true"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="getBookList()">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    :data="bookList"
                    :border=true
                    class="content-table">
                    <el-table-column
                        prop="bookName"
                        label="图书名称"
                       >
                    </el-table-column>
                    <el-table-column
                        prop="author"
                        label="作者"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="storeName"
                        label="所属书店"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="bookCat"
                        label="类别"
                        width=80>
                    </el-table-column>
                    <el-table-column
                        prop="brownStatus"
                        label="状态"
                        width=80>
                        <template slot-scope="scope">
                            {{ scope.row.brownStatus?'不在':'在' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="bookStock"
                        label="库存"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        prop="brownNum"
                        label="借阅次数"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="operation"
                        label="操作"
                        width="200">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="editBookInfo(scope)">修改</el-button>
                            <el-button type="warning" @click="delBookInfo(scope)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="修改图书信息" :visible.sync="dialogFormVisible">
                    <el-form :model="bookEditForm">
                        <el-form-item label="图书编号" :label-width="formLabelWidth">
                            <span style="float: left;">{{bookEditForm.id}}</span>
                        </el-form-item>
                        <el-form-item label="图书名称" :label-width="formLabelWidth">
                            <el-input v-model="bookEditForm.bookName"></el-input>
                        </el-form-item>
                        <el-form-item label="图书类别" :label-width="formLabelWidth">
                            <el-input v-model="bookEditForm.bookIntro" @blur="checkEmail()"></el-input>
                        </el-form-item>
                        <el-form-item label="图书作者" :label-width="formLabelWidth">
                            <el-input v-model="bookEditForm.author"></el-input>
                        </el-form-item>
                        <el-form-item label="图书库存" :label-width="formLabelWidth">
                            <el-input v-model="bookEditForm.bookStock"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancelEditBtn()">取 消</el-button>
                        <el-button type="primary" @click="submitEditBtn()">确 定</el-button>
                    </div>
                </el-dialog>
                <el-dialog
                    title="是否删除图书信息"
                    :visible.sync="centerDialogVisible"
                    width="30%"
                    center>
                    <span>您是否确认删除《{{bookEditForm.bookName}}》?</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="centerDialogVisible=false">取 消</el-button>
                        <el-button type="primary" @click="confirmDel()">确 定</el-button>
                    </span>
                </el-dialog>
                <el-pagination
                    @current-change="handleCurrentChange"
                    background
                    layout="prev, pager,next,total"
                    :total="total" 
                    :page-size="limit"
                    :current-page="queryBookForm.current"
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
            limit:12,
            total: 0, //总记录数
            queryBookForm:{
                current:1,
                author:null,
                bookName:null,
                catName:null,
                brownStatus:null,
                userId:null,
            },
            formLabelWidth:80,
            dialogFormVisible:false,
            centerDialogVisible:false,
            catList:[],
            bookList:[],
            bookEditForm:{
                id:null,
                bookName:null,
                bookIntro:null,
                author:null,
                bookStock:null
            }
        }
    },
    methods: {
        //获取图书类别
        getCategory(){
            bookInfo.getCategory()
            .then(responce=>{
               this.catList=responce.data.catList
            })
        },
        //获取图书列表
        getBookList(){
            this.queryBookForm.userId=localStorage.getItem('log_Id')
            bookInfo.getBookList(this.queryBookForm)
            .then(responce=>{
                if(responce.code===20000){
                    console.log(this.bookList)
                    this.bookList=responce.data.pageInfo.records
                    this.total=responce.data.pageInfo.total
                }else{
                    console.log('未获取到图书列表信息!')
                }
            })
        },
        //当前分页
        handleCurrentChange(val){
            this.queryBookForm.current = val
            //获取用户点击的当前页后刷新页面数据
            this.getBookList()
        },
        //编辑图书信息
        editBookInfo(scope){
            this.bookEditForm=scope.row
            this.dialogFormVisible=true
        },
        cancelEditBtn(){
            this.dialogFormVisible=false
        },
        submitEditBtn(){
            bookInfo.editBookInfo(this.bookEditForm)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type: 'success',
                    message: responce.msg
                });
                this.getBookList()
                this.dialogFormVisible=false
                }else{
                    this.$message({
                    type: 'warning',
                    message: responce.msg
                });
                }
            })
        },
        delBookInfo(scope){
            this.centerDialogVisible=true
            this.bookEditForm.bookName=scope.row.bookName
            this.bookEditForm.id=scope.row.id
        },
        confirmDel(){
            bookInfo.delBookInfo(this.bookEditForm.id)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type: 'success',
                    message: responce.msg
                });
                this.getBookList()
                this.centerDialogVisible=false
                }else{
                    this.$message({
                    type: 'warning',
                    message: responce.msg
                });
                this.centerDialogVisible=false
                }
            })
        }
    },
    created() {
        this.getCategory()
        this.getBookList()
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
    width: 95%;
    position: absolute;
    top: 10px;
    left: 50%;
    margin-left: -47%;
}
.box-card h1{
    font-size: 22px;
    margin: 10px;
    color: rgb(226, 126, 93);
}
.box-card /deep/ .el-table__cell{
    text-align: center;
    padding: 5px !important;
    cursor: pointer;
}
.el-table{
    height: 420px;
}
.el-button{
    width: 60px;
    padding: 8px 10px !important;
}
.box-card /deep/.el-dialog{
    width: 50% !important;
}
</style>