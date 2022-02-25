<template>
    <div class="main">
        <el-row class="main-row">
            <el-col :span="12" class="ex-one">
                <el-card class="dis-card-one">
                    <div id="chartBro" class="chart" style="height:500px;width:100%"></div>
                </el-card>
                <el-card class="dis-card-one">
                    <div style="display: block;float: left;width: 100%;">
                        <h1>图书类别热度标签</h1>
                        <el-tag type="warning" class="tag-cat" v-for="item in tagList">{{item.name}}</el-tag>
                    </div>
                    <div style="display: block;float: left;width: 100%;">
                        <h1>书店热度标签</h1>
                        <el-tag type="danger" class="tag-cat" v-for="item in stoList">{{item}}</el-tag>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12" class="ex-one">
                <el-card class="dis-card-two">
                    <h1>图书类别兴趣分析</h1>
                    <div id="chartCat" class="chart" style="height:500px;width:100%"></div>
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
            chartCat:null,
            chartBro:null,
            catList:[],
            xDate:[],
            broDate:[],
            tagList:[],
            stoList:[]
        }
    },
    methods: {
        //图表显示
        showChart(){
            this.initChart()
        },
        initChart(){
            statisticInfo.getUserBookCatLike(localStorage.getItem('log_Id'))
            .then(responce=>{
                if(responce.code===20000){
                    this.catList=responce.data.catMap.catList
                    this.xDate=responce.data.catMap.nameList
                    this.broDate=responce.data.catMap.broList
                    this.setChart()
                    for(var i = 0;i<6;i++){
                        this.tagList.push(this.catList[i])
                    }
                    for(var i = 0;i<3;i++){
                        this.stoList.push(this.xDate[i])
                    }
                }else{
                    console.log('未获取到热度统计图表信息!')
                }
            })
        },
        setChart(){
            // 基于准备好的dom，初始化echarts实例
            this.chartCat = echarts.init(document.getElementById('chartCat'))
            this.chartBro = echarts.init(document.getElementById('chartBro'))
             // 指定图表的配置项和数据
             var optionCat = {
                legend: {
                    top: 'bottom'
                },
                toolbox: {
                    show: true,
                    feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                    }
                },
                series: [
                    {
                    name: '图书类别兴趣分析',
                    type: 'pie',
                    radius: [50, 200],
                    center: ['50%', '50%'],
                    roseType: 'area',
                    itemStyle: {
                        borderRadius: 8
                    },
                    data: this.catList
                    }
                ],
            }
            // 指定图表的配置项和数据
            var optionBro = {
                legend: {
                    data: ['图书借阅量'],
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
                text: '用户每日图书借阅量'
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
                    name: '图书借阅量',
                    data: this.broDate,
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                },
                ],
            }
            this.chartCat.setOption(optionCat)
            this.chartBro.setOption(optionBro)
        }
    },
    created() {
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
    height: 580px;
    margin: 2% auto 0px auto ;
}
.demo-form-inline{
    margin-top: 20px;
}
.dis-card-two h1,.dis-card-one h1{
    width: 90%;
    font-size: 25px;
    margin: 10px auto;
    text-align: left;
    padding-left: 8%;
    border-left: rgb(230, 141, 156) 5px solid;
}
.tag-cat{
    float: left;
    font-size: 15px;
    margin: 10px;
}
</style>