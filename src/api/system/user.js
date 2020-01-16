import request from '@/utils/request'
import setting from '@/setting'

/**
 * 获取当前登录用户信息
 */
export function getUserInfo() {
  return request({
    url: setting.serverRoot + '/user/message',
    method: 'get'
  })
}
