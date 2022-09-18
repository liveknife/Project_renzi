import Cookies from 'js-cookie'

// 要存储的token名称  即key值
const TokenKey = 'hrsass-ihrm-token' // 设置一个独一无二的key
// 获取token的方法
export function getToken() {
  return Cookies.get(TokenKey)
}
// 存储token的方法
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// 删除token的方法
export function removeToken() {
  return Cookies.remove(TokenKey)
}
