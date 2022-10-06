<template>
  <div>
    <UploadExcel ref="data" :on-success="success" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async success({ header, results }) {
    // 它们的数据都是中文的,和新增员工的属性是一致的
    // username: '',    姓名
    // mobile: '',      手机号
    // formOfEmployment: '',
    // workNumber: '',  工号
    // departmentName: '',
    // timeOfEntry: '', 入职日期
    // correctionTime: '' 转正日期
      const userRelations = {
        '姓名': 'username',
        '手机号': 'mobile',
        '工号': 'workNumber',
        '入职日期': 'timeOfEntry',
        '转正日期': 'correctionTime'
      }
      //   var arr = []
      //   results.forEach(item => {
      //     var userInfo = {}
      //     Object.keys(item).forEach(key => {
      //       // 现在key是中文
      //       userInfo[userRelations[key]] = item[key] // 将原来中文对应的值 赋值给原来英文对应的值
      //       console.log(userRelations[key])
      //     })
      //     arr.push(userInfo)
      //   })
      console.log(results, '456')
      // 数组方法map会自动将遍历加工完成的数据添加到一个数组里面,这时候就可以用变量去接收
      var newArr = results.map(item => { // 遍历excel导入的数据
        var userInfo = {}
        // item是数组里面每一个对象
        // console.log(Object.keys(item), 666)
        // 通过Object.keys(item) // 拿到每一个对象的属性名并返回一个数组
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
            debugger
            return
          } else {
            // userInfo[userRelations[key]]   // 将拿到的英文属性名添加到定义的新对象里面
            userInfo[userRelations[key]] = item[key] // 将每一个对象的属性值赋给新对象的属性名(英文)
          // console.log(userRelations[key], '属性') // 这个是属性名对应的英文
          // console.log(item[key], 'key') // 属性名对应的属性值
          }
        })
        return userInfo
      })
      //   console.log(newArr)
      await importEmployee(newArr)
      this.$message.success('导入excel成功')
      this.$router.back() // 回到上一个页面,哪里来回哪去
    },
    // 转化excel的日期格式方法的封装
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
    }
  }
}
</script>

<style>

</style>
