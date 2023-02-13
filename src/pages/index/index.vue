<template>
  <view class="index">
    <!-- :style="{'padding-top':barTop+'px'}" -->
    <view class="index-nav" :style="{ 'height': placeHolderHeight + 'px', 'padding-top': barTop + 'px' }">
      二维码相册
    </view>
    <view class="index-wrap" :style="{ 'top': placeHolderHeight + 10 + 'px' }">
      <view class="index-tip" v-if="collectList.length > 0">点击二维码查看大图，长按大图，即可识别</view>
      <view class="index-tip" v-else>扫码备忘录，备份日常使用的各种二维码，方便快速找回</view>

      <view class="index-list" v-if="collectList.length > 0">
        <view class="index-list-item" v-for="collect in collectList" :key="collect._id"
          @tap="handlePreview(collect.fileUrl)">
          <view class="index-list-item-info">
            <van-image width="62" height="62" fit="cover" :src="collect.fileUrl" />
            <!-- <image class="index-list-item-info-img" :src="collect.fileUrl" /> -->
            <view class="index-list-item-info-desc">{{ collect.collectName }}</view>
          </view>
          <view class="index-list-item-control" @tap.stop="handleEdit(collect)">
            <image src="../../assets/index/edit.png" />
            <text>编辑</text>
          </view>
        </view>
      </view>
      <view class="index-empty" v-else>
      </view>
    </view>
    <view class="index-panel">
      <view class="index-panel-desc" v-if="collectList.length === 0"></view>
      <image src="../../assets/index/add.png" @tap="handleUploadImg" />
    </view>
    <!-- <view class="index-panel beian">粤ICP备2022111955号</view> -->
    <!-- 修改modal -->
    <view class="index-dialog" v-if="dialogShow">
      <view class="index-dialog-wrap">
        <view class="index-dialog-wrap-title">编辑二维码</view>
        <view class="index-dialog-wrap-content">
          <view class="index-dialog-wrap-content-head">请输入二维码名称：</view>

          <view class="index-dialog-wrap-content-input">
            <van-config-provider :theme-vars="fieldThemeVars">
              <van-field :value="codeVal" placeholder="请输入二维码名称" @change="codeChange" />
            </van-config-provider>
          </view>

        </view>
        <view class="index-dialog-wrap-btn">
          <view class="index-dialog-wrap-btn-left" @tap="handleConfirm"> 提交</view>
          <view class="index-dialog-wrap-btn-right" @tap="dialogShow=false">取消</view>
        </view>
        <view class="index-dialog-wrap-line"></view>
        <view class="index-dialog-wrap-delete" @tap="dialogShow = false; deleteShow = true">删除二维码</view>

      </view>
    </view>
    <!-- 删除二维码弹层 -->
    <view class="index-dialog" v-if="deleteShow">
      <view class="index-dialog-delete">
        <view class="index-dialog-delete-title">确定要删除二维码吗？</view>
        <image :src="editQrcodeUrl" class="index-dialog-delete-qrcode" />
        <view class="index-dialog-delete-btn">
          <view class="index-dialog-delete-btn-left" @tap="handleDel">确认</view>
          <view class="index-dialog-delete-btn-right" @tap="deleteShow = false">取消</view>
        </view>
      </view>
    </view>
    <van-toast id="van-toast" />
  </view>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import './index.scss'
import Taro from '@tarojs/taro'
import service from "@/utils/service";
import config from "@/config";
import constant from "@/constant";

import Toast from '@vant/dist/toast/toast';
const shareDefaultImg = require('../../assets/index/empty-second.png')
export default {
  setup() {
    const collectList = ref([])
    const editId = ref('')
    const dialogShow = ref(false);
    const deleteShow = ref(false)
    const codeVal = ref('')
    const editQrcodeUrl = ref('')
    const editFilePath = ref('')
    const barTop = ref(0)
    const placeHolderHeight = ref(0)
    const popShow = ref(false);
    const fieldThemeVars = reactive({
      'cell-background-color': 'transparent',
      'cell-vertical-padding': '7px'

    });
    const handlePreview = (url) => {
      Taro.previewImage({
        urls: [url], // 当前显示图片的http链接
      })
    }
    const handleUploadImg = async () => {
      const userHash = Taro.getStorageSync('userHash') || ''
      if (!userHash) {
        await handleIsLogin()
      }
      Taro.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          Taro.showLoading({
            title: '添加中....',
            mask: true
          })
          const account = Taro.getStorageSync('userHash') || ''
          Taro.uploadFile({
            url: `${config.BASE_URL}${config.BASE_API.uploadCode}`,
            filePath: res.tempFilePaths[0],
            name: 'filecontent',
            formData: {
              'type': '照片',
              'account': account
            },
            success: function (res) {
              if (res.statusCode === constant.SUCCESS_CODE) {
                Taro.hideLoading({
                  success() {
                    Toast('添加成功')
                    getCollectList()
                  }
                })

              }
            },
            fail() {
              Toast('接口连接不通哦~~~')
            }
          })
        }
      })

    }
    const getCollectList = async () => {
      const account = Taro.getStorageSync('userHash') || ''
      const res = await service.getCollectList(account);
      if (res.success_code === constant.SUCCESS_CODE) {
        collectList.value = res.collectList
      }
    }
    const handleDel = async () => {
      Taro.showLoading({
        mask: true
      })
      const delRes = await service.delCode(editId.value, editFilePath.value);
      if (delRes.success_code === constant.SUCCESS_CODE) {
        Taro.hideLoading({
          success() {
            Toast(delRes.message);
            deleteShow.value = false
            getCollectList()
          }
        })
      } else {
        Toast('删除失败');
        deleteShow.value = false

      }
    }
    const handleEdit = async (file) => {
      editId.value = file._id;
      editQrcodeUrl.value = file.fileUrl
      editFilePath.value = file.filePath
      dialogShow.value = true
      codeVal.value = file.collectName
    }
    const handleConfirm = async () => {
      if (codeVal.value === '') {
        Toast('不能为空')
        return
      }
      const collectName = codeVal.value.trim()
      Taro.showLoading({
        mask: true
      })
      const editRes = await service.editCode(editId.value, collectName);
      if (editRes.success_code === constant.SUCCESS_CODE) {
        Taro.hideLoading({
          success() {
            Toast('修改成功')
          }
        })
      } else {
        Toast('修改失败');
      }
      dialogShow.value = false
      getCollectList()

    }
    const codeChange = (value) => {
      codeVal.value = value.detail
    }
    const handleIsLogin = () => {
      return new Promise((resolve, reject) => {
        Taro.getUserProfile({
          desc: '帮助您成为我们的注册用户',
          success: res => {

            const userInfo = res.userInfo
            Taro.getUserInfo({
              //成功后会返回
              success: (res) => {
                //获取openId（需要code来换取）这是用户的唯一标识符
                // 获取code值
                Taro.login({
                  //成功放回
                  success: async (res) => {
                    const code = res.code
                    const editRes = await service.saveUser(code, userInfo);
                    if (editRes.success_code === constant.SUCCESS_CODE) {

                      Taro.setStorageSync('userHash', editRes.data.openid)
                      Taro.getStorage({
                        key: 'userHash',
                        success: function (res) {
                          getCollectList()
                        }
                      })

                      resolve(editRes.data.openid)
                    }
                  }
                })
              }
            })
            // Taro.setStorageSync('userHash', res.signature)
            // resolve(res.signature)
          },
          fail: () => {
            reject('获取用户信息失败');
          }
        })
      })
    }
    const handleNavHeight = () => {
      barTop.value = Taro.getSystemInfoSync().statusBarHeight
      // 获取胶囊按钮位置信息
      const menuButtonInfo = Taro.getMenuButtonBoundingClientRect()
      // 获取导航栏高度
      const barHeight = menuButtonInfo.height + (menuButtonInfo.top - barTop.value) * 2
      placeHolderHeight.value = barHeight + barTop.value

    }
    onMounted(() => {

      handleNavHeight()
      const userHash = Taro.getStorageSync('userHash') || ''
      if (!userHash) {
        return
      }
      getCollectList()


    })

    return {
      collectList,
      dialogShow,
      codeVal,
      fieldThemeVars,
      deleteShow,
      editQrcodeUrl,
      barTop,
      placeHolderHeight,
      popShow,
      handleUploadImg,
      handlePreview,
      handleDel,
      handleEdit,
      handleConfirm,
      codeChange,
    }
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '二维码相册',
      path: 'pages/index/index',
      imageUrl: shareDefaultImg
    }
  }

}
</script>
