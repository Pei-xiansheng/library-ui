<template>
    <div class="main">
        <div class="log-box">
            <div class="box-l">
                <img :src="imgLeft" alt="每日一图">
            </div>
            <div class="box-r">
                <div class="r-header">
                    <h1>畅游知识的海洋</h1>
                </div>
                <div class="r-bottom">
                    <div class="bottom-hd-l">
                        <h3 @click="changeToReg()">登录</h3>
                    </div>
                    <div class="bottom-hd-r">
                        <h3 @click="changeToLog()">注册</h3>
                    </div>
                </div>
                <div class="r-info-user">
                    <div class="login-box" v-if="!isRegister">
                        <table>
                            <tr>
                                <td style="width: 100px;height: 35px;">用户名:</td>
                                <td style="width: 300px;height: 35px;"><input placeholder="请输入用户名" v-model="loginForm.userName" class="input-one"/></td>
                            </tr>
                            <tr>
                                <td style="width: 100px;height: 35px;">密码:</td>
                                <td style="width: 300px;height: 35px;"><input placeholder="请输入密码" v-model="loginForm.passWord" class="input-one"/></td>
                            </tr>
                            <tr>
                                <td style="width: 150px;height: 35px;">验证码:</td>
                                <td style="width: 300px;height: 35px;"><input  placeholder="请输入验证码" v-model="loginForm.checkNum" class="input-two"/><img id="imgId" @click="changeVerifyCode()" :src="imgStr" alt="验证码" class="input-img"></td>
                            </tr>
                            <tr>
                                <td style="width: 150px;height: 80px;" colspan="2"><button style="width: 150px;height: 40px;border-radius: 5px;" @click="submitLogin()">登录</button></button></td>
                            </tr>
                        </table>
                    </div>
                    <div class="register-box" v-if="isRegister">
                        <table>
                            <tr>
                                <td style="width: 100px;height: 35px;">用户名:</td>
                                <td style="width: 300px;height: 35px;"><input placeholder="请输入用户名" v-model="registerForm.userName" class="input-one"/></td>
                            </tr>
                            <tr>
                                <td style="width: 100px;height: 35px;">密码:</td>
                                <td style="width: 300px;height: 35px;"><input type="text" placeholder="请输入密码" v-model="registerForm.passWord" class="input-one"/></td>
                            </tr>
                            <tr>
                                <td style="width: 100px;height: 35px;">邮箱:</td>
                                <td style="width: 300px;height: 35px;"><input type="text" placeholder="请输入邮箱" v-model="registerForm.email" class="input-one" @blur="checkEmail()"/></td>
                            </tr>
                            <tr>
                                <td style="width: 150px;height: 35px;">验证码:</td>
                                <td style="width: 300px;height: 35px;"><input  type="text" placeholder="请输入验证码" v-model="registerForm.checkNum" class="input-two"/>
                                <button class="reg-btnOne" :value="codeTest" @click="getVerifyNum()">{{codeTest}}</button>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 150px;height: 80px;" colspan="2"><button class="reg-btnTwo" @click="userRegister()">注册</button></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import userInfo from '../api/userInfo.js'
import cookie from 'js-cookie'
export default {
    data() {
        return {
        //登陆或注册状态
        isRegister:false,
        //登录左边图片
        imgLeft:'https://edu-guli-apeng.oss-cn-beijing.aliyuncs.com/bookTest/luoye.jfif',
        //验证码
        imgStr:'http:localhost:9527/lib/usr/getVerifyCode',
        // 登录的初始化数据：备注默认应该是空
        loginForm:{
            userName:'',
            passWord:'',
            checkNum:''
        },
        registerForm:{
            userName:'',
            passWord:'',
            userAvatar:'https://edu-guli-apeng.oss-cn-beijing.aliyuncs.com/2022/01/05/020190cc180545e98032c94fc20b1921avatar07.jfif',
            email:'',
            checkNum:''
        },
        loginInfo:{},
        second:60,
        sending:true,
        codeTest:'验证码',
        }
    },
    methods: {
        //改变登录或注册状态
        changeToReg(){
            this.isRegister=false
        },
        changeToLog(){
            this.isRegister=true
        },
        //更换验证码
        changeVerifyCode(){
            userInfo.getVerifyCode()
            .then(responce=>{
                this.imgStr="data:image/png;base64,"+responce.data.imgCode
            })
        },
        //登录
        submitLogin(){
            userInfo.getTokenInfo(this.loginForm)
            .then(responce=>{
            if(responce.code!==20000){
                this.$message({
                    type: 'warning',
                    message: responce.msg,
                });
            }else{
                cookie.set('user_token',responce.data.tokenStr)
            userInfo.getUserInfo()
            .then(responce=>{
            if(responce.code===20001){
                this.$message({
                    type: 'warning',
                    message: responce.msg,
                });
            }else{
            //保存信息到cookie中
            this.loginInfo=responce.data.userInfo
            cookie.set('user_Info',JSON.stringify(this.loginInfo))
                this.$message({
                    type: 'success',
                    message: '登录成功!'
                });
                //跳转至首页
                this.$router.push({
                    path: '/home'
                })
                }
            })
            }
            })
        },
        //动态获取验证码
        getVerifyNum(){
            userInfo.getVerifyNum(this.registerForm.email)
            .then(responce=>{
            if(!this.sending){
                return
              }
              this.sending=false
              this.timeDown()
            })
        },
        timeDown() {
            let result = setInterval(() => {
            --this.second;
            this.codeTest = this.second
            if (this.second < 1) {
              clearInterval(result);
              this.sending = true;
              this.second = 60;
              this.codeTest = "验证码"
            }
          }, 1000);
        },
        //注册
        userRegister(){
          userInfo.registerUser(this.registerForm)
          .then(responce=>{
              if(responce.code==20000){
                this.$message({
                type: 'success',
                message: responce.msg
              });
              this.isRegister=false
              }else{
                this.$message({
                type: 'warning',
                message: responce.msg
              });
              }
          })
        },
        //校验邮箱格式
        checkEmail(){
            var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (this.registerForm.email != '' && !regEmail.test(this.registerForm.email)) {
                this.$message({
                    message: '邮箱格式不正确',
                    type: 'error'
                })
                this.registerForm.email = ''
            }
        }
    },
    created() {
        this.changeVerifyCode()
    },
}
</script>
<style scoped>
.main{
    width: 100%;
    height: 100vh !important;
    /* background-image: url('https://edu-guli-apeng.oss-cn-beijing.aliyuncs.com/bookTest/daoxiang.jfif'); */
    background-repeat: no-repeat;
    background-size: 100%;
    position: relative;
}
.log-box{
    /* border: sienna solid 1px; */
    border-radius: 10px;
    width: 800px;
    height: 500px;
    position: absolute;
    opacity:0.8;
    top: 50%;
    left: 50%;
    margin-top: -250px !important;
    margin-left: -400px !important;
    box-shadow: 10px 10px 5px #eebe91;
}
.box-l{
    display: block;
    float: left;
    /* border-right: 1px solid darkgoldenrod; */
    border-radius: 10px;
    width: 40%;
    height: 100%;
    overflow: hidden;
}
.box-l img{
    border-radius: 10px;
    transition: all 0.6s;
    width: 100%;
    height: 100%;
}
.box-l img:hover{
    transform: scale(1.1);
}
.box-r{
    display: block;
    float: left;
    border-collapse: collapse;
    border-radius: 10px;
    background-color: wheat;
    width: 60%;
    height: 100%;
}
.r-header{
    border-bottom: brown 4px solid;
    width: 85%;
    margin: 0 auto !important;
}
.r-header>h1{
    font-size: 35px;
    font-style: italic;
    color: rgb(117, 78, 65);
}
.r-bottom{
    width: 90%;
    height: 35px;
    margin: 10px auto !important;
    position: relative;
}
.bottom-hd-l{
    line-height: 35px;
    width: 60px;
    position: absolute;
    left:30%;
}
.bottom-hd-l:hover{
    cursor: pointer;
    border-bottom: salmon 3px solid;
    transform: scale(1.1);
}
.bottom-hd-r{
    line-height: 35px;
    width: 60px;
    position: absolute;
    right: 30%;
}
.bottom-hd-r:hover{
    cursor: pointer;
    width: 60px;
    border-bottom: darkorange 3px solid;
    transform: scale(1.1);
}
.r-info-user{
    width: 100%;
    height: 380px;
    /* border: royalblue 1px solid; */
}
.log-box table{
    text-align: center;
    margin: 20px auto !important;
    border-spacing: 0px 25px;
    font-size: 18px;
    font-weight: bold;
}
.input-one{
    width: 95%;
    height: 100%; 
    border: firebrick 1px solid;
    outline: none;
    font-size: 16px;
    border-radius: 8px;
    padding-left: 15px;
}
.input-two{
    width: 40%;
    height: 100%; 
    border: firebrick 1px solid;
    outline: none;
    font-size: 16px;
    border-radius: 8px;
    display: block;
    float: left;
    padding-left: 15px;
}
.input-img{
    width: 40%;
    height: 100%;
    border: 1px solid darkgoldenrod;
    border-radius: 5px;
    display: block;
    float: right;
    margin-right: 20px !important;
}
.register-box table{
    text-align: center;
    margin: 20px auto !important;
    border-spacing: 0px 18px;
    font-size: 18px;
    font-weight: bold;
}
.reg-btnOne{
    width: 150px;
    height: 40px;
    border-radius: 5px;
}
.reg-btnTwo{
    width: 40%;
    height: 50% ;
    border-radius: 5px;
}
</style>