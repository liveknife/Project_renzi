<template>
  <el-dialog width="750px" title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDepartments" />
        <!-- 放置树形组件 -->
        <!-- 树形组件默认展示label和children树形后台返回name这里用props将label改为name -->
        <el-tree
          v-if="showTree"
          v-loading="loading"
          default-expand-all
          :data="treeData"
          :props="{label:'name'}"
          @node-click="slelctNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <!-- <template v-slot:footer> -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
      </el-col>
    </el-row>
    <!-- </template> -->
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import { addEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          // pattern手机号格式校验
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'change' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        // 部门名称的校验为什么不能用blur,树形组件和input标签是两个独立的标签，再进行节点选择时，就证明已经失去焦点了，就会给验证提示，这样不合理，我们需要在输入框的值发生变化时触发该校验，所以这里要用change事件
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '入职时间', trigger: 'blur' }
        ]
      },
      treeData: [], // 存放转换完毕的树形结构数据
      loading: false,
      showTree: false
    }
  },
  methods: {
    // 点击取消和点击×号关闭弹窗并移除表单校验
    btnCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields()
      this.$emit('update:showDialog', false)
    },
    async btnOk() {
      try {
        await this.$refs.addEmployee.validate() // 点击确定先校验表单
        // 调用新增接口
        await addEmployee(this.formData) // 新增员工
        // 告诉父组件更新数据
        // this.$parent 可以直接调用到父组件的实例 实际上就是父组件this
        // this.$emit
        // 在子组件中如何拿到父组件的实例?通过this.$parent,但是使用是有条件的，组件的使用不能包在element-ui的组件标签里面。

        // console.log(this.$parent, 'asdwq')
        this.$parent.getEmployeeList && this.$parent.getEmployeeList()
        this.$parent.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    // 部门内容获取接口方法封装
    async getDepartments() {
      this.showTree = true
      this.loading = true // 调用接口前开启loading
      const { depts } = await getDepartments()
      // depts 是一个扁平化的数组,需要转化为树形结构,才可以被el-tree组件显示
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false // 调用接口后关闭loading
    },
    // 定义点击树形组件节点的方法,里面有一个参数,存的是当前点击节点的对象
    slelctNode(node) {
      this.formData.departmentName = node.name // 部门的表单对象是formData.departmentName ,将点击的节点对象的name赋值给当前节点对象
      this.showTree = false // 点击完毕 关闭树形组件
    }
  }
}
</script>

<style>

</style>
