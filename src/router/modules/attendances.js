// 导出员工的路由规则
import Layout from '@/layout'
export default {
// 路由规则
  path: '/attendances', // 路由地址
  name: 'attendances', // 给模块的一级路由加一个name属性,后面会在做权限的时候用到
  component: Layout, // 组件
  children: [
    {
      // 二级路由的path什么都不写的时候,此时它表示二级路由的默认路由
      path: '', // 这里不用写 什么都不写表示 /attendances 不但有布局 layout => 员工主页
      conponent: () => import('@/views/attendances'),
      // 路由元信息 其实就是一个存储数据的地方 可以放任何内容
      meta: {
        title: '考勤' // 为什么要用title 因为左侧导航读取了这里的title属性
      }
    }
  ]
}
