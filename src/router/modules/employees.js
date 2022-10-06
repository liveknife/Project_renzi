// 导出员工的路由规则
import Layout from '@/layout'
export default {
// 路由规则
  path: '/employees', // 路由地址
  name: 'employees', // 给模块的一级路由加一个name属性,后面会在做权限的时候用到
  component: Layout, // 组件
  children: [
    {
      // 二级路由的path什么都不写的时候,此时它表示二级路由的默认路由
      path: '', // 这里不用写 什么都不写表示 /employees 不但有布局 layout => 员工主页
      component: () => import('@/views/employees/'),
      // 路由元信息 其实就是一个存储数据的地方 可以放任何内容
      meta: {
        title: '员工管理', // 为什么要用title 因为左侧导航读取了这里的title属性
        icon: 'people'
      }
    },
    // 员工详情路由页面
    {
      // 这种写法必须传id, 加个?号不添加id也可以跳转(?代表id可传可不传,不加?就是id必须传,不然会跳到404页面)
      path: 'detail/:id?', // query传参 动态路由传参
      component: () => import('@/views/employees/detail'),
      hidden: true, // 不在左侧菜单显示
      meta: {
        title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      }
    }
  ]
}
