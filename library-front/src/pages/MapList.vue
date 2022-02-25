<template>
    <div class="main">
        <el-row class="main-row">
            <el-col :span="18" class="left-box">
                <el-card class="map-card">
                    <div id="allmap" ref="allmap"></div>
                </el-card>
            </el-col>
            <el-col :span="6" class="right-box">
                <el-card class="search-card">
                    <h1>搜寻书店</h1>
                    <div class="content-r">
                        <input type="text" v-model="searchStr" v-on:mouseover="getUserSearchMapList()"><div class="search"><input type="button" value="搜索" @click="getUserSearchMapList()"></input></div>
                        <div class="content-down">
                            <ul v-if="userSearchAreaList.results">
                                <li v-for="areaInfo in userSearchAreaList.results" :key=areaInfo.uid>
                                    <a @click="getLatLng(areaInfo)">
                                    <p><span style="color: indianred;">名字:</span> :{{areaInfo.name}}</p>
                                    <p><span style="color: indianred;">地址:</span>{{areaInfo.address}}</p>
                                    <p v-if="areaInfo.telephone"><span style="color: indianred;">电话:</span>{{areaInfo.telephone}}</p>
                                </a>
                                </li>
                            </ul>
                            <ul v-else>
                                <li>
                                    <h1 style="color: #999;font-size: 18px;display: block;text-align: center; margin: 15px;">请输入您要查询的位置</h1></h1>
                                </li>
                            </ul>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import userMap from '../api/userMap'
import cookie from 'js-cookie'
export default {
    data() {
        return {
        x:'',
        y:'',
        maps:{},
        userMap:{},
        lat:'',
        lng:'',
        userSearchAreaList:[],
        userSearchInfo:{
            queryName:''
        },
        searchStr:'',
        }
    },
    methods: {
    //获取当前个人IP
    getNowIp(){
    userMap.getNowIp()
    .then(responce=>{
        this.userMap=responce.data.body
        this.x = parseFloat(this.userMap.content.point.x)
        this.y = parseFloat(this.userMap.content.point.y)
        //初始化地图
        this.initMap(this.x,this.y)
    })
    },
    //获取搜索内容
    getUserSearchMapList(){
        this.userSearchInfo.queryName=this.searchStr
        userMap.getUserAreaList(this.userSearchInfo)
        .then(responce=>{
            this.userSearchAreaList=responce.data.areaList
        })
    },
    initMap(x,y){
        // 创建地图实例  
        const map = new BMap.Map(this.$refs.allmap);
        this.maps=map
        // 创建点坐标  
        var point = new BMap.Point(x,y);
        // 初始化地图，设置中心点坐标和地图级别  
        map.centerAndZoom(point, 15);
        //开启缩放功能
        map.enableScrollWheelZoom(true);
        //禁用拖拽
        // map.disableDragging()
        map.addControl(new BMap.NavigationControl())
        map.addControl(new BMap.OverviewMapControl())
        map.addControl(new BMap.ScaleControl())
        map.addControl(new BMap.MapTypeControl())
        map.addControl(new BMap.GeolocationControl())
        
        //获取当前位置的信息
        var opts = {    
            width : 250,     // 信息窗口宽度    
            height: 120,     // 信息窗口高度    
            title : this.userMap.content.address  // 信息窗口标题   
        }   
        var marker = new BMap.Marker(point)
        map.clearOverlays()
        map.addOverlay(marker);
        var info =`<span style='margin: 5px;color: #999;'>邮政编码:</span>`+this.userMap.content.address_detail.adcode+"<br/>"
        +`<span style='margin: 5px;color: #999;'>城市编码:</span>`+this.userMap.content.address_detail.city_code
        // 创建信息窗口对象    
        var infoWindow = new BMap.InfoWindow(info, opts); 
        // 打开信息窗口    
        map.openInfoWindow(infoWindow,point);
        //计算路线
        map.addEventListener("click",function(e){
            var p2 =new BMap.Point(e.point.lng,e.point.lat);
            var marker = new BMap.Marker(p2);
            //准备模拟用户马里奥
            var myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/Mario.png", new BMap.Size(50, 80), { 
            imageOffset: new BMap.Size(0, 0)    
        });
        map.clearOverlays()
        map.addOverlay(marker)
            marker.setAnimation(Animation);
            var driving = new BMap.DrivingRoute(map,
            {
                renderOptions:{
                    map:map,
                    autoViewport:true
                }
            }
            )
            driving.search(point,p2)
            //马里奥开始模拟路线
            var driving = new BMap.DrivingRoute(map);    //驾车实例
            driving.search(point,p2);
            driving.setSearchCompleteCallback(function(){
            var pts = driving.getResults().getPlan(0).getRoute(0).getPath();    //通过驾车实例，获得一系列点的数组
            var paths = pts.length;    //获得有几个点
            var carMk = new BMap.Marker(pts[0],{icon:myIcon});
            map.addOverlay(carMk);
            var i=0;
            function resetMkPoint(i){
                carMk.setPosition(pts[i]);
                if(i < paths){
                    setTimeout(function(){
                        i++;
                        resetMkPoint(i);
                    },100);
                }
            }
            setTimeout(function(){
                resetMkPoint(5);
            },1000)
        });
        })
    },
    getLatLng(areaInfo){
        // 创建地图实例  
        var y = parseFloat(areaInfo.location.lat)
        var x = parseFloat(areaInfo.location.lng)
        // 创建点坐标  
        var point = new BMap.Point(x,y);
        //获取当前位置的信息
        var opts = {    
            width : 250,     // 信息窗口宽度    
            height: 100,     // 信息窗口高度    
            title : areaInfo.name  // 信息窗口标题   
        }   
        var marker = new BMap.Marker(point)
        // map.clearOverlays()
        this.maps.addOverlay(marker);
        var info =`<span style='margin: 5px;color: #999;'>名字:</span>`+areaInfo.name+"<br/>"
        +`<span style='margin: 5px;color: #999;'>地址:</span>`+areaInfo.address
        // 创建信息窗口对象    
        var infoWindow = new BMap.InfoWindow(info, opts); 
        // 打开信息窗口    
        this.maps.openInfoWindow(infoWindow,point);
    },
    },
    created() {
        this.getNowIp()
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
    /* height: 2200px; */
}
#allmap{
    width: 100%;
    height: 800px;
    /* border: 1px solid darkgoldenrod ; */
    display: block;
    float: left;
    margin: 0px;
}
.main-row{
    width: 100%;
    /* border: darksalmon 1px solid; */
}
.left-box{
    margin-left: 3%;
    width: 65%;
    /* border: rebeccapurple 1px solid; */
}
.right-box{
    margin-right: 3%;
    margin-left: 1%;
    width: 28%;
    /* border: springgreen 1px solid; */
}
.map-card{
    margin-top: 20px;
    height: 800px;
}
.search-card{
    margin-top: 20px;
    height: 600px;
    background-color: rgb(245, 240, 238);
}
.search-card h1{
    width: 80%;
    height: 40px;
    line-height: 40px;
    display: block;
    margin: 10px auto;
    border-left: 4px solid firebrick;
}
.content-r{
    width: 100%;
}
.content-r>input{
    display: block;
    float: left;
    margin: 10px;
    color: brown;
    font-size: 20px;
    width: 250px;
    height: 30px;
}
.body{
    display: inline-block;
    /* border: hotpink 1px solid; */
    width: 100%;
    height: 100%;
    margin: 0px;
}
.search{
    display: block;
    width: 40px;
    height: 30px;
    float: left;
    margin: 10px 15px 10px 5px;
}
.search>input{
    display: block !important;
    float: left !important;
    font-size: 15px !important;
    width: 80px;
    height: 35px;
    border-radius: 5px;
    cursor: pointer;
    background-color: rgb(223, 184, 166);
}
.search>input:focus{
    border: 0 none;
    outline: none;
}
.content-down{
    display:block;
    margin-top: 20px;
    width: 100%;
    height: 80vh;
    border-top:rgb(216, 183, 35) solid 3px;
    overflow-y: hidden;
}
.content-down>ul{
    display: block;
    width: 100%;
    height: 80vh;
    float: left;
    overflow-y: scroll;
}
.content-down>ul::-webkit-scrollbar {
    display: none;
}
.content-down>ul>li{
    width: 95%;
    height: 65px;
    margin: 5px auto;
    border-radius: 3px;
    border: rgb(185, 159, 185) 2px solid;
    cursor: pointer;
}
li:hover{
    background-color: rgb(243, 212, 212);
}
.content-down>ul>li>a p{
    color: dimgrey;
    font-size: 15px;
    margin: 2px;
    text-align: left;
    padding-left: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>