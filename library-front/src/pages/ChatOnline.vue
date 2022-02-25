<template>
    <div class="main">
        <el-card class="chat-card">
            <div class="body-l">
                <h1>
                    在线列表
                    <span>(点击气泡即可聊天哦)</span>
                </h1>
                <div class="body-up-list">
                    <ul>
                        <li v-for="userName in names" :key="userName">
                            <span style="margin:5px 10px 5px 10px; display: block;float: left;font-size: 20px;font-style: italic; color: #999;">
                                {{userName}}
                            </span>
                            <a style="display: block;margin: 7px 5px 7px 5px;float: left;" @click="giveChatUserName(userName)"><i class="el-icon-chat-dot-round"></i></a>
                            <span style="display: block;float: left; margin:7px 10px 7px 10px;color: rgb(181, 226, 113);" v-if="userName===chatUser">
                                正在chating...
                            </span>
                        </li> 
                    </ul>
                </div>
                <h4>
                    系统广播消息
                </h4>
                <div class="body-down-list">
                    <ul>
                        <li v-for="userName in names" :key="userName">
                            <span style="margin:5px 10px 5px 10px; display: block;float: left;color: rgb(182, 218, 221);font-size: 14px;">
                                您的好友<span>{{userName}}</span>上线了!
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="body-r">
                <h1 style="display: block;float: left;height: 47px; font-size: 20px;color: #999;background-color: rgb(248, 240, 212);width: 100%;">
                    聊天室
                    <span style="color: rgb(182, 81, 81); font-size:16px;line-height: 47px;margin-left: 10px;">{{chatUser}}</span>
                </h1>
                <div class="content" id="content-scroll" v-html="content">
                    
                </div>
                <div class="send">
                    <textarea v-model="text" @keydown.enter.prevent="send()"> 
    
                    </textarea>
                    <input type="button" value="发送" @click="send()"  @keyup.enter="send()" style="width: 80px;height: 30px;background: transparent;border-radius: 5px; display: block;float: right;margin: 5px 10px 5px 10px;cursor: pointer;"></input>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
import cookie from 'js-cookie'
var socket
export default {
    data() {
        return {
            loginInfo:{},
            user:{},
            names:[],
            chatUser:'',
            text:'',
            messages:[],
            content:'',
            talkAvatar:''
        }
    },
    created() {
        this.getUserInfo()
        this.init()
    },
    updated(){
        this.scrollToBottom()
    },
    methods: {
    //获取用户信息
    getUserInfo(){
        var userStr=cookie.get('user_front_Info')
            if(userStr){
            var userInfo = JSON.parse(userStr)
            this.loginInfo=userInfo
        }
    },
    //发送数据
    send(){
        if(!this.chatUser){
            this.$message({
                type:'warning',
                message:'请选择聊天对象'
            })
        }else if(!this.text||this.text.trim()===""){
            this.$message({
                type:'warning',
                message:'请填写聊天内容'
            })
        }else{
            if(typeof(WebSocket)=="undefined"){
                console.log("您的浏览器不支持WebSocket")
            }else{
                console.log("您的浏览器支持WebSocket")
                //拼接发送数据
                let message = {'toName':this.chatUser,'message':this.text,'chatAvatar':this.loginInfo.userAvatar}
                var html = "<div class=\"content-left\" style=\"font-size: 15px;width:460px;height: auto; display: block;float: right;margin: 10px;\">\n"+
                        "<div class=\"content-left-up\" style=\"width: 50px; height: 50px;display: block;float: right;margin: 10px;\">\n"+
                        "<span style=\"height: 40px; width: 40px;line-height: 40px;\">\n"+
                        "<img src=\""+this.loginInfo.userAvatar+"\" style=\"object-fit: cover;width: 100%;height: 100%;border-radius: 25px;\">\n"+
                        "</span>\n"+
                        "</div>\n"+
                        "<div class=\"content-left-down\" style=\"display:block;float: right; margin: 10px;background-color: skyblue;border-radius: 15px;\">\n"+
                        "<div style=\"display: block;min-height: 25px;margin: 10px;width: -webkit-fit-content;width: -moz-fit-content;word-wrap: break-word;\">"+this.text+"</div>\n"+
                        "</div>\n"+
                        "</div>";
                    this.content=this.content+html
                    var toContent=localStorage.getItem(this.chatUser)
                    if(toContent!=null){
                        html=toContent+html
                    }
                    localStorage.setItem(this.chatUser,html)
                    socket.send(JSON.stringify(message))
                    this.text=''
                }
            }
        },
        init(){
            this.user=cookie.get('user_front_Info')?JSON.parse(cookie.get('user_front_Info')):{}
            let username=this.user.userName
            let _this=this
            if(typeof(WebSocket)=="undefined"){
                console.log("您的浏览器不支持WebSocket")
            }else{
                if(socket!=null){
                    socket.close()
                    socket=null
                }
                console.log("您的浏览器支持WebSocket")
                let socketUrl = "ws://localhost:8003/imserver/"+username
                //开启websocket服务
                socket = new WebSocket(socketUrl)
                //打开信道
                socket.onopen=function(){
                    console.log("WebSocket已经打开!")
                }
                //浏览器接收消息，获得从服务端发送过来的文本消息
                socket.onmessage=function(msg){
                    let data = JSON.parse(msg.data)
                    console.log(data)
                    //获取在线人员的信息,并判断是否系统推送消息
                    if(data.system){
                        _this.names=data.message.filter((name)=>name!==username)
                        if(_this.names.length<=1){
                            _this.content=''
                            _this.chatUser=''
                        }
                    }else{
                        //获取聊天对象的头像
                        _this.talkAvatar=data.chatAvatar
                        var html = "<div class=\"content-right\" style=\"font-size: 15px;width:460px;height: auto; display: block;float: left;margin: 10px;\">\n"+
                            "<div class=\"content-right-up\" style=\"width: 50px; height: 50px;display: block;float: left;margin: 10px;\">\n"+
                            "<span style=\"height: 40px; width: 40px;line-height: 40px;\">\n"+
                            "<img src=\""+_this.talkAvatar+"\" style=\"object-fit: cover;width: 100%;height: 100%;border-radius: 25px;\">\n"+
                            "</span>\n"+
                            "</div>\n"+
                            "<div class=\"content-right-down\" style=\"display:block;float: left;margin: 10px;background-color: rgb(135, 235, 165);border-radius: 15px;\">\n"+
                            "<div style=\"display: block;min-height: 25px;margin: 10px;width: -webkit-fit-content;width: -moz-fit-content;word-wrap: break-word;\">"+data.message+"</div>\n"+
                            "</div>\n"+
                            "</div>";
                        if(_this.chatUser==data.fromName){
                            _this.content=_this.content+html
                        }
                        var fromContent = localStorage.getItem(data.fromName)
                        if(fromContent!=null){
                            html=fromContent+html

                        }
                        localStorage.setItem(data.fromName,html)
                    }
                }
                //关闭事件
                socket.onclose=function(){
                    console.log("websocket已经关闭!")
                }
                //发生错误
                socket.onerror=function(){
                    console.log("发生错误!")
                }
            }
        },
        //点击和用户聊天
        giveChatUserName(name){
            //清空聊天记录
            this.content=''
            this.chatUser=name
            var contentStr = localStorage.getItem(this.chatUser)
            if(contentStr!=null){
                this.content=this.content+contentStr
            }
        },
        //让滚动条始终在底部
        scrollToBottom(){
            this.$nextTick(() => {
            var div = document.getElementById('content-scroll');
                div.scrollTop = div.scrollHeight;
            })
       },
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
.chat-card{
    width: 80%;
    margin: 25px auto;
}
.body-l{
    width: 23%;
    display: block;
    float: left;
    border: #999 0.5px solid;
    margin-left: 9%; 
    background-color: rgb(250, 249, 246);
}
.body-l>h1{
    display: block;
    border-bottom: rgb(38, 122, 115) 1px solid;
    float: left;
    font-size: 20px;
    color: rgb(148, 93, 93);
    margin: 5px 10px 5px 10px;
    text-align: center;
}
.body-l h4{
    display: block;
    border-bottom: rgb(22, 139, 134) 1px solid;
    float: left;
    font-size: 20px;
    color: rgb(148, 93, 93);
    margin: 5px 10px 5px 10px;
    text-align: center;
}
.body-l>h1>span{
    display: block;
    float: right;
    color: rgb(206, 198, 157);
    font-size: 13px;
    margin: 5px 10px 10px 10px;
}
.body-up-list{
    display: block;
    float: left;
    width: 100%;
    height: 294px;
    margin: 5px 0px 5px 0px;
    color: darkgoldenrod;
    border-top: tomato 2px solid;
    border-bottom: tomato 2px solid;
    font-size: 15px;
    overflow-y: scroll;
}
.body-up-list>ul{
    width: 100%;
    display: block;
    float: left;
}
.body-up-list>ul>li{
    width: 100%;
    height: 30px;
    border-bottom: darkgreen 1px solid;
}
.body-up-list::-webkit-scrollbar {
    display: none;
}
.body-down-list::-webkit-scrollbar {
    display: none;
}
.body-down-list{
    display: block;
    float: left;
    width: 100%;
    height: 150px;
    margin: 10px 0px 10px 0px;
    color: darkgoldenrod;
    border-top: tomato 2px solid;
    font-size: 15px;
    overflow-y: scroll;
}
.body-down-list>ul{
    width: 100%;
    display: block;
    float: left;
}
.body-down-list>ul>li{
    width: 100%;
    height: 30px;
    font-size: 10px;
    /* border-bottom: darkgreen 1px solid; */
}
.body-down-list>ul::-webkit-scrollbar {
    display: none;
}
.body-r{
    width: 60%;
    display: block;
    float: left;
    border: #999 0.5px solid;
    border-collapse:collapse;
    background-color: rgb(253, 250, 250);
}
.content{
    border-top: rgb(172, 110, 143) 2px solid;
    border-bottom: rgb(172, 110, 143) 2px solid;
    background-color: rgb(253, 250, 250);
    width: 100%;
    height: 350px;
    display: block;
    float: left;
    overflow-y: scroll;  
    background-repeat: no-repeat;
    background-size: 100%;
}
.content::-webkit-scrollbar {
    display: none;
}
.send{
    display: block;
    float: left;
    width: 95%;
    height: 149px;
    margin: 5px 18px 6px 18px;
    background-color: rgb(248, 245, 245);
}
.send>textarea::-webkit-scrollbar {
    display: none;
}
.send>textarea{
    display: block;
    float: left;
    width: 95%;
    height: 100px;
    background: transparent;
    margin: 5px 15px 0px 18px;
    font-size: 18px;
    color: brown;
    outline: none;
    border: none;
    resize: none;
}
</style>