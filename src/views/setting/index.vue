<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <!-- el-Tabs 标签页 -->
        <el-tabs>
          <!-- 放置页签 lable控制显示的文字信息 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <!-- 因为新增和编辑的弹层是同一个,它们的事件处理逻辑是一样的只需要判断点击的是新增还是编辑,而通过表单对象有没有id可以判断出新增或是编辑,所以这里的新增按钮只需要打开弹层即可 直接注册点击事件,改变showDialog的值来控制弹窗显示隐藏的状态即可, -->
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 border 给表格加边框 lable 每一列的列名标题 -->
            <!-- data绑定接口返回的数据,prop绑定展示的数据的属性名 -->
            <!-- align="center" 数据在表格中居中显示 -->
            <!-- 通过index属性自定义索引号,后面跟的是方法,方法里面是计算公式 -->
            <el-table border="" :data="list">
              <el-table-column align="center" type="index" :index="indexMethods" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="角色名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="scope">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <!-- current-page 代表是当前页,page-size 代表每一页显示的数据数量,total代表数据总条数 -->
              <!-- 如何拿到点击的当前页？ -->
              <!-- current-change 当前页改变时触发 获取当前点击的页码 -->
              <el-pagination
                :current-page="page.page"
                :total="page.total"
                :page-size="page.pagesize"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!-- el-alert 警告标签,title 展示文字,show-icon展示图标,:closable="false" 控制警告是否能关闭,这里默认是不可关闭的。 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- label-width 是显示标题的宽度 -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <!-- type="textarea"文本域,rows代表的是可输入行数 disabled禁止输入 -->
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 编辑和新增弹层组件 -->
    <!-- close事件,点击确定的时候也会触发,因为确定之后的关闭弹窗会触发close事件 -->
    <el-dialog :title="neww" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click.enter="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [], // 接收请求回来的角色列表的数据
      page: {
        // 放置页码和相关数据
        page: 1, // 当前页,默认第一页
        pagesize: 10, // 每页展示多少条数据,这里是10条
        total: 0 // 数据记录总数,这个数据是后台返回回来的
      },
      formData: {},
      showDialog: false, // 弹层显示和隐藏的变量
      roleForm: { // 表单数据对象
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId']), // 引入vuex中Getters建立的对公司id的快捷访问
    neww() {
      return this.roleForm.id ? '编辑弹层' : '新增弹层'
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 序号计算
    indexMethods(index) {
      return (this.page.page - 1) * this.page.pagesize + index + 1
    },
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    // 调用公司信息接口的方法封装
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    changePage(newPage) {
      console.log(newPage)
      this.page.page = newPage // 将点击的页码重新赋值给当前页的变量,并重新调用接口获取数据并渲染
      this.getRoleList()
    },
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning' })
        // 只有点击了确定才能进入下方代码
        await deleteRole(id) // 传入id并调用删除接口
        this.getRoleList() // 删除完毕重新加载数据渲染页面
        this.$message.success('删除成功')
      } catch (err) {
        console.log(err)
      }
    },
    // 编辑按钮的点击事件
    async editRole(id) {
      this.roleForm = await getRoleDetail(id) // 查询传入id对应的数据,并赋值给表单对象,进行表单数据回填
      this.showDialog = true
    },
    // 关闭弹窗
    btnCancel() {
      // 手动清空数据
      this.roleForm = {
        name: '',
        description: ''
      }
      // 调用表单实例resetFields()方法移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    // 点击弹窗确定按钮后调用的方法
    async btnOk() {
      // 点击确定按钮的时候进行自定义校验
      // 注意事项: 如果validate方法中没有回调函数传入,它会返回一个Promise
      // 注意事项: 只有当验证通过之后才会执行await下面的代码,没有验证通过则执行catch的错误提示
      try {
        await this.$refs.roleForm.validate()
        // 校验通过才会执行await下方的代码
        // 通过表单对象中是否有id去确定是新增还是编辑
        if (this.roleForm.id) {
          // 有id是编辑
          await updateRole(this.roleForm) // 传入表单对象 修改表单数据
        } else {
          // 没有id是新增
          await addRole(this.roleForm)
        }
        this.getRoleList() // 重新调用获取数据接口,并渲染页码
        this.roleForm.id ? this.$message.success('修改成功') : this.$message.success('添加成功') // 给用户提示已经修改成功
        this.showDialog = false // 修改成功关闭弹窗
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>

</style>
