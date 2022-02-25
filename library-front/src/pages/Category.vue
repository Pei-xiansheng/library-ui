<template>
    <div class="main">
        <el-col :span="6" class="l-box">
            <el-card class="nav-card">
                <div class="nav-l">
                    <h1>全部</h1>
                    <ul>
                        <li class="nav-item" v-for="catItem in catList" :key="catItem.id" @click="changeCategory(catItem)">{{catItem.catName}}</li>
                    </ul>
                </div>
                <div class="nav-l">
                    <h1>店铺</h1>
                    <ul>
                        <li class="nav-item" v-for="stoItem in storeList" :key="stoItem.id" @click="changeStore(stoItem)">{{stoItem.storeName}}</li>
                    </ul>
                </div>
                <div class="nav-l">
                    <h1>是否借阅</h1>
                    <ul>
                        <li class="nav-item" @click="changeBrown()">已借阅</li>
                        <li class="nav-item" @click="changeBrown()">未借阅</li>
                    </ul>
                </div>
                <div class="nav-l">
                    <h1>热度</h1>
                    <ul>
                        <li class="nav-item" @click="changeBrownHot()">借阅最多</li>
                        <li class="nav-item" @click="changeSeeHot()">浏览最多</li>
                    </ul>
                </div>
            </el-card>
        </el-col>
        <el-col :span="18" class="r-box">
            <el-card class="cat-card">
                <div class="nav-r">
                    <h1>为您查到<span v-if="queryForm.catName!==null">{{queryForm.catName}}</span>有关图书共<span>{{total}}</span>本</h1>
                    <div class="nav-con-list">
                        <ul>
                            <li class="nav-con-item" v-for=" bookItem in catBookList" :key="bookItem.id">
                                <div class="nav-con-img"><img :src="bookItem.bookAvatar" :alt="bookItem.bookName"></div>
                                <div class="nav-con-info">
                                    <h2>{{bookItem.bookName}}</h2>
                                    <span>{{bookItem.author}}</span>
                                    <p>{{bookItem.bookIntro}}</p>
                                    <p>被借次数:{{bookItem.brownNum}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;书店:&nbsp;{{bookItem.storeName}}</p>
                                    <input v-if="!bookItem.brownStatus" type="button" class="brown-btn" value="去借阅" @click="gotoBrownPage(bookItem)"/>
                                    <p v-if="bookItem.brownStatus" style="color: chocolate;border: brown 2px solid; width: 40%;font-weight: 600; text-align: center;padding: 5px;float: right;">已被借阅哦!</p>
                                </div>
                            </li>
                        </ul>
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
                    </div>
                </div>
            </el-card>
        </el-col>
    </div>
</template>
<script>
import orderInfo from '../api/orderInfo.js'
import bookInfo from '../api/bookInfo.js'
export default {
    data() {
        return {
            catList:[],//类别
            catBookList:[],//图书集合
            storeList:[],//店铺列表
            currentStoNum:1,
            limit:12,
            total: 0, //总记录数
            queryForm:{
                current:1,
                catName:null,
                storeId:null,
                broHot:null,
                seeHot:null,
                brownStatus:false
            }
        }
    },
    methods: {
        //获取图书类别
        getCategory(){
            orderInfo.getCategory()
            .then(responce=>{
               this.catList=responce.data.catList
            })
        },
        //改变类别
        changeCategory(item){
            this.$route.params.searchName=null
            this.queryForm.catName=item.catName
            this.getCategoryBookList()
        },
        //获取店铺列表
        getHotStoreList(){
            bookInfo.getHotStoreList(this.currentStoNum)
            .then(responce=>{
                if(responce.code===20000){
                    this.storeList=responce.data.pageInfo.records
                }else{
                    console.log(responce.msg)
                }
            })
        },
        //改变店铺
        changeStore(item){
            this.$route.params.searchName=null
            this.queryForm.storeId=item.id
            this.getCategoryBookList()
        },
        //改变借阅状态
        changeBrown(){
            this.$route.params.searchName=null
            this.queryForm.brownStatus=!this.queryForm.brownStatus
            this.getCategoryBookList()
        },
        //改变借阅最热
        changeBrownHot(){
            this.$route.params.searchName=null
            this.queryForm.broHot=true
            this.getCategoryBookList()
        },  
        //改变浏览最热
        changeSeeHot(){
            this.$route.params.searchName=null
            this.queryForm.seeHot=true
            this.getCategoryBookList()
        },
        //获取分类图书列表
        getCategoryBookList(){
            if(this.$route.params.searchName!=null){
                this.getSearchBookList()
            }else{
            orderInfo.getCategoryBookList(this.queryForm)
            .then(responce=>{
                if(responce.code===20000){
                    this.catBookList=responce.data.pageInfo.records
                    this.total=responce.data.pageInfo.total
                }else{
                    this.$message({
                    type:'warning',
                    message:responce.msg
                })
                }
            })
            }
        },
        //搜索列表
        getSearchBookList(){
        bookInfo.getBookInfoList(this.$route.params.searchName,this.queryForm.current)
            .then(responce=>{
                this.catBookList = responce.data.pageInfo.records
                this.total=responce.data.pageInfo.total
            })
        },
        //当前分页
        handleCurrentChange(val){
            this.queryForm.current = val
            if(this.$route.params.searchName!=null){
                this.getSearchBookList()
            }else{
                this.getCategoryBookList()
            }
        },
        //前往借阅
        gotoBrownPage(item){
            this.$router.push({
            name: '图书借阅',
            params:{
                id:item.id
            }
        })
        }
    },
    created() {
        this.getCategoryBookList()
        this.getCategory()
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
.nav-card{
    width: 90%;
    margin: 20px auto;
}
.cat-card{
    width: 98%;
    margin: 20px auto;
}
.nav-l{
    width: 90%;
    display: block;
    float: left;
    margin-left: 5%;
    margin-top: 5%;
    border-bottom: rgb(207, 203, 203) 2px solid;
}
.nav-l h1{
    font-weight: 500;
    font-size: 20px;
    padding-left: 6%;
    text-align: left;
    display: block;
}
.nav-item{
    width: 25%;
    height: 25px;
    line-height: 25px;
    color: #999;
    display: list-item;
    float: left;
    margin-top: 3%;
    margin-left: 6%;
    cursor: pointer;
    /* border: tomato 1px solid; */
}
.nav-item:hover{
    color:rgb(199, 92, 92);
}
.nav-r h1{
    width: 95%;
    height: 30px;
    text-align: left;
    padding-left: 2%;
    font-weight: 530;
    padding: 10px;
    border-bottom: chocolate solid 2px;
}
.nav-r h1 span{
    color: brown;
    margin: 0px 10px;
}
.nav-con-item{
    width: 43%;
    height: 200px;
    display: list-item;
    float: left;
    margin: 10px 3%;
    border-bottom: brown 2px solid;
}
.nav-con-img{
    width: 26%;
    height: 180px;
    margin: 10px 0px 10px 5px ;
    display: block;
    float: left;
    overflow: hidden;
}
.nav-con-img>img{
    width: 100%;
    height: 180px;
    display: block;
    float: left;
    transition: 0.5s;
}
.nav-con-img>img:hover{
    transform: scale(1.1);
}
.nav-con-info{
    width: 65%;
    height: 180px;
    margin: 10px 5px 0px;
    display: block;
    float: left;
    border-left: steelblue 3px solid;
}
.nav-con-info h2{
    width: 90%;
    font-size: 18px;
    text-align: left;
    padding-left: 10px;
}
.nav-con-info span{
    font-size: 16px;
    font-weight: 600;
    color: tan;
    margin: 5px 0px;
    padding-left: 10px;
    float: left;
}
.nav-con-info p{
    width: 90%;
    float: left;
    color: #999;
    padding-left: 10px;
    text-align: left;
    margin: 5px 0px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.brown-btn{
    width: 60px;
    height: 30px;
    float: right;
    margin-right: 20px;
    font-weight: 600;
    color: chocolate;
    cursor: pointer;
    border: brown 2px solid;
    transition: 0.3s;
    overflow: hidden;
}
.brown-btn:hover{
    transform: scale(1.1);
}
.pg{
    width: 100%;
    display: block;
    float: left;
    margin: 10px auto;
    /* border: thistle 1px solid; */
}
</style>