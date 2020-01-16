/**
 * 基本设置
 */

export default {
  serverRoot: document.location.protocol !== 'https:' ? process.env.VUE_APP_BASE_SERVER_URL
    : process.env.VUE_APP_BASE_SERVER_URL.replace('http://', 'https://')
}
