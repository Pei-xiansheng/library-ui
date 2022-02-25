import request from '../utils/request'
export default{
    getCategoryBookList(queryForm){
        return request({
            url:'/lib/order/getCategoryBookList',
            method:'post',
            data:queryForm
        })
    },
    getCategory(){
        return request({
            url:'/lib/order/getCategory',
            method:'get'
        })
    },
    getBookDetail(bId){
        return request({
            url:`/lib/order/getBookDetail/${bId}`,
            method:'get'
        })
    },
    submitBrownInfo(starForm){
        return request({
            url:'/lib/order/submitBrownInfo',
            method:'post',
            data:starForm
        })
    },
    getBookComponentList(bookId,current){
        return request({
            url:`/lib/order/getBookComponentList/${bookId}/${current}`,
            method:'get'
        })
    },
    submitBookCom(bookContent){
        return request({
            url:'/lib/order/submitBookCom',
            method:'post',
            data:bookContent
        })
    },
    getStarInfoList(userId,currentNum){
        return request({
            url:`/lib/order/getStarInfoList/${userId}/${currentNum}`,
            method:'get'
        })
    },
    applyDelayTime(staApplyForm){
        return request({
            url:'/lib/order/applyDelayTime',
            method:'post',
            data:staApplyForm
        })
    }
}