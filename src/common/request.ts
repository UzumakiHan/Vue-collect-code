// request.ts

import Taro from '@tarojs/taro';
import service from './service'
import constant from './constant';
import type { IAccess } from '@/types/index'
async function request(url: string, method: 'GET' | 'POST' | 'PUT'|'DELETE', data: any, isQuery = false): Promise<any> {
    const storeAccess = Taro.getStorageSync(constant.STORE_ACCESS_KEY) as IAccess

    const accessRes = storeAccess ? storeAccess : await service.handleGetCommonAjax(constant.APP_ACCESS_TOKEN) as IAccess
    const { access_token, dtable_server, dtable_db } = accessRes
    const BASE_HOST_URL = isQuery ? dtable_db : dtable_server
    const apiUrl = `${BASE_HOST_URL}${url}`
    return new Promise((resolve, reject) => {
        Taro.request({
            url: apiUrl,
            method: method,
            data: data,
            header: {
                Authorization: `Token ${access_token}`
            },
            success: (res) => {
                // 这一步是对服务器端返回的数据进行处理，可以根据你的业务需求进行修改
                resolve(res.data)

            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}
export default {
    request
}
