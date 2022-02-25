import request from '../utils/request'

export default{
    getDischargeStatistic(searchObj){
        return request({
            url:'/lib/sta/getDischargeStatistic',
            method:'post',
            data:searchObj
        })
    },
    getUserBookCatLike(userId){
        return request({
            url:`/lib/sta/getUserBookCatLike/${userId}`,
            method:'get',
        })
    },
    getNewUserBroNum(){
        return request({
            url:'/lib/sta/getNewUserBroNum',
            method:'get',
        })
    }
    
}