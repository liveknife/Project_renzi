<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width:100%">
    <!-- el-col 控制列 -->
    <el-col>
      <!-- 左侧内容 -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- :span="4" 控制占据的份数 一行栅格默认分为24份 -->
    <el-col :span="4">
      <!-- 开启flex布局并且展示在末尾 -->
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <!-- 下拉菜单组件的事件绑定需要通过command来绑定 -->
          <el-dropdown @command="operateDepts">
            <span>
              操作 <i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <!-- 通过command来标识点击的是哪个 -->
              <el-dropdown-item command="add">
                添加子部门
              </el-dropdown-item>
              <!-- 取反 这里因为下面设置的isRoot默认值设置的是false 所以这里取反就是当它的值为true的时候就删除这两个选项 哪个插槽设置了 isRoot = true 就不显示,编辑和删除部门的选项 -->
              <el-dropdown-item v-if="!isRoot" command="edit">
                编辑部门
              </el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">
                删除部门
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <!-- 右侧内容 -->
    </el-col>
  </el-row>
</template>
<script>
import { delDepartments } from '@/api/departments'
export default {
  name: 'Treetools',
  // 接收父组件传过来的数据
  props: {
    treeNode: {
      type: Object,
      required: true // 必须要写的配置
    },
    // 备注: isRoot如果父组件中传递值了以传递过来的为主，如果没有传递，则以默认的为主
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 点击编辑删除和新增是触发
    operateDepts(type) {
      if (type === 'add') {
        // 添加子部门
        // 在当前点击的部门下,添加子部门 => this.treeNode就是当前点击的部门
        // 再点击添加选项的时候需要组件传递事件,然后将当前点击的节点信息传递过去
        this.$emit('addDepts', this.treeNode) // 触发自定义事件 告诉父组件展示弹层
      } else if (type === 'edit') {
        // 编辑部门
        this.$emit('editDepts', this.treeNode)
      } else {
        // 删除部门
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 当用户点击确定执行的是.then里面的逻辑,所以在.then里面调用接口
          // 第一种方法 async和await方式
          // await delDepartments()
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // })
          // 第二种方式
          return delDepartments(this.treeNode.id) // 接口调用返回一个promise,所以我们可以继续.then
        }).then(() => {
          this.$emit('delDepts')
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }
    }
  }
}
</script>

