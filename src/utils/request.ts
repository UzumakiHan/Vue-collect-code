import Taro from '@tarojs/taro';
import config from '../config/index';

interface Method {
    /** HTTP 请求 OPTIONS */
    OPTIONS
    /** HTTP 请求 GET */
    GET
    /** HTTP 请求 HEAD */
    HEAD
    /** HTTP 请求 POST */
    POST
    /** HTTP 请求 PUT */
    PUT
    /** HTTP 请求 DELETE */
    DELETE
    /** HTTP 请求 TRACE */
    TRACE
    /** HTTP 请求 CONNECT */
    CONNECT
  }
  /**
 * 发起请求
 * @param {String} url 接口地址
 * @param {Object} data 请求内容
 * @return {String} sign
 */
async function request(url: string, method?: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const params = {
            url: `${config.BASE_URL}${url}`,
            method: (method || 'get') as keyof Method,
            dataType: 'json',
            data: data || {}
        };
        Taro.request({
            ...params,
            success: function (res) {
                resolve(res.data);
            },
            fail: function (err) {
                reject(err);
            }
        });
    });
}


export default {
    request
};
