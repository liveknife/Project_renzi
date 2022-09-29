import Vue from 'vue'
import Router from 'vue-router'
// 引入多个模块的规则
import approvalsRouter from './modules/approvals'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permission'
import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salarys'
import settingRouter from './modules/setting'
import socialRouter from './modules/social'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// constantRoutes是静态路由的变量 所有用户都可以看到的页面,基本没有权限,登录即可看到
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true // 控制该路由在菜单中是否展示,true代表隐藏
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true // 控制该路由在菜单中是否展示,true代表隐藏
  },

  {
    path: '/',
    component: Layout, // 属于一级路由,是布局主页面
    redirect: '/dashboard', // 当地址栏是空的时候将页面重定向到首页
    children: [{ // 首页的二级页面
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/import',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '', // 表示默认的二级路由
        component: () => import ('@/views/import')
      }
    ]
  },

  // 这个配置放到最后是指当所有的路由地址都不匹配的时候重定向到404页面
  { path: '*', redirect: '/404', hidden: true }
]
// 动态路由规则注册导出
// 动态路由的创建，代表的是一个数组里面有很多个对象，每一个对象就是一个模块路由规则
export const asyncRouters = [
  approvalsRouter,
  departmentsRouter,
  employeesRouter,
  permissionRouter,
  attendancesRouter,
  salarysRouter,
  settingRouter,
  socialRouter
]
// 定义的动态路由变量
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }), // 管理页面的滚动行为,是路由的一个方法
  routes: [...constantRoutes, ...asyncRouters] // 静态路由和动态路由的临时合并
})

const router = createRouter() // 实例化一个路由

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
