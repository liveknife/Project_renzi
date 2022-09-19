import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css 全局的css样式文件

import App from './App' // 引入根组件
import store from './store' // 引入vuex文件
import router from './router' // 引入路由文件

import '@/icons' // icon  引入图标配置文件
import '@/permission' // permission control 引入权限配置文件
// 引入封装好的自定义指令
// import { imgerror } from '@/directives' 常规写法 有多个指令的时候需要多次引入,重复注册自定义指令,代码冗余,不便于修改,查阅。所以这时候会有一个新的语法：import * as 变量 from '@/directives' 这种写法得到的时一个对象，我们就可以通过遍历对像去注册
import * as directive from '@/directives'
// 打印发现它是一个对象,里面存的是我们导出的数据
console.log(directive, 'ccc')
// for in 遍历对象 通过遍历对象拿到对象中的所有属性
console.log(Object.keys(directive), '吃饭吃饭') // 得到了一个数组
Object.keys(directive).forEach(key => {
  // console.log(key) 数组的每个值
  // 如何获取对象中属性所对应的值
  // console.log(directive[key], '对象值') // 对象和所对应的值
  Vue.directive(key, directive[key]) // 注册自定义指令
})

// 如何实现一个全局的自定义指令
// Vue.directive('指令名称', {
//   inserted(el) {
//     // el 代表自定义指令生效的dom节点
//   }
// })

// set ElementUI lang to EN
// 注册element-ui 组件库
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router, // vue原型中挂载路由
  store, // vuex挂载
  render: h => h(App)
})
