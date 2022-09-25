<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容- 头部 -- -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <!-- el-row 控制行 type="flex" 开启flex布局 justify="space-between" 主轴对齐方式: 两边对齐-->
        <!-- 将它的节点设置为true 当 isRoot = true的时候会删除节点 -->
        <!-- 给子组件传值,根节点这个插槽的是不需要展示编辑和删除部门的选项 所以设置isRoot状态是true 通过这个isRoot的状态配合v-if或v-show来进行显示和隐藏 -->
        <TreeTools :tree-node="company" :is-root="true" @addDepts="addDepts" />

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
          <!--  -->
          <TreeTools slot-scope="{data}" :tree-node="data" @addDepts="addDepts" @delDepts="getDepartments" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <!-- 添加弹出层组件 -->
    <!-- tree-node 给add-dept子组件传递当前节点对象 -->
    <!-- <add-dept :current-node="node" @addDepts="getDepartments" @changedialog="test" /> -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :current-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils' // 递归渲染树状结构
import addDept from './components/add-dept.vue'
export default {
  components: {
    TreeTools,
    addDept
  },
  data() {
    return {
      // company: {
      //   // name: '江苏传智播客教育科技股份有限公司',
      //   // manger: '负责人'
      // },
      // departs: [
      //   // { name: '总裁办',
      //   //   manger: '朱元璋',
      //   //   children: [
      //   //     { name: '董事会', manger: '曹操' }
      //   //   ]
      //   // },
      //   // { name: '行政部', manger: '曹丕' },
      //   // { name: '人事部', manger: '曹贼' }
      // ],
      company: {},
      departs: [],
      defaultProps: {
        label: 'name'
      },
      showDialog: false, // 控制弹层隐藏和显示
      node: {} // 记录当前的node节点
    }
  },

  created() {
    this.getDepartments()
  },
  methods: {
    // 封装调用获取组织架构数据的方法
    async getDepartments() {
      const results = await getDepartments()
      // 根节点数据赋值 转换为接口请求回来的数据
      this.company = { name: results.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(results.depts, '') // 发现后台返回的是一个扁平化的数据结构,而不是树形的数据结构
      // console.log(results)
    },
    // node 当前点击的部门
    addDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node // 在调用当前接口的时候需要传递,知道是给哪一个节点添加的 将当前节点存下来
    },
    // test(value) {
    //   this.showDialog = value
    // }
    // 定义当前点击编辑按钮让弹窗展示的方法
    editDepts(node) {
      // console.log(node) // 当前点击的节点对象
      this.showDialog = true
      this.node = node
      // 应该在这里调用获取部门详情的方法
      // 通过ref的技术拿到子组件的实例,来调用子组件的方法,然后把当前节点的id通过形参传递过去
      this.$refs.addDept.getDepartDetail(node.id)
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
