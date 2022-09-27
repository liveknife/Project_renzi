<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <!-- 子组件使用插槽的目的是为了让子组件变得灵活,父组件传递什么内容,子组件就显示什么内容 -->
    <PageTools :show-before="true">
      <!-- 具名插槽的第一种方式 -->
      <!-- <span slot="before">早上好</span>
      <el-button slot="after" type="primary">导入</el-button> -->
      <!-- 具名插槽的第二种方式 -->
      <!-- <template v-slot:before>
        <span>早上好</span>
      </template>
      <template v-slot:after>
        <el-button type="primary">导入</el-button>
      </template> -->
      <!-- 用#号简写 -->
      <template #before>
        <span>早上好</span>
      </template>
      <template #after>
        <el-button type="primary">导入</el-button>
      </template>
    </PageTools>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
