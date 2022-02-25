import request from '../utils/request'

export default{
    getChatContent(userName){
        return request({
            url:`/lib/chat/getChatContent/${userName}`,
            method:'get',
        })
    },
    getOldChatContent(userName){
        return request({
            url:`/lib/chat/getOldChatContent/${userName}`,
            method:'get',
        })
    },
    changeMessageStatus(changeInfo){
        return request({
            url:'/lib/chat/changeMessageStatus',
            method:'post',
            data:changeInfo
        })
    }
}