<template>
  <view class="index" v-if="placeHolderHeight > 0">
    <!-- :style="{'padding-top':barTop+'px'}" -->
    <view class="index-nav" :style="{ 'height': placeHolderHeight + 'px', 'padding-top': barTop + 'px' }">
      二维码相册
    </view>
    <view class="index-wrap" :style="{ 'top': placeHolderHeight + 10 + 'px' }">
      <view class="index-tip" v-if="collectList.length > 0">点击二维码查看大图，长按大图，即可识别</view>
      <view class="index-tip" v-else>扫码备忘录，备份日常使用的各种二维码，方便快速找回</view>

      <view class="index-list" v-if="collectList.length > 0">
        <view class="index-list-item" v-for="(collect,index) in collectList" :key="collect._id"
          @tap="handlePreview(collect.codeurl)">
          <view class="index-list-item-info">
            <van-image width="62" height="62" fit="cover" :src="collect.codeurl" />
            <!-- <image class="index-list-item-info-img" :src="collect.codeurl" /> -->
            <!-- <view class="collect-img" :style="{backgroundImage:`url(${collect.codeurl})`}"></view> -->
            <view class="index-list-item-info-desc">{{ collect.collectname }}</view>
          </view>
          <view class="index-list-item-control" @tap.stop="handleEdit(collect,index)">
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
          <view class="index-dialog-wrap-btn-right" @tap="dialogShow = false">取消</view>
        </view>
        <view class="index-dialog-wrap-line"></view>
        <view class="index-dialog-wrap-delete" @tap="dialogShow = false; deleteShow = true">删除二维码</view>

      </view>
    </view>
    <!-- 删除二维码弹层 -->
    <view class="index-dialog" v-if="deleteShow">
      <view class="index-dialog-delete">
        <view class="index-dialog-delete-title">确定要删除二维码吗？</view>
        <van-image :src="editQrcodeUrl" fit="cover" width="136" height="136" radius="8"></van-image>
        <view class="index-dialog-delete-btn">
          <view class="index-dialog-delete-btn-left" @tap="handleDel">确认</view>
          <view class="index-dialog-delete-btn-right" @tap="deleteShow = false">取消</view>
        </view>
      </view>
    </view>
    <van-toast id="van-toast" />
  </view>
</template>
<script lang="ts">
const shareDefaultImg = require('../../assets/index/empty-second.png')
export default {
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
<script lang="ts" setup>
import { useDidShow } from '@tarojs/taro'
import { ref, onMounted, reactive } from 'vue'
import type { IAccess, ICodePic, IUploadRes, INodeAjax } from '@/types/index'

import './index.scss'
import Taro from '@tarojs/taro'
import service from "@/common/service";
import constant from "@/common/constant";

import Toast from '@vant/dist/toast/toast';
const collectList = ref<Array<ICodePic>>([])
const currentIndex= ref(0)
const filePath = ref('')
const dialogShow = ref(false);
const deleteShow = ref(false)
const codeVal = ref('')
const editQrcodeUrl = ref('')
const barTop = ref(0)
const placeHolderHeight = ref(0)
const currentRowId = ref('')
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
  const userHash = Taro.getStorageSync(constant.STORE_USER_HASH) || ''
  if (!userHash) {
    await handleIsLogin()
  }
  Taro.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: async function (res) {
      const uploadRes = await service.handleUploadFile(res.tempFilePaths[0]) as IUploadRes
      if (uploadRes.addRes) {
        const collectInfo = uploadRes.collectInfo
        collectInfo[0].codeurl = res.tempFilePaths[0]
        Toast('添加成功')
        setTimeout(() => {
          collectList.value = collectList.value.concat(collectInfo)
          console.log(collectList.value)
        }, 200)

      } else {
        Toast('失败')

      }
    },
    fail() {

      Toast('fail')
      // getCollectList()

    }
  })

}
const getCollectList = async () => {
  const account = Taro.getStorageSync(constant.STORE_USER_HASH) || ''
  collectList.value = await service.getCollectList(account)

}
const handleDel = async () => {
  Taro.showLoading({
    title: '删除中',
    mask: true
  })
  const deletePathRes = await service.handleDeleteFile(filePath.value) as INodeAjax
  if (deletePathRes.code === constant.SUCCESS_CODE) {
    const delRes = await service.handleDelRowData(constant.CODE_PIC_TABLE_NAME, currentRowId.value);
    if (delRes) {
      Taro.hideLoading({
        success() {
          Toast('删除成功');
         
          collectList.value.splice(currentIndex.value,1)
        }
      })
    } else {
      Toast('删除失败');
   

    }
  } else {
    Toast('删除失败');
   
  }
  deleteShow.value = false

}
const handleEdit = async (codeInfo: ICodePic,index:number) => {
  currentIndex.value = index
  dialogShow.value = true
  codeVal.value = codeInfo.collectname
  currentRowId.value = codeInfo._id
  editQrcodeUrl.value = codeInfo.codeurl;
  filePath.value = codeInfo.filePath
}
const handleConfirm = async () => {
  if (codeVal.value === '') {
    Toast('不能为空')
    return
  }
  const collectName = codeVal.value.trim()
  Taro.showLoading({
    title: '修改中',
    mask: true
  })
  const updateInfo = {
    row: {
      collectname: collectName,
    },
    table_name: `${constant.CODE_PIC_TABLE_NAME}`,
    row_id: currentRowId.value
  }
  try {
    const updateRes = await service.handleUpdateRowData(updateInfo);
    if (updateRes && updateRes.success === true) {
      collectList.value[currentIndex.value].collectname = collectName
      Taro.hideLoading({
        success() {
          Toast('修改成功')
          dialogShow.value = false
        }
      })
    } else {
      Toast('修改失败');
    }

  } catch (error) {
    Toast('网络出错了')
  }


}
const codeChange = (value) => {
  codeVal.value = value.detail
}
const handleAddUser = async (openId, userInfo) => {
  const { nickName, city, country, province, gender, avatarUrl } = userInfo
  const rowData = {
    rows: [
      {
        openid: openId,
        username: nickName,
        city,
        country,
        province,
        gender: gender === 0 ? '男' : '女',
        avatarUrl
      }
    ],
    table_name: `${constant.USER_TABLE_NAME}`

  }
  await service.handleAddRowData(rowData)

}
const handleIsLogin = () => {
  return new Promise((resolve, reject) => {
    Taro.getUserProfile({
      desc: '帮助您成为我们的注册用户',
      success: res => {

        const userInfo = res.userInfo
        Taro.getUserInfo({
          //成功后会返回
          success: () => {
            //获取openId（需要code来换取）这是用户的唯一标识符
            // 获取code值
            Taro.login({
              //成功放回
              success: async (res) => {
                const code = res.code
                const editRes = await service.hanldeGetOpenid(code);
                if (editRes.code === constant.SUCCESS_CODE) {
                  const openId = editRes.data.openId
                  Taro.setStorageSync(constant.STORE_USER_HASH, editRes.data.openId)
                  Taro.getStorage({
                    key: constant.STORE_USER_HASH,
                    success: async function () {
                      const userSql = `select * from ${constant.USER_TABLE_NAME} where openid = '${openId}' `
                      const findUserRes = await service.handleQueryData(userSql)
                      if (findUserRes.results.length === 0) {
                        //新用户插入
                        handleAddUser(openId, userInfo)

                      }

                    }
                  })

                  resolve(openId)
                }
              }
            })
          }
        })
      },
      fail: () => {
        reject('获取用户信息失败');
      }
    })
  })
}
const handleNavHeight = () => {
  barTop.value = Taro.getSystemInfoSync().statusBarHeight as number
  // 获取胶囊按钮位置信息
  const menuButtonInfo = Taro.getMenuButtonBoundingClientRect()
  // 获取导航栏高度
  const barHeight = menuButtonInfo.height + (menuButtonInfo.top - barTop.value) * 2
  placeHolderHeight.value = barHeight + barTop.value

}

useDidShow(async () => {
  handleNavHeight()
  const result = await service.handleGetCommonAjax(constant.APP_ACCESS_TOKEN) as IAccess
  if (result) {
    Taro.setStorageSync(constant.STORE_ACCESS_KEY, result)
  }
})
onMounted(() => {

  const userHash = Taro.getStorageSync(constant.STORE_USER_HASH) || ''

  if (!userHash) {
    return
  }
  getCollectList()



})
</script>
