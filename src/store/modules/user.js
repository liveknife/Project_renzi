import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user' // 引入登录接口

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
    // 代码执行到这里证明已经获取到token,登录成功的同时在缓存中存储一个当前的时间戳,记录下来
    setTimeStamp() // 存入时间戳
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
    /*
      DAY04：
      注意: 获取用户头像的接口需要放在获取用户资料的接口后面,因为要传userId后面
    */
    const baseInfo = await getUserDetailById(result.userId)
    // 通过展开运算符将获取用户资料返回的数据和获取用户头像返回的数据做一个合并,合并到一个对象里
    // const obj = { ...result, ...baseInfo } // 这样也可以
    // context.commit('setUserInfo', result)
    // 合并完的数据一次更新到state的userInfo里面
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 提交到mutations
    return result // 这个return是干嘛的？给后期做权限的时候留下的伏笔
  },
  // 退出登录功能
  logout(context) {
    // 点击退出登录,清空vuex的token和cookie缓存的token,并且删除用户的所有信息。通过调用mutations里面封装的删除功能来实现登出
    // 删除token
    context.commit('removeToken')
    // 删除用户信息
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true, // 开启命名空间
  state,
  mutations,
  actions
}
