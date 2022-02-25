<template>
    <div class="main">
        <el-row :gutter="20" class="main-row">
            <el-col :span="16" class="welcome-img">
                <el-card class="box-card-one">
                    <div class="content">
                        <h1>欢迎使用图书后台管理系统</h1>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card-two">
                        <el-calendar v-model="value">
                        </el-calendar>
                </el-card>
                <el-card class="box-card-three">
                    <div class="poem">
                        <h1>诗文雅颂</h1>
                    </div>
                    <div class="poem-content">
                        <p>{{poemContent.dayContent}}</p>
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
            value: new Date(),
            poemContent:''
        }
    },
    methods: {
        getDayPoem(){
            bookInfo.getDayPoem()
            .then(responce=>{
                this.poemContent=responce.data.poem
            })
        }
    },
    created() {
        this.getDayPoem()
    },
}
</script>
<style scoped>
.main{
    position: relative;
    width: 100%;
    height: 100%;
    
}
.main-row{
    position: absolute;
    top: 6%; 
    width: 100%;
    /* border: darksalmon 1px solid; */
}
.box-card-one{
    width: 90%;
    margin: 35px auto;
    background-image: url('https://edu-guli-apeng.oss-cn-beijing.aliyuncs.com/library/new-welcome.png');
    background-size: 100%;
}
.content{
    margin-bottom: 38%;
    margin-top: 1%;
}
.content>h1{
    height: 100px;
    width: 100%;
    font-size: 50px;
    line-height: 100px;
    font-style: italic;
    color: rgb(233, 150, 122,1);
    /* border:  1px solid darkorange; */
    animation-name: content-title;
    animation-duration: 1.5s;
}
@keyframes content-title{
    0%{
        transform: scale(1);
    }
    100%{
        transform: scale(1.5);
        color: rgb(233, 150, 122,1);
    }
}
.box-card-two{
    width: auto;
    height: 360px;
    margin: 10px 10px 5px 10px;
    opacity:0.6;
}
.box-card-two /deep/ .el-calendar-table .el-calendar-day {
    box-sizing: border-box;
    padding: 8px;
    height: 38px;
}
.el-calendar-table .el-calendar-day:hover {
  background-color: #b42f2f;
}
.box-card-three{
    width: auto;
    height: 120px;
    margin: 10px 10px 5px 10px;
    opacity:0.6;
}
.poem{
    border-bottom: chocolate 2px solid;
    font-size: 20px;
    padding: 2px;
}
.poem-content{
    text-indent: 2em;
    color: #999;
    font-style: italic;
    margin: 5px;
    text-align: left;
}
.poem-content p{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
</style>