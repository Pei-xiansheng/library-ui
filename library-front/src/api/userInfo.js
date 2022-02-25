import request from '../utils/request'

export default{
    getVerifyCode(){
        return request({
            url:'/lib/user/getVerifyCode',
            method:'get',
        })
    },
    getTokenInfo(loginForm){
        return request({
            url:'/lib/user/getTokenInfo',
            method:'post',
            data:loginForm
        })
    },
    getUserInfo(){
        return request({
            url:'/lib/user/getUserInfo',
            method:'get',
        })
    },
    getVerifyNum(email){
        return request({
            url:`/lib/user/getVerifyNum/${email}`,
            method:'get',
        })
    },
    registerUser(registerForm){
        return request({
            url:'/lib/user/register',
            method:'post',
            data:registerForm
        })
    },
    getManageList(){
        return request({
            url:'/lib/per/getManageList',
            method:'get',
        })
    },
    updateUserInfo(userInfoForm){
        return request({
            url:'/lib/user/updateUserInfo',
            method:'post',
            data:userInfoForm
        })
    },
    userClick(userlike){
        return request({
            url:'/lib/like/userClick',
            method:'post',
            data:userlike
        })
    },
    userLogOut(user){
        return request({
            url:'/lib/user/userLogOut',
            method:'post',
            data:user
        })
    }
    
}