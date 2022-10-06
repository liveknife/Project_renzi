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
          <el-button size="small" type="success" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="excelData">导出</el-button>
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
          <el-table-column width="120px" align="center" label="头像" sortable="">
            <!-- 插槽 -->
            <!-- 如果图片地址为空或者图片地址出现异常,都会调用我们的自定义指令,传递一张本地默认的图片过去 -->
            <template v-slot="{row}">
              <img v-imgerror="require('@/assets/common/R-C.gif')" :src="row.staffPhoto" alt="" style="border-radius: 50%; width: 80px; height: 80px; padding: 10px" @click="showQrCode(row.staffPhoto)">
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" sortable="" />
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
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
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
    <!-- 二维码弹层 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue' // 引入新增弹层组件
import { formatDate } from '@/filters'
import QrCode from 'qrcode' // 二维码转换插件
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
      showDialog: false, // 默认关闭
      showCodeDialog: false
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
    },
    // excel导出方法
    excelData() {
      //  做操作
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 性能优化 按需引入,文件体积过大,使用频率比较少,所以需要的时候再去加载
      // 导出 header 从哪里来
      // data从哪里来
      // excel是引入文件的导出对象
      // 调用excel导出功能的方法,并配置参数
      console.log(import('@/vendor/Export2Excel'))
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows) // 要导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']] // 一行数组代表一行表头
        const merges = ['A1:A2', 'B1:F1', 'G1:G2'] // 合并单元格的规则
        excel.export_json_to_excel({
          header: Object.keys(headers), // 配置表头参数,只有表头这个参数是导出不成功的,还需要配置data
          data, // data参数是导出的具体数据
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx',
          multiHeader, // 控制表头的行数
          merges // 对表头进行合并的规则
        })
      })
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70) // 由于excel里面的日期转换为时间戳之后,比本来的日期多了70年 所以这里减去了70年
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    },
    // 该方法负责将数组转化成二维数组
    formatJson(headers, rows) {
      // console.log(rows)
      // 1、先遍历row,拿到每一行的数据是一个对象{name:'zs',six:'xx'}
      return rows.map(item => {
        // item是个对象
        // Object.keys(headers)拿到一个数组,里面存放的是每一个中文属性名 ['姓名','手机号'....]
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 聘用形式转化
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }

          // key就相当于是单个的中文名称,例如: '姓名'...
          // headers[key]就是每个英文属性, 例如['username']
          // item[headers[key]]取出来的是英文属性对应的值 如 '张三'
          return item[headers[key]] // map会默认返回一个新的数组,而这里是将取出的每个属性值放入了 map返回的数组里面
        })
      })
    },
    // 点击头像调用该方法展开弹层并且生成二维码
    showQrCode(url) {
      if (url) {
        this.showCodeDialog = true
        // 当弹层设置为true的时候,页面展示弹层,更新dom,但是dom更新是异步的,不能马上获取dom更新的数据,所以这里使用$nextTick()方法
        // this.$nextTick()方法主要就是用来获取异步更新后的dom
        this.$nextTick(() => {
          // QrCode.toCanvas 方法有两个参数第一个是cancas实例,第二个参数是转换二维码的信息
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        debugger
        this.$message.warning('该用户还未上传头像')
      }
    }
  }
}
</script>

<style>

</style>
