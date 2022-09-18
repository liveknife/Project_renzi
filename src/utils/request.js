// 引入axios
import axios from 'axios'
// 引入element-ui的消息提示组件
import { Message } from 'element-ui'
// 引入store
import store from '@/store'
// 创建axios实例
const service = axios.create({
  // 当执行 yarn dev => .env.development => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API, // 当执行 npm run dev命令的时候,会读取开发环境文件.env.development里面的变量,变量的值为 /api ,当发起请求的时候就会触发代理机制,在vue.config.js里面
  timeout: 5000 // 设置接口请求超时时间最长为5秒
})
// day04: 配置请求拦截器
service.interceptors.request.use(config => {
// config 是请求的配置信息
// 如果有token,那就给config对象下的headers添加一个Authorization属性,值为token.注意: 得按后台接口文档的规则进行拼接
  if (store.getters.token) {
    // 给config对象的headers对象里添加一个Authorization属性
    // config.headers.Authorization或者config.headers['Authorization']这两种都可以实现添加
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  // console.log(config, '1111')
  return config // config是请求的配置信息,必须得return出去
}, error => {
  return Promise.reject(error)
})
// 配置请求拦截器
service.interceptors.request.use()
// 配置响应拦截器
// 成功的回调是response=>{},错误的回调是error=>{}
service.interceptors.response.use(response => {
  // 当接口响应成功之后,会走到response这个回调函数中获取数据
// axios默认加了一层data
  const { success, data, message } = response.data
  //   要根据success的状态是否成功决定后面的操作
  // success为true的时候
  if (success) {
    return data
  } else { // success为false的时候
    Message.error(message) // 返回错误提示信息
    return Promise.reject(new Error(message))
  }
}, error => {
  // 当接口响应失败了,会走到error这个回调函数里面
  Message.error(error.message) // 错误提示信息
  return Promise.reject(error) // 返回执行错误,让当前的执行跳出,直接进入 catch ,通过catch进行捕获
})
// 导出service实例
export default service
