import Cookies from 'js-cookie'

const tokenKey = 'user:token'

const loginRetryKey = 'user:login:retry'

export function getToken() {
  return Cookies.get(tokenKey)
}

export function setToken(token) {
  return Cookies.set(tokenKey, token)
}

export function removeToken() {
  return Cookies.remove(tokenKey)
}

export function getLoginRetry() {
  return Cookies.get(loginRetryKey)
}

export function setLoginRetry(loginRetry) {
  // 设置有效期为8秒，8秒后可以重试登录
  const millisecond = new Date().getTime()
  const expiresTime = new Date(millisecond + 8000)

  // 返回结果
  return Cookies.set(loginRetryKey, loginRetry, {
    expires: expiresTime
  })
}

export function removeLoginRetry() {
  return Cookies.remove(loginRetryKey)
}
