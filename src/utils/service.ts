
import Service from '@/utils/request';
import config from '@/config/index';
//获取code列表
function getCollectList(account): Promise<any> {
    return Service.request(config.BASE_API.getCollectList, 'GET',{account})
}
//删除
function delCode(fileId,filePath): Promise<any> {
    return Service.request(config.BASE_API.delCode, 'GET',{
        file_id:fileId,
        filePath
    })
}
//编辑
function editCode(id,collectName): Promise<any> {
    return Service.request(config.BASE_API.editCode, 'GET',{
        _id:id,
        collectName
    })
}
//编辑
function saveUser(code,userInfo): Promise<any> {
    return Service.request(config.BASE_API.saveUser, 'GET',{
       code,
       userInfo
    })
}
export default{
    getCollectList,
    delCode,
    editCode,
    saveUser
}