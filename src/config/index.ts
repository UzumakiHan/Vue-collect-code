const WXAPP_URL = 'https://wxapp.mama.cn';

export default {
    BASE_URL: 'http://127.0.0.1:3000', // 接口域名
    WXAPP_URL,
    API: {},
    WXAPP_API: {
        loginV3: `${WXAPP_URL}/Home/Member/LoginV3`,
        bindUcAccountV2: `${WXAPP_URL}/Home/Member/bindUcAccountV2`, // 绑定账号
        bindPhone: `${WXAPP_URL}/Home/Member/bindPhone`, // 绑定手机号
        getMobileVerifyCode: `${WXAPP_URL}/Home/Member/getMobileVerifyCode`, // 获取手机验证码
        getNewUserPhoneNumber:`${WXAPP_URL}/Home/Member/getNewUserPhoneNumber`,//解绑手机授权信息
        getRelateInfo:`${WXAPP_URL}/Home/Member/getRelateInfo`, //获取绑定用户信息
    },
    BASE_API: {
      getCollectList: '/getCollectList',
      uploadCode:'/uploadCode',
      delCode:'/delCode',
      editCode:'/editCode',
      saveUser:'/saveUser'
    },
    
};
