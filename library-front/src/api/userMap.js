import request from '../utils/request'
export default{
    getNowIp(){
        return request({
            url:'/manager/map/getUserIp',
            method:'get',
        })
    },
    getUserAreaList(userAreaInfo){
        return request({
            url:'/manager/map/getUserAreaList',
            method:'post',
            data:userAreaInfo
        })
    }
}