import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user' // 引入登录接口

// 状态
const state = {
  // token: null, // 用户模块的state中定义存储token的变量
  // 一初始化vuex的时候先从缓存中读取token

  token: getToken(), // 页面一打开先从cookie里获取token
  userInfo: {} // 这里定义一个存储用户信息的变量是一个空对象不要写成null 为什么定义空对象而不是null呢?
  // 因为在getters创建userInfo的快捷访问的时候,如果它的值为null的时候会引起异常或报错

}
// 修改状态
const mutations = {
  // 定义修改state中token的方法
  setToken(state, token) {
    state.token = token // 修改state中的token
    // 同步给缓存
    setToken(token) // 调用存储token的方法,顺便在cookie中存一份,为了防止用户刷新页面token丢失
  },
  removeToken(state) {
    state.token = null // 把state中的token数据清除为空
    removeToken() // 调用cookie的清除token的方法,当用户点击退出或者注销按钮的时候执行此方法,删除缓存中token的数据
  },
  // 定义修改用户资料的方法,result是后台返回的数据
  setUserInfo(state, result) {
    // 更新对象
    state.userInfo = result // 响应式修改数据方式1
    // 响应式修改数据方式2,相当于浅拷贝 state.userInfo = { ...result }
    // 响应式修改数据方式3, Vue.set('目标对象',key,value)
    // 响应式修改数据方式4, Object.assign({新对象},state.userInfo)
    // 不是响应式的修改方法
    // state.userInfo['username'] = result  这样不是响应式
    // state.userInfo.username = result  这样不是响应式
  },
  // 定义清除用户信息的方法, 用户退出登录的时候,清空所有信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 异步修改状态
const actions = {
// 第一种方式: 推荐使用async和await的用法
  async login(context, data) {
    // 调用api的接口
    const result = await login(data) // 拿到token
    context.commit('setToken', result) // 设置token
    // 响应拦截器里面做了处理,所以这里就不需要判断直接调用即可
    // axios 默认加了一层data
    // if (result.data.success) {
    //   // 如果为true,表示登录成功
    //   context.commit('setToken', result)
    // }
  },
  // 第二种方法: promise.then()的方式进行接口调用
  // 为什么async/await 不用返回new Promise,因为 async函数本身就是 Promise,promise的值返回的值
  // login(context, data) {
  //   return new Promise(function(resolve) {
  //     login(data).then(result => {
  //       if (result.data.success) {
  //         context.commit('setToken',  result.data.data) // 提交mutations设置token
  //         resolve()  // 表示执行成功了
  //       }
  //     })
  //   })
  // }
  // actions里面定义获取用户资料的方法,调用接口
  async getUserInfo(context) {
    // result 拿到的直接是个data对象,而不是整个接口对象,因为在响应拦截器里进行了解构
    const result = await getUserInfo() // 调用接口,获取用户资料
    // 将后台返回的数据更新到mutations对象里定义的setUserInfo方法里面进行修改,修改state数据必须经过mutations
    // console.log(result, '11111')
    context.commit('setUserInfo', result) // 提交到mutations
    return result // 这个return是干嘛的？给后期做权限的时候留下的伏笔
  }
// 第二种方法: promise.then()的方式进行接口调用
  // 为什么async/await 不用返回new Promise,因为 async函数本身就是 Promise,promise的值返回的值
// login(context, data) {
//   return new Promise(function(resolve) {
//     login(data).then(result => {
//       if (result.data.success) {
//         context.commit('setToken',  result.data.data) // 提交mutations设置token
//         resolve()  // 表示执行成功了
//       }
//     })
//   })
// }
}
export default {
  namespaced: true, // 开启命名空间
  state,
  mutations,
  actions
}
