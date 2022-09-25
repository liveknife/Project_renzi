<template>
  <!-- 弹出层组件 -->
  <!-- <el-dialog title="新增部门" :visible="true"> -->
  <!-- 表单数据 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name
          "
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- 下拉框添加focus事件 -->
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <!-- lable是下拉表单做展示用的,value是v-model关联的属性 -->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">''
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click.enter="btnOk">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
  <!-- 新增部门的弹层 -->
  <!-- visible 控制弹层显示和隐藏 -->

</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDept',
  props: {
    showDialog: {
      type: Boolean,
      default: true
    },
    // 父组件传递过来的当前节点对象,用里面的id查找同级部门
    currentNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 部门名称的重复校验
    const checkNameRepeat = async(rule, value, callback) => {
      // value是部门名称,要去和同级部门下的部门去比较,有没有相同的,有相同的 不能过 / 不相同就可以过
      // 失去焦点的时候需要重新获取最新的数据
      const { depts } = await getDepartments()
      let isRepeat = false
      // 通过当前点击的节点有没有id来判断是编辑还是新增
      if (this.formData.id) {
        console.log(this.formData)
        // 如果有id 就是编辑
        // 编辑的数据 在数据库里面存在 统计部门下 我的名字不能和其他同级部门下的名字重复 this.formData.id 就是我当前的id 我的pid是this.formData.pid
        // depts.filter(item => item.pid === this.formData.pid)
        // (1) 筛选出除自己之外当前点击节点的统计部门
        isRepeat = depts.filter(item => item.pid === this.currentNode.pid && item.id !== this.currentNode.id).some(item => item.name === value)
      } else {
      // 没有id是新增
      // console.log(depts, 16516156)
      // 去找同级部门下有没有和value相同的数据
      // console.log(depts) // 是一个数组,里边存的是所有的对象
      // 查找到pid和当前节点id相同的所以数据(id是一级节点),并返回新的数组
        isRepeat = depts.filter(item => item.pid === this.currentNode.id).some(item => item.name === value) // 查询当前找到的所有子节点的name和输入框输入的name进行判断如果相等,表示重复,则提示重新信息,否则正常添加
        // console.log(childRepeat)
      }
      // 如果isRepeat为true,表示找到了一样的名字
      isRepeat ? callback(new Error(`同级部门下已经存在${value}部门了`)) : callback()
    }
    // 部门编码的重复校验
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments() // 获取最新的数据并结构
      let isRepeat = false
      // 因为是和所以对象的编码code进行对比,所以不用过滤直接判断即可
      // 判断返回数组最新数据中每个对象的code 值和输入框内输入的值相等的话返回true,即重复了,进行错误提示,否则正常执行逻辑添加
      // 除判断重复之外编码输入不能为空所以用逻辑与&&进行链接,意思是只有满足这两个条件就会报提示信息(两个条件有一个判断不通过即为false)
      if (this.formData.id) {
        console.log(this.formData.id)
        // 有 id 是编辑
        // 部门编码的重复性校验,将自己排除之后,在所有的数据里面找有没有重复的
        isRepeat = depts.filter(item => item.id !== this.formData.id).some(item => item.code === value && value)
      } else {
        // 否则就是 新增
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`组织架构内已经存在${value}这个编码了`)) : callback()
    }

    return {
      // 表单数据对象
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1~50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码长度为1~50个字符' }, { trigger: 'blur', validator: checkCodeRepeat }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍长度为1~300个字符', trigger: 'blur' }
        ]
      }, // 校验规则对象
      peoples: [] // 存放员工信息的数组
    }
  }, // 计算属性判断当前的场景区分显示的标题
  computed: {
    showTitle() {
      // 判断表单对象的内容有没有id,新增的数据肯定是没有id的,因为都不存在这条数据哪里来的id,而编辑是在已有数据上进行修改,所有是存在id的
      // 所以如果有id代表点击的是编辑,没有id是新增
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    // 下拉菜单获得焦点的时候调用获取员工接口的数据并将数组的值赋给定义的空数组,通过遍历peples得到数据渲染
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
      // console.log(this.peoples)
    },
    // 获取部门详情的方法
    async getDepartDetail(id) {
      // this.formData = await getDepartDetail(this.currentNode.id)  // 直接使用props中当前节点对象中的部门id原则是没有问题的,但是会出现问题,因为props传递数据是异步的,又肯在调用接口的时候,数据还没有传递过来,导致接口没有携带正确的参数,从而调用失败,因为它存在一个概率问题,时而有时而没有,我们不能保证,所以为了不出漏差,采用了ref的技术,通过父组件调用子组件的方法,并传入点击对象的id来拿到当前点击节点对象的数据赋值给了 formData表单对象进行回填
      this.formData = await getDepartDetail(id) // 接口返回的数据需要赋值给formData这个表单对象的属性回填
      // 因为是父组件调用子组件的方法 先设置了node数据 直接调用方法
      // props传值是异步的
    },
    btnOk() {
      this.$refs.deptForm.validate(async isOk => {
        if (isOk) {
          if (this.formData.id) {
            // 编辑
            await updateDepartments(this.formData)
          } else {
            // 新增
            await addDepartments({ ...this.formData, pid: this.currentNode.id })
          }
          // 告诉父组件这时候数据已经添加到后台数据里面了,但是需要重新获取数据,渲染页面.而获取数据方法在父组件里面所以自定义事件,由父组件监听事件只要触发,父组件就调用封装的查询接口更新数据到树状结构组件进行渲染
          this.$emit('addDepts') // 自定义事件
          // this.$emit('changedialog', false) // 触发事件 常规写法更改父组件变量的状态
          // vue.js提供的新写法, sync修饰符
          // this.$emit('update: props名称', 值)
          this.$emit('update:showDialog', false)
          // 关闭dialog的时候会触发el-dialog的close事件 所以这里不需要单独重置数据
        }
      })
    },
    btnCancel() {
      // 注意事项：表单实例的resetFields方法只能重置表单中绑定的数据,如果不是表单中绑定的数据是不能进行重置的,而 id不是表单绑定的数据,所以我们需要手动进行重置表单对象的数据,就是将表单对象formData中的数据还原成原来的样子
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹层
      this.$emit('update:showDialog', false) // 点击按钮的时候关闭弹层
      // 清除之前的校验
      this.$refs.deptForm.resetFields() // 调用表单实例对象的restFields方法清空表单所有的字段,重置为初始值,并且把所有的校验结果做一个移除
    }
  }
}
</script>

  <style />
