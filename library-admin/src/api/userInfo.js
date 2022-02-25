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
    getUserInfoList(currentPage,queryInfo){
        return request({
            url:`/lib/user/getUserInfoList/${currentPage}`,
            method:'post',
            data:queryInfo
        })
    },
    deleteUserInfo(deleteId){
        return request({
            url:`/lib/user/deleteUserInfo/${deleteId}`,
            method:'get',
        })
    },
    resetUserInfoByAdmin(userForm){
        return request({
            url:'/lib/user/resetUserInfoByAdmin',
            method:'post',
            data:userForm
        })
    },
    updateUserInfo(userInfoForm){
        return request({
            url:'/lib/user/updateUserInfo',
            method:'post',
            data:userInfoForm
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