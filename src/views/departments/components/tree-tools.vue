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
        <el-col>{{ treeNode.manger }}</el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown>
            <span>
              操作 <i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item>
                添加子部门
              </el-dropdown-item>
              <!-- 取反 这里因为下面设置的isRoot默认值设置的是false 所以这里取反就是当它的值为true的时候就删除这两个选项 哪个插槽设置了 isRoot = true 就不显示,编辑和删除部门的选项 -->
              <el-dropdown-item v-if="!isRoot">
                编辑部门
              </el-dropdown-item>
              <el-dropdown-item v-if="!isRoot">
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

export default {
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
  }
}
</script>

