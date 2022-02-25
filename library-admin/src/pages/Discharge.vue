<template>
    <div class="main">
        <el-row class="main-row">
            <el-col :span="12" class="ex-one">
                <el-card class="dis-card-one">
                    <div id="chartLog" class="chart" style="height:500px;width:100%"></div>
                </el-card>
                <el-card class="dis-card-one">
                    <div id="chartReg" class="chart" style="height:500px;width:100%"></div>
                </el-card>
            </el-col>
            <el-col :span="12" class="ex-one">
                <el-card class="dis-card-two">
                    <h1>选择流量统计查询日期</h1>
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item>
                        <el-date-picker
                            v-model="searchObj.beginTime"
                            type="date"
                            placeholder="选择开始日期"
                            value-format="yyyy-MM-dd" />
                        </el-form-item>
                        <el-form-item>
                        <el-date-picker
                            v-model="searchObj.endTime"
                            type="date"
                            placeholder="选择截止日期"
                            value-format="yyyy-MM-dd" />
                        </el-form-item>
                        <el-button
                        :disabled="btnDisabled"
                        type="primary"
                        icon="el-icon-search"
                        @click="showChart()">查询</el-button>
                    </el-form>
                    <div id="chartSee" class="chart" style="height:500px;width:100%"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import echarts from 'echarts'
import statisticInfo from '../api/statisticInfo.js'
export default {
    data() {
        return {
            searchObj:{
                beginTime:'',
                endTime:''
            },
            btnDisabled:false,
            chartLog:null,
            chartReg:null,
            chartSee:null,
            xDate:[],
            logDate:[],
            regDate:[],
            seeDate:[],
            postDate:[],
            mapDate:[]
        }
    },
    methods: {
        //图表显示
        showChart(){
            this.initChart()
        },
        initChart(){
            statisticInfo.getDischargeStatistic(this.searchObj)
            .then(responce=>{
                if(responce.code===20000){
                    this.xDate=responce.data.staMap.dateList
                    this.logDate=responce.data.staMap.logList
                    this.regDate=responce.data.staMap.regList
                    this.seeDate=responce.data.staMap.seeList
                    this.postDate=responce.data.staMap.postList
                    this.mapDate=responce.data.staMap.mapList
                    this.setChart()
                }else{
                    console.log('未获取到统计图表信息!')
                }
            })
        },
        setChart(){
            // 基于准备好的dom，初始化echarts实例
            this.chartLog = echarts.init(document.getElementById('chartLog'))
            this.chartReg = echarts.init(document.getElementById('chartReg'))
            this.chartSee = echarts.init(document.getElementById('chartSee'))
             // 指定图表的配置项和数据
             var optionLog = {
                legend: {
                    data: ['每日在线']
                },
                // x轴是类目轴（离散数据）,必须通过data设置类目数据
                xAxis: {
                    type: 'category',
                    data: this.xDate//-------绑定数据
                },
                // y轴是数据轴（连续数据）
                yAxis: {
                    type: 'value'
                },
                //图表名
                title: {
                text: '用户每日在线数据'
                },
                //调整大小
                grid: {
                    left: '2%',
                    right: '2%',
                    bottom: '50%',
                    containLabel: true
                },
                //X轴触发
                tooltip: {
                trigger: 'axis'
                },
                // 系列列表。每个系列通过 type 决定自己的图表类型
                series: [
                    {
                    //y轴名称
                    name: '每日在线',
                    // 系列中的数据内容数组
                    data: this.logDate,//-------绑定数据
                    // 折线图
                    type: 'line'
                    },
                ],
            }
            // 指定图表的配置项和数据
            var optionReg = {
                legend: {
                    data: ['每日注册']
                },
                // x轴是类目轴（离散数据）,必须通过data设置类目数据
                xAxis: {
                    type: 'category',
                    data: this.xDate//-------绑定数据
                },
                // y轴是数据轴（连续数据）
                yAxis: {
                    type: 'value'
                },
                //图表名
                title: {
                text: '用户每日注册数据'
                },
                //调整大小
                grid: {
                    left: '2%',
                    right: '2%',
                    bottom: '50%',
                    containLabel: true
                },
                //X轴触发
                tooltip: {
                trigger: 'axis'
                },
                // 系列列表。每个系列通过 type 决定自己的图表类型
                series: [
                    {
                    //y轴名称
                    name: '每日注册',
                    // 系列中的数据内容数组
                    data: this.regDate,//-------绑定数据
                    // 折线图
                    type: 'line'
                    },
                ],
            }
            // 指定图表的配置项和数据
            var optionSee = {
                legend: {
                    data: ['借阅兴趣','书贴兴趣','图书搜索热度'],
                    left: '50%'
                },
                // x轴是类目轴（离散数据）,必须通过data设置类目数据
                xAxis: {
                    type: 'category',
                    data: this.xDate//-------绑定数据
                },
                // y轴是数据轴（连续数据）
                yAxis: {
                    type: 'value'
                },
                //图表名
                title: {
                text: '用户每日网站浏览信息数据'
                },
                //调整大小
                grid: {
                    left: '2%',
                    right: '2%',
                    bottom: '20%',
                    containLabel: true
                },
                //X轴触发
                tooltip: {
                trigger: 'axis'
                },
                // 系列列表。每个系列通过 type 决定自己的图表类型
                series: [
                {
                    //y轴名称
                    name: '借阅兴趣',
                    data: this.seeDate,
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                },
                {
                    //y轴名称
                    name: '书贴兴趣',
                    data: this.postDate,
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(235, 155, 129, 0.2)'
                    }
                },
                {
                    //y轴名称
                    name: '图书搜索热度',
                    data: this.mapDate,
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(213, 183, 248, 0.2)'
                    }
                },
                ],
            }
            this.chartLog.setOption(optionLog)
            this.chartReg.setOption(optionReg)
            this.chartSee.setOption(optionSee)
        },
        getNowTime(){
            let date1 = new Date(new Date());
            //今天时间
            this.searchObj.endTime =
                date1.getFullYear() +
                "-" +
                (date1.getMonth() + 1) +
                "-" +
                date1.getDate();
            let date2 = new Date(date1);
            date2.setDate(date1.getDate() -6);
            this.searchObj.beginTime =
                date2.getFullYear() +
                "-" +
                (date2.getMonth() + 1) +
                "-" +
                date2.getDate();
            }
    },
    created() {
        this.getNowTime()
        this.showChart()
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
.dis-card-one{
    width: 95%;
    height: 280px;
    margin: 2% auto 0px auto ;
}
.dis-card-two{
    width: 95%;
    height: 560px;
    margin: 3% auto 0px auto ;
}
.demo-form-inline{
    margin-top: 20px;
}
.dis-card-two h1{
    width: 90%;
    font-size: 25px;
    margin: 20px auto;
    text-align: left;
    padding-left: 8%;
    border-left: rgb(230, 141, 156) 5px solid;
}
</style>