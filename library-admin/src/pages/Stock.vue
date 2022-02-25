<template>
    <div class="main">
        <el-row class="main-row">
            <el-col :span="6" class="ex-come">
                <el-card class="ex-card-two">
                    <div class="post-header">
                        <h1>图书类别树</h1>
                        <el-tree :data="catTree" :props="defaultProps"></el-tree>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16" class="ex-go">
                <el-card class="ex-card-one">
                    <div class="post-header">
                        <h1>图书数据录入与更新</h1>
                        <el-form label-width="120px">
                            <el-form-item label="信息描述">
                              <el-tag type="info">excel表格模版说明</el-tag>
                              <el-tag>
                                <i class="el-icon-download"/>
                                <a :href="OSS_API">点击下载模版查看</a>
                              </el-tag>
                            </el-form-item>
                            <el-form-item label="选择Excel">
                              <el-upload
                                ref="upload"
                                :auto-upload="false"
                                :on-success="fileUploadSuccess"
                                :on-error="fileUploadError"
                                :disabled="importBtnDisabled"
                                :limit="1"
                                :action="BASE_API+'/lib/deal/file'"
                                name="file"
                                accept=".xls, .xlsx">
                                <el-button slot="trigger" size="small" type="primary">选取excel文件</el-button>
                                <el-button
                                    :loading="loading"
                                    style="margin-left: 10px;"
                                    size="small"
                                    type="success"
                                    @click="submitUpload">解析文件并录入</el-button>
                                </el-upload>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-divider></el-divider>
                    <div class="post-header">
                        <h1>图书数据信息导出</h1>
                        <el-form :inline="true" :model="queryExcelForm" class="demo-form-inline">
                            <el-form-item label="浏览量">
                                <el-select v-model="queryExcelForm.seeNum" placeholder="浏览量">
                                    <el-option label="升序" value="true"></el-option>
                                    <el-option label="降序" value="false"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="借阅量">
                                <el-select v-model="queryExcelForm.brownNum" placeholder="借阅量">
                                    <el-option label="升序" value="true"></el-option>
                                    <el-option label="降序" value="false"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="借阅状态">
                                <el-select v-model="queryExcelForm.brownStatus" placeholder="借阅状态">
                                    <el-option label="否" value="false"></el-option>
                                    <el-option label="是" value="true"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="数据大小">
                                <el-input v-model="queryExcelForm.bookNum" placeholder="请选择导出数据大小"></el-input>
                              </el-form-item>
                        </el-form>
                        <el-button type="primary" @click="getBookByExcel()" style="float: right;margin-right: 50px;">导出数据</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import bookInfo from '../api/bookInfo.js'
export default {
    data() {
        return {
            //接口地址
            BASE_API: 'http://localhost:9527',
            OSS_API: 'https://edu-guli-apeng.oss-cn-beijing.aliyuncs.com/library/excel/bookInfo.xlsx',
            // 按钮是否禁用
            importBtnDisabled: false,
            // 是否加载文件
            loading: false,
            queryExcelForm:{
                seeNum:null,
                brownNum:null,
                brownStatus:null,
                bookNum:null,
                userId:null,
                savePath:'C:\\easyExcel\\BookanAlysisTable.xlsx'
            },
            catTree:[],
            defaultProps: {
                children: 'children',
                label: 'catName'
            },
        }
    },
    methods: {
        // 上传文件
        submitUpload() {
            //按钮取消禁用
            this.importBtnDisabled = true
            this.loading = true
            this.$refs.upload.submit()
        },
        //上传成功
        fileUploadSuccess() {
            //提示信息
            this.loading = false
            this.$message({
                type: 'success',
                message: '上传成功!'
            });
        },
        // 上传失败
        fileUploadError() {
            //提示信息
            this.loading = false
            this.$message({
                type: 'error',
                message: '上传失败!'
            });
        },
        //导出数据
        getBookByExcel(){
            if(!this.queryExcelForm.bookNum||this.queryExcelForm.bookNum.trim()===""){
                this.$message({
                type: 'warning',
                message: '请输入导出数据的大小!'
            });  
            }else{
            this.queryExcelForm.userId=localStorage.getItem('log_Id')
            bookInfo.getBookByExcel(this.queryExcelForm)
            .then(responce=>{
                if(responce.code===20000){
                    this.$message({
                        type: 'success',
                        message: '数据成功保存C盘easyExcel目录下!'
                    });
                }else{
                    this.$message({
                        type: 'warning',
                        message: responce.msg
                    });
                }
            })
            }
        },
        getCatTree(){
            bookInfo.getCatTree(localStorage.getItem('log_Id'))
            .then(responce=>{
                if(responce.code===20000){
                    this.catTree=responce.data.catTree
                }
            })
        }
    },
    created() {
        this.getCatTree()
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
.main-row{
    position: absolute;
    top: 10%; 
    width: 100%;
    /* border: rgb(102, 37, 15) 1px solid; */
}

.post-header h1{
    width: 90%;
    font-size: 25px;
    margin: 25px auto;
    text-align: left;
    padding-left: 8%;
    border-left: tomato 5px solid;
}
.el-tag{
    font-size: 12px;
    margin: 5px;
}
.el-button{
    font-size: 13px;
}
.ex-card-one{
    width: 95%;
    margin: 0px 8%;
}
.ex-card-two{
    width: 85%;
    margin: 0px 25%;
    height: 500px;
}
.el-tree{
    font-size: 25px !important;
    text-align: center !important;
}
</style>