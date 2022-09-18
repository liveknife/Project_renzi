// 权限拦截实现步骤
// 第一步：犹豫权限拦截需要判断要跳转的路由地址,所以需要用到路由守卫技术,那就需要进行引入路由router
// 第二步：因为要用到vuex中存储的token,需要在js文件中引入token
// 权限拦截在路由跳转  导航守卫
import router from '@/router'
import store from '@/store' // 引入store实例,和组件中this.$store是一样的
import nprogress from 'nprogress' // 引入进度条组件
import 'nprogress/nprogress.css' // 引入进度条样式
// 不需要导出  因为只需要让代码执行即可
// 使用前置守卫
// to：要跳转的目标地址,
// from：从哪里跳过来
// next参数是一个方法,必须调用,不然页面会卡死
// next 是前置守卫必须执行的钩子 next必须执行 如果不执行 页面就死了
// next() 放过通行
// next(false) 禁止通行
// next(地址) 要跳转的地址
const whitelList = ['/login', '/404'] // 白名单,没有token也可以跳转的页面,不受token限制
router.beforeEach(async(to, from, next) => {
  nprogress.start() // 开启进度条
  // store.state.user.token // 不使用快捷访问的化直接调用state.user模块下的token
  if (store.getters.token) {
    // 第三步：如果有token,并且当前所在页是登录页面的话则直接跳到主页,如果有token,但不是登录页,就直接放行跳转
    // 没有token的时候,判断跳转页面在不在白名单,如果在白名单就放行,不在就直接跳转到登录页
    if (to.path === '/login') {
      next('/') // 跳到主页
    } else {
      // 因为每个路由地址的切换都会经过路由守卫,为了防止多次触发获取用户资料的接口,需要做一个判断,判断现在有没有用户资料,如果有用户资料则不用获取,如果没有用户资料才进行获取
      // 怎么判断现在有没有用户资料？ 通过userId来进行判断
      console.log(store)
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo') // 等到用户资料获取完毕再执行next()方法 跳转
      }
      next()
    }
  } else {
    // 如果没有token
    // 怎么判断跳转路由地址在不在白名单内? 通过数组方法indexOf()进行查询判断
    if (whitelList.indexOf(to.path) > -1) {
    //   表示跳转的地址在白名单
      next() // 大于-1代表在白名单内,直接放行即可
    } else {
      next('/login') // 没有token且不在白名单 则强制跳转到登录页进行登录
    }
  }
  // 有一种情况,在有token的时候跳转登录页又会重定向到主页,相当于路由地址没有变化,保持原地不动,就没有经过路由后置守卫,导致进度条没有关闭,所以需要手动进行强制关闭进度条
  nprogress.done() // 解决手动切换地址时,进度条不关闭的问题
})
// 在路由后置守卫关闭进度条
// 路由后置守卫代表页面跳转成功后执行的钩子函数,回调函数内只有两个参数,to和from。没有next这个方法.常用来在路由跳转成功后执行逻辑,比如是修改标题
router.afterEach((to, from) => {
  nprogress.done() // 关闭进度条
})
