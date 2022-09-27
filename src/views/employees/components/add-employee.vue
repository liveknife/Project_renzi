<template>
  <el-dialog width="750px" title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="formData" :model="formData" :rules="rules" label-width="120px">
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
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDepartments" @node-click="btn" />
        <!-- 放置树形组件 -->
        <!-- 树形组件默认展示label和children树形后台返回name这里用props将label改为name -->
        <el-tree
          v-if="showTree"
          v-loading="loading"
          default-expand-all
          :data="treeData"
          :props="{label:'name'}"
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
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
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
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
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
      this.$emit('update:showDialog', false)
    },
    async btnOk() {
      // 防止用户未输入信息,直接点击确定
      await this.$refs.formData.validate()
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
    btn() {
      this.showTree = false
    }
  }
}
</script>

<style>

</style>
