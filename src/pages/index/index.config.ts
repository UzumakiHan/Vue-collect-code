export default definePageConfig({
  navigationBarTitleText: '首页',
  navigationStyle:'custom',
  navigationBarTextStyle: 'black',
  enableShareAppMessage: true,
    enableShareTimeline: true,
  usingComponents:{
    "van-button": "@vant/dist/button/index",
    "van-dialog": "@vant/dist/dialog/index",
    "van-field": "@vant/dist/field/index",
    "van-empty": "@vant/dist/empty/index",
    'van-config-provider': "@vant/dist/config-provider/index",
    'van-toast': '@vant/dist/toast/index',
    "van-image": "@vant/dist/image/index"
  }
})
