// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
  }
}
// 全局注册一个组件方式1：
// Vue.component('PageTools', PageTools)
// 全局注册一个组件方式2：
// Vue.use({
//   // install第一个参数是Vue构造器,是一个全局的Vue对象
//   install(Vue) {
//     Vue.component('自定义组件名', '引入的注册的组件名')
//   }
// })
