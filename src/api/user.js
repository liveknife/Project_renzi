import request from '@/utils/request'
// 登录接口封装
export function login(data) {
  // 返回一个promise对象
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}
// 获取用户资料的接口
export function getUserInfo(token) {
  return request({
    url: '/sys/profile',
    method: 'post',
    token
    // 可以在单个接口中添加headers属性,携带token,但是有一个弊端,就是每个接口都得加headers,比较麻烦,所以放在请求拦截器中统一配置
    // headers: {
    //   Authorization: token
    // }
  })
}
/*
  **根据用户id获取用户详情
*/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}` // 默认是get请求这个method可以省略
  })
}

