
import Service from './request';
import constant from './constant';
import Taro from '@tarojs/taro';
import { handleFormatTime, toast } from './util'

import type { IAccess, INodeAjax } from '@/types/index'

//获取 base access token
function handleGetCommonAjax(url: string, token = constant.TABLE_API_TOKEN) {
    return new Promise(async (resolve, reject) => {
        Taro.request({
            url,
            method: 'GET',
            header: {
                'Authorization': 'Token ' + token
            },
            success: function (res) {
                resolve(res.data);
            },
            fail: function (err) {
                reject(err);
            }
        });
    })
}
//上传文件或者图片
async function handleUploadFile(filePath: string) {
    return new Promise(async (resolve, reject) => {
        Taro.showLoading({
            title: '',
            mask: true
        })
        const openid = Taro.getStorageSync(constant.STORE_USER_HASH) || ''
        Taro.uploadFile({
            url: constant.UPLOAD_URL,
            filePath: filePath,
            name: 'filecontent',
            success: async function (res) {
                if (res.statusCode === constant.SUCCESS_CODE) {
                    const fileInfo = JSON.parse(res.data)
                    const createtime = handleFormatTime(new Date(), 'YYYY-MM-DD HH:mm')
                    const collectInfo = {
                        openid,
                        collectname: '默认二维码',
                        codeurl: fileInfo.data.fileData.fileUrl,
                        createtime,
                        filePath: fileInfo.data.fileData.filePath
                    }
                    const rowData = {
                        rows: [
                            collectInfo
                        ],
                        table_name: `${constant.CODE_PIC_TABLE_NAME}`
                    }
                    const addRes = await handleAddRowData(rowData)
                    Taro.hideLoading()
                    resolve({
                        collectInfo:[collectInfo],
                        addRes
                    })
                } else {
                    toast('error', '接口连接不通哦~~~')
                }
            },
            fail() {
                Taro.hideLoading({
                    success() {
                        toast('error', '接口连接不通哦~~~')

                    }
                })

            }
        })
    })

}

//查询query
async function handleQueryData(sql: string) {

    const storeAccess = Taro.getStorageSync(constant.STORE_ACCESS_KEY) as IAccess

    const accessRes = storeAccess ? storeAccess : await handleGetCommonAjax(constant.APP_ACCESS_TOKEN) as IAccess

    const { dtable_uuid } = accessRes

    return Service.request(`api/v1/query/${dtable_uuid}/`, 'POST', {
        sql,
        convert_keys: true
    }, true)
}
//获取code列表
async function getCollectList(openId: string) {
    const findSql = `select * from ${constant.CODE_PIC_TABLE_NAME} where openid = '${openId}' `
    const findRes = await handleQueryData(findSql)
    if (findRes.results.length > 0) {
        return findRes.results
    } else {
        return [];
    }
}

//更新表格数据
async function handleUpdateRowData(rowData: unknown) {
    const storeAccess = Taro.getStorageSync(constant.STORE_ACCESS_KEY) as IAccess

    const accessRes = storeAccess ? storeAccess : await handleGetCommonAjax(constant.APP_ACCESS_TOKEN) as IAccess
    const { dtable_uuid } = accessRes
    return Service.request(`api/v1/dtables/${dtable_uuid}/rows/`, 'PUT', rowData)
}

//编辑
function hanldeGetOpenid(code): Promise<INodeAjax> {
    return new Promise((resolve, reject) => {
        Taro.request({
            url: constant.OPENID_URL,
            method: 'POST',
            data: {
                code
            },
            success: function (res) {

                resolve(res.data);
            },
            fail: function (err) {
                reject(err);
            }
        });
    })
}
//插入数据
async function handleAddRowData(rowData: unknown) {
    const storeAccess = Taro.getStorageSync(constant.STORE_ACCESS_KEY) as IAccess

    const accessRes = storeAccess ? storeAccess : await handleGetCommonAjax(constant.APP_ACCESS_TOKEN) as IAccess
    const { dtable_uuid } = accessRes
    return Service.request(`api/v1/dtables/${dtable_uuid}/batch-append-rows/`, 'POST', rowData)

}
//删除服务器文件
function handleDeleteFile(filePath: string) {
    return new Promise((resolve, reject) => {
        Taro.request({
            url: constant.DELETE_PIC_URL,
            method: 'POST',
            data: {
                filePath,
            },
            success: function (res) {

                resolve(res.data);
            },
            fail: function (err) {
                reject(err);
            }
        });
    })
}
//删除数据
async function handleDelRowData(tableName: string, rowId: string) {
    const storeAccess = Taro.getStorageSync(constant.STORE_ACCESS_KEY) as IAccess

    const accessRes = storeAccess ? storeAccess : await handleGetCommonAjax(constant.APP_ACCESS_TOKEN) as IAccess
    const { dtable_uuid } = accessRes
    return Service.request(`api/v1/dtables/${dtable_uuid}/rows/`, 'DELETE', {
        table_name: tableName,
        row_id: rowId
    })

}

export default {
    handleGetCommonAjax,
    handleQueryData,
    handleUploadFile,
    handleUpdateRowData,
    handleDelRowData,
    getCollectList,
    hanldeGetOpenid,
    handleAddRowData,
    handleDeleteFile
}