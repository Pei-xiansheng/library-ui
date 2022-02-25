import request from '../utils/request'

export default{
    getBannerList(){
        return request({
            url:'/lib/manage/getBannerList',
            method:'get'
        })
    },
    increaSeeNum(postId){
        return request({
            url:`/lib/manage/increaSeeNum/${postId}`,
            method:'get'
        })
    },
    getPostList(){
        return request({
            url:'/lib/manage/getPostList',
            method:'get'
        })
    },
    getArticleList(queryForm){
        return request({
            url:'/lib/manage/getArticleList',
            method:'post',
            data:queryForm
        })
    },
    getArticleDetail(artId){
        return request({
            url:`/lib/manage/getArticleDetail/${artId}`,
            method:'get'
        })
    },
    getComponentList(artComId,current){
        return request({
            url:`/lib/manage/getComponentList/${artComId}/${current}`,
            method:'get'
        })
    },
    submitCom(comContent){
        return request({
            url:'/lib/manage/submitCom',
            method:'post',
            data:comContent
        })
    },
    getHotComponentList(){
        return request({
            url:'/lib/manage/getHotComponentList',
            method:'get'
        })
    },
    getHotStoreList(currentNum){
        return request({
            url:`/lib/manage/getHotStoreList/${currentNum}`,
            method:'get'
        })
    },
    getStoreDetail(stoId){
        return request({
            url:`/lib/manage/getStoreDetail/${stoId}`,
            method:'get'
        })
    },
    getStoComponentList(stoComId,curNum){
        return request({
            url:`/lib/manage/getStoComponentList/${stoComId}/${curNum}`,
            method:'get'
        })
    },
    submitStoCom(stoContent){
        return request({
            url:'/lib/manage/submitStoCom',
            method:'post',
            data:stoContent
        })
    },
    submitFeedContent(feedForm){
        return request({
            url:'/lib/user/submitFeedContent',
            method:'post',
            data:feedForm
        })
    },
    checkBackTips(userId,Num){
        return request({
            url:`/lib/manage/checkBackTips/${userId}/${Num}`,
            method:'get'
        })
    },
    getBookList(){
        return request({
            url:'/lib/manage/getBookList',
            method:'get'
        })
    },
    getBookInfoList(nameStr,cn){
        return request({
            url:`/lib/manage/getBookInfoList/${nameStr}/${cn}`,
            method:'get'
        })
    }
}