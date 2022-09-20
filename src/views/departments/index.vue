<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容- 头部 -- -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <!-- el-row 控制行 type="flex" 开启flex布局 justify="space-between" 主轴对齐方式: 两边对齐-->
        <!-- 将它的节点设置为true 当 isRoot = true的时候会删除节点 -->
        <!-- 给子组件传值,根节点这个插槽的是不需要展示编辑和删除部门的选项 所以设置isRoot状态是true 通过这个isRoot的状态配合v-if或v-show来进行显示和隐藏 -->
        <TreeTools :tree-node="company" :is-root="true" />

        <!-- 放一个 el-tree 树形组件-->
        <!--属性组件默认只识别数据中的label属性和children属性，如果是其他属性，我们需要通过props属性进行一个配置-->
        <!-- default-expand-all 将所有的节点默认展开 -->
        <!-- <el-tree default-expand-all :data="departs" :props="defaultProps"> -->
        <!-- 传入内容 插槽内容 会循环多次,有多少节点 就循环多次 -->
        <!-- 目标: 自定义树形组件的节点内容,有多少个节点就会显示多少个节点的内容 -->
        <!-- 作用域插槽 slot-scoped='{ obj }' 接收传递给插槽的数据 data 每个节点的数据对象-->
        <!-- 另外一种写法: 用template包裹起来 没有解构 在子组件内需要scoped.属性名.属性值来进行显示渲染 -->
        <!-- template的作用是模板占位符，可帮助我们包裹元素，但在循环过程当中，template不会被渲染到页面上 -->
        <!-- <template slot-scope="scoped">
            <TreeTools :tree-node="scoped" />
          </template> -->
        <el-tree default-expand-all :data="departs" :props="defaultProps">
          <!-- 将数据解构出来,子组件内直接 属性名.属性值就可以显示 -->
          <TreeTools slot-scope="{data}" :tree-node="data" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
export default {
  components: {
    TreeTools
  },
  data() {
    return {
      company: {
        name: '江苏传智播客教育科技股份有限公司',
        manger: '负责人'
      },
      departs: [
        { name: '总裁办',
          manger: '朱元璋',
          children: [
            { name: '董事会', manger: '曹操' }
          ]
        },
        { name: '行政部', manger: '曹丕' },
        { name: '人事部', manger: '曹贼' }
      ],
      defaultProps: {
        label: 'name'
      }
    }
  }
}

</script>

<style scoped>
.tree-card{
padding: 30px 40px;
font-size: 14px;
}
</style>
