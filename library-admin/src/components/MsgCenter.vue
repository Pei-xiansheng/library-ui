<template>
    <div class="main">
        <el-row :gutter="20" class="main-row">
            <el-col :span="8">
                <el-card class="box-card-one">
                    <h1 class="record" @click="getChatContent()">反馈列表</h1>
                    <h1 class="record" @click="getOldChatContent()">历史记录</h1>
                    <ul>
                        <li v-if="msgList.length===0" class="item">
                            <span style="height: 50px;display: block;line-height: 50px;color: #999;font-style: italic;font-size: 25px;">无反馈消息!</span>
                        </li>
                        <li v-if="msgList.length!==0" class="item" v-for="itemInfo in msgList" :key="itemInfo.id">
                            <a @click="changeChatName(itemInfo)">
                                <img :src="itemInfo.luAvatar" :alt="itemInfo.lmName">
                                <div class="itemContent">
                                <div class="fromDiv">
                                    <span>{{itemInfo.luName}}</span>
                                    <span>{{itemInfo.gmtModified}}</span>
                                </div>
                                <p>{{itemInfo.children[0].lmContent}}</p>
                                <el-badge :value="200" :max="itemInfo.children.length" v-if="!isOld">
                                </el-badge>
                                </div>
                            </a>
                        </li>
                    </ul>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card class="box-card-two">
                    <div class="content" v-if="chatNowName===''">
                        <span class="chatNow"></span>
                        <div class="content-box" id="content-scroll">
                            <div class="nullChatContent">
                                <h1>您还未查看任何通知哦</h1>
                            </div>
                        </div>
                    </div>
                    <div class="content" v-if="chatContent.length!==0">
                        <span class="chatNow">{{chatNowName}}</span>
                        <div class="content-box" id="content-scroll">
                            <div v-for="chatItem in chatContent" :key="chatItem.lmId">
                                <div v-if="chatItem.lmRoute" class="chatBoxRoute">
                                    <img :src="chatNowAvatar" :alt="chatNowName" class="chatImgRoute">
                                    <p class="chatMsgRoute">{{chatItem.lmContent}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import cookie from 'js-cookie'
import chatInfo from '../api/chatInfo.js'
export default {
    data() {
        return {
            user:{},
            text:'',//文本域内容
            msgList:[],//消息列表
            chatNowName:'',
            chatNowAvatar:'',
            chatContent:[],//聊天内容
            isOld:false,//是否是历史反馈列表
            changeStatuInfo:{ //已读回执信息
                fromUserId:'',
                toUserId:''
            }

        }
    },
    methods: {
        //让滚动条始终在底部
        scrollToBottom(){
            this.$nextTick(() => {
            var div = document.getElementById('content-scroll');
                div.scrollTop = div.scrollHeight;
            })
       },
       //获取反馈列表信息
       getChatContent(){
            this.user=cookie.get('user_Info')?JSON.parse(cookie.get('user_Info')):{}
            chatInfo.getChatContent(this.user.userName)
            .then(responce=>{
                this.isOld=false
                this.msgList=responce.data.msgList
            })
        },
        //获取历史反馈列表信息
       getOldChatContent(){
            this.user=cookie.get('user_Info')?JSON.parse(cookie.get('user_Info')):{}
            chatInfo.getOldChatContent(this.user.userName)
            .then(responce=>{
                this.isOld=true
                this.msgList=responce.data.msgList
            })
        },
        //改变聊天对象将信息展示在聊天框内
        changeChatName(itemInfo){
            //清空上一次的聊天记录
            this.chatContent=''
            this.chatNowName=itemInfo.luName
            this.chatNowAvatar=itemInfo.luAvatar
            this.chatContent=itemInfo.children
            this.scrollToBottom()
            if(!this.isOld){
            //已读回执
            this.readBackMsg(itemInfo.fromUserId,itemInfo.toUserId)
            }else{
                this.getOldChatContent()
            }
        },
        readBackMsg(fromUserId,toUserId){
            this.changeStatuInfo.fromUserId=fromUserId
            this.changeStatuInfo.toUserId=toUserId
            chatInfo.changeMessageStatus(this.changeStatuInfo)
            .then(responce=>{
                this.$message({
                type: 'success',
                message: responce.msg,
            });
            this.getChatContent()
            })
        }
    },
    created() {
        this.getChatContent()
    },
    updated(){
        this.scrollToBottom()
        // this.init()
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
}
li{
    list-style: none;
}
.main-row{
    position: absolute;
    top: 2%; 
    width: 100%;
    /* border: darksalmon 1px solid; */
}
.box-card-one{
    height: 520px;
    margin: 20px 5px 20px 130px;
    width: 72%;
}
.box-card-one h1:nth-child(1){
    border-bottom: 2px brown double;
    padding-bottom: 10px;
    font-size: 22px;
    color: rgb(226, 126, 93);
    width: 40%;
    display: block;
    float: left;
    margin-left: 20px;
    transition: 0.3s;
}
.box-card-one h1:nth-child(2){
    border-bottom: 2px brown double;
    padding-bottom: 10px;
    font-size: 22px;
    color: rgb(226, 126, 93);
    width: 40%;
    display: block;
    float: right;
    margin-right: 20px;
    transition: 0.3s;
}
.record:hover{
    transform: scale(1.1);
    cursor: pointer;
}
.box-card-one ul{
    margin-top: 50px;
    height: 430px;
    border:rgb(92, 79, 63) solid 2px;
    overflow-y: scroll;
    overflow: hidden;
}
.box-card-one ul::-webkit-scrollbar {
    display: none;
}
.item{
    border-bottom: 1px #999 solid;
    height: 50px;
    margin-bottom: -1px;
    position: relative;
    cursor: pointer;
    transition: 0.3s;
}
.item:hover{
     transform: scale(1.05);
}
.item a{
    cursor: pointer;
}
.itemContent{
    display: block;
    /* border: aqua 1px solid; */
    float: left;
    height: 45px;
    width: 200px;
}
.item img{
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 5px 15px;
    display: block;
    float: left;
}
.fromDiv{
    width: 200px;
    height: 22px;
    /* border: springgreen 1px solid; */
}
.fromDiv span:nth-child(1){
    display: block;
    float: left;
    height: 20px;
    line-height: 20px;
    color: rgb(146, 54, 92);
    font-size: 15px;
    /* border: rgb(85, 49, 2) 1px solid; */
}
.fromDiv span:nth-child(2){
    display: block;
    float: right;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    color: rgb(153, 131, 131);
    overflow: hidden;
    /* border: rgb(85, 49, 2) 1px solid; */
}
.itemContent p{
    max-width: 160px;
    height: 22px;
    color: #999;
    text-align: left;
    /* padding: 5px 0px; */
    /* border-top: 1px sandybrown solid; */
    display: block;
    float: left;
    margin-top: 2px;
    /* margin: 5px 0px 10px 0px;  */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.itemContent /deep/ .el-badge {
  width: 30px;
  height: 22px;
  display: block;
  float: right;
  /* background-color: blueviolet; */
}
.item:hover{
    background-color: rgb(236, 229, 229);
    z-index: 1;
}
.box-card-two{
    margin: 20px 0px 10px 5px;
    height: 520px;
    width: 70%;
}
.chatNow{
    height: 40px;
    width: 100%;
    font-size: 20px;
    line-height: 40px;
    display: block;
    text-align: left;
    /* padding-left: 20px; */
    border-bottom: #999 1px solid;
}
.content-box {
    border-bottom: 3px solid rgb(141, 23, 23);
    border-top: 3px solid rgb(141, 23, 23);
    margin-top: -1px;
    height: 450px;
    width: 100%;
    overflow-y: scroll;
}
.content-box::-webkit-scrollbar {
    display: none;
}
.nullChatContent{
    font-size: 25px;
    font-style: italic;
    color: #999;
    margin-top: 145px;
}
.chatBoxRoute{
    width: 98%;
    margin: 5px 8px;
    display: block;
    float: left;
}
.chatImgRoute{
    height: 40px;
    width: 40px;
    border-radius: 20px;
    margin: 5px;
    float: left;
}
.chatMsgRoute{
    max-width: 40%;
    border: #999 solid 1px;
    border-radius: 8px;
    background-color: #f5f6f7;
    float: left;
    text-align: left;
    color: #999;
    margin-top: 15px;
    padding: 5px;
}
</style>