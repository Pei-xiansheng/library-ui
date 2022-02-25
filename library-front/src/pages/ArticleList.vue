<template>
    <div class="main">
        <el-card class="art-card">
            <div class="art-hd">
                <ul>
                    <li class="hd-item" @click="getArticleList()">
                        <h1>最新书贴</h1>
                    </li>
                    <li class="hd-item" @click="getHotArticleList()">
                        <h1>最多阅读</h1>
                    </li>
                </ul>
            </div>
            <div class="art-box">
                <ul>
                    <li class="box-item" v-for="artItem in articleList" :key="artItem.id"  @click="gotoArticle(artItem)"> 
                        <img :src="artItem.artImg" :alt="artItem.artTitle">
                        <div class="item-info">
                            <h1>【{{artItem.artTitle}}】</h1>
                            <p>{{artItem.artContent}}</p>
                            <span>{{artItem.artTime}} 阅读:{{artItem.artSee}}</span>
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
                :current-page="queryForm.current">
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
            articleList:[],
            limit:4,
            total: 0, //总记录数
            queryForm:{
                current:1,
                hot:false,
            }
        }
    },
    methods: {
        //获取最新文章列表
        getArticleList(){
            this.queryForm.hot=false
            bookInfo.getArticleList(this.queryForm)
            .then(responce=>{
                if(responce.code===20000){
                    this.articleList=responce.data.pageInfo.records
                    this.total=responce.data.pageInfo.total
                }else{
                    console.log(responce.msg)
                }
            })
        },
        //获取最多阅读
        getHotArticleList(){
            this.queryForm.hot=true
            bookInfo.getArticleList(this.queryForm)
            .then(responce=>{
                if(responce.code===20000){
                    this.articleList=responce.data.pageInfo.records
                    this.total=responce.data.pageInfo.total
                }else{
                    console.log(responce.msg)
                }
            })
        },
        //当前分页
        handleCurrentChange(val){
            this.queryForm.current = val
            //获取用户点击的当前页后刷新页面数据
            this.getArticleList()
        },
        //去往文章页面
        gotoArticle(item){
            this.$router.push({
            name: '书贴',
            params:{
                id:item.id
            }
        })
        },
    },
    created() {
        this.getArticleList()
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
    width: 66%;
    /* height: 800px; */
    margin: 20px auto;
} 
.art-hd{
    width: 100%;
    height: 60px;
    border-bottom: tan 1px solid;
}
.hd-item{
    display: list-item;
    float: left;
    width: 18%;
    height: 60px;
    margin: 0px 20px;
    cursor: pointer;
}
.hd-item:hover{
    border-bottom: sandybrown 2px solid;
    color: sandybrown;
}
.hd-item h1{
    line-height: 60px;
}
.box-item{
    width: 95%;
    height: 180px;
    margin: 10px auto;
    cursor: pointer;
    border-bottom: #999 2px solid;
}
.box-item img{
    width: 16%;
    height: 140px;
    margin: 10px 0px;
    display: block;
    float: left;
}
.item-info{
    width: 76%;
    display: block;
    float: left;
    margin: 8px 2%;
    padding-left: 10px;
    text-align: left;
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
    margin-left: 400px;
}
.pg{
    width: 100%;
    display: block;
    float: left;
    margin: 10px auto;
    /* border: thistle 1px solid; */
}

</style>