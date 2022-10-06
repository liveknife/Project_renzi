<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">

            <!-- 放置表单 -->
            <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 个人详情组件 -->
            <!-- 动态组件在进行切换的时候在不断的创建和销毁DOM影响性能 -->
            <!-- 通过 keep-alive 将它进行包裹起到了组件的缓存作用,就不会在切换组件的时候对DOM不断的进行销毁和创建,而是从它的缓存中读取数据  -->
            <!-- vue.js内置组件component 可以是任何组件-->
            <!-- 动态组件 可以通过更改变量的值来动态的切换组件 -->
            <!-- <user-info /> -->
            <!-- 使用vue.js内置的动态组件component在页面渲染组件的时候需要用一个变量把组件接收过来并添加动态属性 :is="这个变量='要显示的组件名称' " 就可以显示该组件内容 -->
            <keep-alive>
              <component :is="userComponent" />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- <job-info /> -->
            <keep-alive>
              <component :is="jobComponent" />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import userInfo from './components/user-info.vue'
import jobInfo from './components/job-info.vue'
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
export default {
  components: {
    userInfo,
    jobInfo
  },
  data() {
    return {
      // 备注:路由地址中用:拼接的的动态参数获取的时候需要用this. $route. params.参数名称
      // 例如: path:'detail/id?'
      // 备注2:如果在路由地址中是?拼接的传参方式需要用this. $route. query.参数名称
      // 例如:http://localhost:8888/#/employees/detail/?id=131245
      userInfo: {
        username: '',
        password2: '' // 为什么叫password2而不是password 因为读取出来的是密码是密文
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      },
      // 个人信息组件
      userId: this.$route.params.id, // 将路由的参数赋值给data变量
      userComponent: userInfo,
      jobComponent: jobInfo // 岗位信息组件
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    saveUser() {
      // 调用方法是先进行表单校验
      this.$refs.userForm.validate().then(async() => {
        // 后面的password会替换前面展开运算符拷贝的password2
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('修改用户信息成功')
        this.$router.back()
      })
    }
  }
}
</script>

<style>

</style>
