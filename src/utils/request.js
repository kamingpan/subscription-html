import qs from 'qs'
import axios from 'axios'
import {
  MessageBox
} from 'mint-ui'

import {
  getToken, setToken, getLoginRetry, setLoginRetry
} from '@/utils/token'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000, // request timeout
  withCredentials: true, // 跨域请求时发送 cookies
  crossDomain: true
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 每个请求都增加一个时间戳做请求参数，保证不因浏览器缓存导致页面无法渲染完整
    if (!config.params) {
      config.params = {}
    }
    const _time = new Date().getTime()
    config.params._t = _time

    // 设置请求头
    if (!config.headers['Content-Type'] || config.headers['Content-Type'].indexOf('multipart/form-data') === -1) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

      // 将入参格式化为from表单提交
      config.data = qs.stringify(config.data ? config.data : {})
    }

    // 处理url查询条件，将_t作为时间戳加到查询条件中，用于重定向时避免微信浏览器的页面缓存导致页面不刷新无法请求到数据
    const pattern = '_t=([^&]*)'
    const replaceText = '_t=' + _time
    let _search = window.location.search
    /* eslint-disable */
    _search = _search.match(pattern) ? _search.replace(eval('/(_t=)([^&]*)/gi'), replaceText) : (_search.match('[?]') ? _search + '&' + replaceText : _search + '?' + replaceText)
    // 将当前地址加路由器添加到请求头中，用于未登录时重定向使用
    config.headers['Referrer-Url'] = (window.location.origin + window.location.pathname + _search + window.location.hash)

    // Do something before request is sent
    if (getToken()) {
      // 让每个请求携带token-- ['token']为自定义key 请根据实际情况自行修改
      config.headers['token'] = getToken()
    }

    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug

    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  // response => response.data,
  response => {
    // 如果响应的是文件流，则直接把整个结果返回
    if (response.headers['content-type'].indexOf('application/octet-stream') !== -1) {
      return response.data
    }

    return response.data.data
  },

  error => {
    // 响应头状态码
    const status = error.response.status
    // 响应体
    const data = error.response.data
    const message = data.status ? data.message : error.response.statusText

    if (status === 400) {
      MessageBox.alert(message, status + '异常', {
        type: 'error'
      }).then(function () {
      }).catch(function () {
      })
    } else if (status === 401) {
      // 登录超时
      if (data.status === '01001') {
        // 获取是否可以重试登录cookie，如果不能，则直接结束，避免过多重定向导致一直循环登录
        const loginRetry = getLoginRetry()
        if (!loginRetry) {
          // 将登录超时设置到cookies中
          setLoginRetry(true)
          // 将token设置到cookies中
          setToken(data.data.token)
          // 重新跳转地址
          window.location.href = data.data.redirect_url
        }
      } else if (data.status === '02001') {
        MessageBox.alert('无该操作权限，请联系管理员', '权限异常', {
          type: 'error'
        }).then(function () {
          // 点击了确定按钮，暂时不触发任何操作
        }).catch(function () {
          // 点击了关闭窗口，暂时不触发任何操作
        })
      } else {
        // 剩余情况弹窗提示
        MessageBox.alert(message, status + '异常', {
          type: 'error'
        }).then(function () {
          // 点击了确定按钮，暂时不触发任何操作
        }).catch(function () {
          // 点击了关闭窗口，暂时不触发任何操作
        })
      }
    } else if (status === 404) {
      MessageBox.alert('请求不存在，请联系管理员', status + '请求异常', {
        type: 'error'
      }).then(function () {
        // 点击了确定按钮，暂时不触发任何操作
      }).catch(function () {
        // 点击了关闭窗口，暂时不触发任何操作
      })
    } else if (status === 408) {
      // 请求超时
      MessageBox.alert('请求超时，请重新发起请求', status + '请求异常', {
        type: 'error'
      }).then(function () {
        // 点击了确定按钮，暂时不触发任何操作
      }).catch(function () {
        // 点击了关闭窗口，暂时不触发任何操作
      })
    } else if (status === 500) {
      // 弹出异常详情页面
      MessageBox.alert('服务器异常', '服务器异常', {
        type: 'error'
      }).then(function () {
        // 点击了确定按钮，暂时不触发任何操作
      }).catch(function () {
        // 点击了关闭窗口触发
      })
    } else {
      // 剩余情况弹窗提示
      MessageBox.alert(message, status + '异常', {
        type: 'error'
      }).then(function () {
        // 点击了确定按钮，暂时不触发任何操作
      }).catch(function () {
        // 点击了关闭窗口，暂时不触发任何操作
      })
    }

    return Promise.reject(error)
  }
)

export default service
