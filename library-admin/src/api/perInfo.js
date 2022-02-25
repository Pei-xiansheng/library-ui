import request from '../utils/request'
export default{
    getMenuList(id){
        return request({
            url:`/lib/per/getMenu/${id}`,
            method:'get',
        })
    },
    getTreeList(){
        return request({
            url:'/lib/per/getTreeList',
            method:'get',
        })
    },
    getUserManagePageList(currentPage,queryInfo){
        return request({
            url:`/lib/per/getUserManagePageList/${currentPage}`,
            method:'post',
            data:queryInfo
        })
    },
    getRoleList(){
        return request({
            url:'/lib/per/getRoleList',
            method:'get',
        })
    },
    changeUserRole(roleInfo){
        return request({
            url:'/lib/per/changeUserRole',
            method:'post',
            data:roleInfo
        })
    },
    addNewRole(newRoleInfo){
        return request({
            url:'/lib/per/addNewRole',
            method:'post',
            data:newRoleInfo
        })
    },
    relieveUserRole(userId){
        return request({
            url:`/lib/per/relieveUserRole/${userId}`,
            method:'get',
        })
    },
    getManageList(){
        return request({
            url:'/lib/per/getManageList',
            method:'get',
        })
    }
}