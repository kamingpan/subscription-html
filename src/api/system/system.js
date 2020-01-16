import request from '@/utils/request'
import setting from '@/setting'

/**
 * 获取js授权列表
 */
export function getJsConfig() {
  return request({
    url: setting.serverRoot + '/system/js-config',
    method: 'get'
  })
}
