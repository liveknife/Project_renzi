<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <!-- 左侧插槽传值 显示记录 -->
        <template #before>
          <span>共{{ page.total }}条数据</span>
        </template>
        <!-- 右侧显示三个按钮 excel导入、excel导出、新增员工 -->
        <template #after>
          <el-button size="small" type="success">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog =true">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 表格组件 -->
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table v-loading="loading" border :data="list">
          <!-- sortable代表排序 -->
          <el-table-column type="index" :index="indexMethods" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <!-- 通过列属性formatter对字段进行处理 -->
          <el-table-column prop="formOfEmployment" label="聘用形式" sortable :formatter="formatEmployment" />
          <!-- 过滤器的方式完成聘用形式内容字段的转换 -->
          <!-- <el-table-column label="聘用形式" sortable="">
            <template slot-scope="scope">
              <span>{{ scope.row.formOfEmployment |changeType }}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column
            label="入职时间"
            sortable=""
          >
            <!-- 入职时间通过作用域插槽搭配全局过滤器进行格式化处理 -->
            <template slot-scope="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="">
            <template v-slot="{row}">
              <!-- 根据后台数据将开关的状态变为动态的,如果value是1开关就是开启的状态,反之为关闭 -->
              <el-switch
                :value="row.enableState === 1"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <!-- type="text"表示按钮是纯文本类型 -->
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 新增弹层组件 -->
    <!-- sync修饰符: 子组件使用this.$emit('update:showDialog',false)可以直接关闭弹窗 -->
    <add-employee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue' // 引入新增弹层组件
export default {
  // 过滤器
  filters: {
    changeType(value) {
      if (value === 1) {
        return '正式'
      } else if (value === 2) {
        return '非正式'
      } else {
        return '未知'
      }
    }
  },
  components: {
    AddEmployee
  },
  data() {
    return {
      list: [],
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      loading: false,
      showDialog: false // 默认关闭
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    indexMethods(index) {
      return (this.page.page - 1) * this.page.size + index + 1
    },
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.list = rows
      this.page.total = total
      this.loading = false
    },
    changePage(page) {
      this.page.page = page
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // console.log(row) // row参数代表单元格所在行的所有字段信息
      // console.log(column) // column代表的是列的信息
      // console.log(cellValue) // cellValue代表单元格的值
      // console.log(index) // index数组中每个对象的索引

      // find数组方法,返回数组中满足条件的第一个元素,否则返回undefined
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除功能
    async delEmployee(id) {
      try {
        await this.$confirm('确认删除该员工吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delEmployee(id)
        this.$message.success('删除成功')
        this.getEmployeeList()
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>

</style>
