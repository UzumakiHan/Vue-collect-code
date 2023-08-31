import dayjs from 'dayjs';
import Taro from '@tarojs/taro';

export const handleFormatTime = (time, formatType = 'YYYY-MM-DD') => {
    return dayjs(time).format(formatType)
}
export const toast=(type,message)=>{
    return  Taro.showToast({
        title: message,
        icon: type,
        duration: 2000
      })

}