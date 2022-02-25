<template>
    <div class="main">
        <el-card class="art-card">
            <div class="art-hd">
                <ul>
                    <li class="hd-item">
                        <h1>最热推荐</h1>
                    </li>
                </ul>
            </div>
            <div class="art-box">
                <ul>
                    <li class="box-item" v-for="stoItem in storeList" :key="stoItem.id"  @click="gotoStoreDetail(stoItem)"> 
                        <img :src="stoItem.stoImg" :alt="stoItem.storeName">
                        <div class="item-info">
                            <h1>{{stoItem.storeName}}</h1>
                            <p>{{stoItem.recReason}}</p>
                            <span>评分:&nbsp;&nbsp;&nbsp;{{stoItem.recStar}}&nbsp;颗&nbsp;&nbsp;&nbsp;<i class="el-icon-star-off" style="color: gold;font-size: 30px;"></i></span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="pg">
                <el-pagination
                background
                @current-change="handleCurrentChange"
                layout="prev, pager, next, total"
                :total="total" 
                :page-size="limit"
                :current-page="current">
              </el-pagination>
            </div>
        </el-card>
    </div>
</template>
<script>
import bookInfo from '../api/bookInfo.js'
export default {
    data() {
        return {
            value:3.8,
            storeList:[],
            limit:4,
            total: 0, //总记数
            current:1
        }
    },
    methods: {
        //获取最新店铺列表
        getHotStoreList(){
            bookInfo.getHotStoreList(this.current)
            .then(responce=>{
                if(responce.code===20000){
                    this.storeList=responce.data.pageInfo.records
                    this.total=responce.data.pageInfo.total
                }else{
                    console.log(responce.msg)
                }
            })
        },
        //当前分页
        handleCurrentChange(val){
            this.current = val
            //获取用户点击的当前页后刷新页面数据
            this.getHotStoreList()
        },
        //去往店铺页面
        gotoStoreDetail(item){
            this.$router.push({
            name: '书店详情',
            params:{
                id:item.id
            }
        })
        },
    },
    created() {
        this.getHotStoreList()
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
} 
.art-card{
    width: 80%;
    /* height: 800px; */
    margin: 20px auto;
} 
.art-hd{
    width: 100%;
    height: 60px;
    border-bottom: tan 2px solid;
}
.hd-item{
    display: list-item;
    float: left;
    width: 18%;
    height: 60px;
    margin: 0px 20px;

}
.hd-item h1{
    line-height: 60px;
}
.box-item{
    width: 40%;
    height: 420px;
    margin: 10px auto;
    display: list-item;
    float: left;
    margin: 5% 0px 0px 6%;
    cursor: pointer;
    border-radius: 10px;
    border: #999 2px solid;
}
.box-item img{
    width: 85%;
    height: 230px;
    margin: 10px auto;
}
.item-info{
    width: 86%;
    height: 150px;
    margin: 8px 5%;
    padding-left: 10px;
    text-align: left;
    background-color: rgb(250, 245, 247);
    border-left:  3px double #999;
}
.item-info h1{
    font-size: 18px;
}
.item-info p{
    width: 100%;
    height: 76px;
    margin: 10px 0px;
    font-size: 18px;
    font-weight: 500;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
.item-info span{
    font-size: 18px;
    color: #999;
    display: block;
    margin-left: 220px;
}
.pg{
    width: 100%;
    display: block;
    float: left;
    margin: 10px auto;
    /* border: thistle 1px solid; */
}
</style>