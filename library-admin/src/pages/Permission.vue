<template>
    <div class="main">
        <el-row :gutter="20" class="main-row">
            <el-col :span="6" class="welcome-img">
                <el-card class="box-card-one">
                    <div class="content">
                        <h1>权限树形图</h1>
                        <el-tree :data="treeList" :props="defaultProps"></el-tree>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="18">
                <el-card class="box-card-two">
                    <div class="content">
                        <h1>图书管理权限分配表</h1>
                        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                            <el-form-item label="用户名">
                              <el-input v-model="queryForm.userName" placeholder="用户名"></el-input>
                            </el-form-item>
                            <el-form-item label="角色">
                                <el-select v-model="queryForm.selectRole" placeholder="选择条件">
                                    <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.roleName"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                              <el-button type="primary" @click="getUserManagePageList()">查询</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="success" @click="addRole()">添加角色</el-button>
                              </el-form-item>
                        </el-form>
                        <el-table
                                :data="perList"
                                :border=true
                                class="content-table">
                            <el-table-column
                                prop="userName"
                                label="用户名"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                prop="roleName"
                                label="角色"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                prop="remark"
                                label="权限描述">
                            </el-table-column>
                            <el-table-column
                                prop="operation"
                                label="操作"
                                width="200">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="editManageUser(scope)">修改</el-button>
                                    <el-button type="warning" @click="relieveUserRole(scope)">解除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-dialog :title="title" :visible.sync="dialogFormVisible">
                            <el-form :model="manageForm">
                                <el-form-item v-if="isAdd" label="添加角色" :label-width="formLabelWidth">
                                    <el-input v-model="manageForm.roleName"></el-input>
                                </el-form-item>
                                <el-form-item v-if="isAdd" label="父角色ID" :label-width="formLabelWidth">
                                    <el-select v-model="manageForm.fatherId" placeholder="请选择父角色ID">
                                        <el-option v-for="item in roleList" :key="item.id" :label="item.id+' '+item.roleName" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="isAdd" label="角色描述" :label-width="formLabelWidth">
                                    <el-input v-model="manageForm.remark"></el-input>
                                </el-form-item>
                                <el-form-item v-if="!isAdd" label="选择角色" :label-width="formLabelWidth">
                                <el-select v-model="manageForm.selectRole" placeholder="请选择角色">
                                    <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.roleName"></el-option>
                                </el-select>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="cancelBtn()">取 消</el-button>
                                <el-button type="primary" @click="submitBtn()">确 定</el-button>
                            </div>
                        </el-dialog>
                        <el-pagination
                            @current-change="handleCurrentChange"
                            background
                            layout="prev, pager, next,total"
                            :total="total" 
                            :page-size="limit"
                            :current-page="current"
                            class="page">
                        </el-pagination>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import perInfo from '../api/perInfo.js'
export default {
    data() {
        return {
            current: 1, //当前页
            limit:4,
            total: 0, //总记录数
            perList:[],//分页列表
            roleList:[],
            queryForm: { //查询条件
                userName: null,
                selectRole: null
            },
            treeList: [],//层级树
            defaultProps: {
                children: 'children',
                label: 'roleName'
            },
            isAdd:false,
            title:'',
            //编辑弹窗
            dialogFormVisible: false,
            formLabelWidth: '80px',
            manageForm: {
                id:'',
                fatherId:'',
                roleName: '',
                selectRole: '',
                remark:''
            },
        }
    },
    methods: {
        //获取角色列表
        getRoleList(){
            perInfo.getRoleList()
            .then(responce=>{
                this.roleList=responce.data.roleList
            })
        },
        getTreeList(){
            perInfo.getTreeList()
            .then(responce=>{
                if(responce.code!==20000){
                    this.$message({
                    type: 'warning',
                    message: responce.msg,
                });
                }else{
                    this.treeList=responce.data.treeList
                }
            })
        },
        //获取分页模型
        getUserManagePageList(){
            perInfo.getUserManagePageList(this.current,this.queryForm)
            .then(responce=>{
                if(responce.code!==20000){
                    this.$message({
                    type: 'warning',
                    message: responce.msg,
                });
                }else{
                    this.perList=responce.data.pageInfo.records
                    this.total=responce.data.pageInfo.total
                }
            })
            .catch(error => {
                this.$message({
                    type: 'warning',
                    message: responce.msg,
                });                
            })
        },
        //当前分页
        handleCurrentChange(val){
            this.current = val
            //获取用户点击的当前页后刷新页面数据
            this.getUserManagePageList()
        },
        //添加
        addRole(){
            this.title='添加角色'
            this.isAdd=true
            this.dialogFormVisible = true
            this.getRoleList()
        },
        //编辑
        editManageUser(scope){
            this.title='编辑用户权限'
            this.isAdd=false
            this.getRoleList()
            this.dialogFormVisible = true
            this.manageForm.selectRole=scope.row.roleName
            this.manageForm.id=scope.row.id
        },
        //解除关系
        relieveUserRole(scope){
            var flag=confirm("是否要解除"+scope.row.roleName+'与'+scope.row.userName+'的权限身份')
            if(flag){
            perInfo.relieveUserRole(scope.row.id)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                    type: 'success',
                    message: responce.msg,
                });
                this.getUserManagePageList()
                }else{
                    this.$message({
                    type: 'warning',
                    message: '解除关系失败!',
                });
                }
            })
            }else{
                this.$message({
                    type: 'warning',
                    message: '取消解除关系!',
                });
            }
        },
        //提交信息
        submitBtn(){
            this.dialogFormVisible = false
            this.isAdd=false
            var str = this.manageForm.roleName
            str = str.replace(/\s*/g,'')
            if(str===''){
            perInfo.changeUserRole(this.manageForm)
            .then(responce=>{
                if(responce.code=20000){
                    this.$message({
                    type: 'success',
                    message: '修改成功!'
                });
                this.backManageForm()
                }else{
                    this.$message({
                    type: 'warning',
                    message: '修改失败!'
                }); 
                }
            })
            }else{
                console.log(this.manageForm)
                perInfo.addNewRole(this.manageForm)
                .then(responce=>{
                    if(responce.code===20000){
                        this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    this.getTreeList()
                    this.backManageForm()
                    }else{
                        this.$message({
                        type: 'warning',
                        message: '添加失败!'
                    }); 
                    }
                })
                this.manageForm.roleName=''
                this.manageForm.id=''
            }
        },
        //取消提交
        cancelBtn(){
            this.dialogFormVisible = false
            this.isAdd=false
            this.manageForm.roleName=''
            this.manageForm.id=''
        },
        //恢复表单信息
        backManageForm(){
            this.getUserManagePageList() 
            this.manageForm.roleName=''
            this.manageForm.id=''
            this.manageForm.fatherId=''
        }
    },
    created() {
        //获取层级树
        this.getTreeList()
        //获取权限管理列表
        this.getUserManagePageList()
        //获取角色列表
        this.getRoleList()
    },
}
</script>
<style scoped>
.main{
    position: relative;
    width: 100%;
    height: 95%;
}
.main-row{
    position: absolute;
    top: 10%; 
    width: 100%;
    /* border: darksalmon 1px solid; */
}
.box-card-one{
    margin-left: 10px;
}
.content>h1{
    font-size: 22px;
    color: rgb(226, 126, 93);
}
.demo-form-inline{
    /* border: darksalmon 1px solid; */
    padding: 10px;
}
.demo-form-inline /deep/ .el-form-item__label{
    font-size: 15px;
    font-weight: bold;
}
.content-table{
    width: 100%;
    height: 278px;
    margin: 10px 0;
    text-align: center !important;
}
.content /deep/ .el-table__cell{
    text-align: center;
}
.page{
    margin: 15px 5px;
}
.el-button{
    padding: 8px 18px;
}
.content /deep/ .el-tree{
    margin-top: 20px;
}
.content /deep/ span.el-tree-node__label{
    font-size: 18px;
}
.content /deep/.el-dialog{
    width: 30% !important;
}
</style>