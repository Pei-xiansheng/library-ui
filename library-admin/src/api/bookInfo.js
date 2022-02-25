import request from '../utils/request'

export default{
    saveBannerList(bannerForm){
        return request({
            url:'/lib/manage/saveBannerList',
            method:'post',
            data:bannerForm
        })
    },
    sendPost(postForm){
        return request({
            url:'/lib/manage/sendPost',
            method:'post',
            data:postForm
        })
    },
    getPostList(){
        return request({
            url:'/lib/manage/getPostList',
            method:'get'
        })
    },
    getCategory(){
        return request({
            url:'/lib/order/getCategory',
            method:'get'
        })
    },
    getBookList(queryBookForm){
        return request({
            url:'/lib/deal/getBookList',
            method:'post',
            data:queryBookForm
        })
    },
    getBroStarInfoList(queryStarForm){
        return request({
            url:'/lib/deal/getBroStarInfoList',
            method:'post',
            data:queryStarForm
        })
    },
    checkStarInfo(starId){
        return request({
            url:`/lib/deal/checkStarInfo/${starId}`,
            method:'get'
        })
    },
    seeBroUserInfo(userName){
        return request({
            url:`/lib/deal/seeBroUserInfo/${userName}`,
            method:'get'
        })
    },
    checkAllBroStar(){
        return request({
            url:'/lib/deal/checkAllBroStar',
            method:'get'
        })
    },
    remindUser(remindForm){
        return request({
            url:'/lib/deal/remindUser',
            method:'post',
            data:remindForm
        })
    },
    getBookByExcel(queryExcelForm){
        return request({
            url:'/lib/deal/getBookByExcel',
            method:'post',
            data:queryExcelForm
        })
    },
    getCatTree(uId){
        return request({
            url:`/lib/deal/getCatTree/${uId}`,
            method:'get'
        })
    },
    getBrownUserBookList(getBrownUserBookList){
        return request({
            url:'/lib/deal/getBrownUserBookList',
            method:'post',
            data:getBrownUserBookList
        })
    },
    backBookToStore(bId,uName){
        return request({
            url:`/lib/deal/backBookToStore/${bId}/${uName}`,
            method:'get'
        })
    },
    editBookInfo(bookEditForm){
        return request({
            url:'/lib/deal/editBookInfo',
            method:'post',
            data:bookEditForm
        })
    },
    delBookInfo(bookId){
        return request({
            url:`/lib/deal/delBookInfo/${bookId}`,
            method:'get',
        })
    },
    saveBookStore(storeInfoForm){
        return request({
            url:'/lib/deal/saveBookStore',
            method:'post',
            data:storeInfoForm
        })
    },
    getDayPoem(){
        return request({
            url:'/lib/deal/getDayPoem',
            method:'get',
        })
    }
}