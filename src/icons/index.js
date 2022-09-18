import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// 注册一个全局使用svg图标的组件
Vue.component('svg-icon', SvgIcon)
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
// 将所有 svg目录下的所有以.svg后缀的文件全部引入到项目中
