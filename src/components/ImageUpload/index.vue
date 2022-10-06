<template>
  <div>
    <!-- 图片上传的组件 -->
    <!-- list-type="picture-card"它来控制图片列表上传的样式 -->
    <!-- :limit 限制上传个数(这里限制图片的上传数量) -->
    <!-- action: 上传的地址 暂时没有地址 给他一个#号就不会报错了 -->
    <!-- file-list是上传的文件列表,可以绑定到上传组件,让组件来显示 -->
    <!-- :on-preview="preview" 是上传组件的一个属性它的值是一个事件处理函数 代表的是预览当前点击的文件 -->
    <!-- 通过动态class控制图片显示和隐藏,当布尔值为true时,class生效,否则不生效 -->
    <!-- :on-remove="remove" -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="{isShow:fileComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 进度条组件 -->
    <el-progress v-if="showPercent" :percentage="percent" style="width:180px;" />
    <!-- 关闭弹窗方法1：@close="showDialog=false" -->
    <!-- 关闭弹窗方法2：:visible.sync="showDialog" sync修饰符,因为showDialog在data中,可以直接通过sync来关闭 不需要this.$emit('upload:showDialog',false)来进行修改了-->
    <el-dialog title="图片预览" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云cos包
// 实例化COS对象
const cos = new COS({
  SecretId: 'AKIDcAiA2UozyjJsPo6RmzATdaM5e5MVXTef', // 身份识别ID
  SecretKey: 'xiIftyraAf1Hft6B7zkO4f8QaptjhbKq' // 身份密匙
})
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentUid: null,
      percent: 0, // 进度条的百分比
      showPercent: false // 控制进度条展示和隐藏的变量
    }
  },
  computed: {
    // 如果他为true 表示就不该显示 +号 上传了
    // 计算属性的变量如果fileList有一张图片就会返回true,则图片上传组件隐藏,否则图片上传组件显示
    fileComputed() {
    //   console.log(this.fileList.length === 1)
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击 +号 会触发预览事件,拿到要预览图片的地址url
    handlePreview(file) {
      // console.log(file) // 拿到的是预览图片的信息,其中包括图片的url地址
      this.imgUrl = file.url // 将拿到的图片地址赋值给当前弹层的img标签的 src属性来显示图片
      this.showDialog = true // 显示预览图片弹层
    },
    handleRemove(file, fileList) {
      //
    //   console.log(file) // 删除之前的数组,主要是删除的图片信息,url地址和图片uid
    //   console.log(fileList) // 删除之后的新数组
    //   console.log(this.fileList) // 删除之前的数组
    //   this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      this.fileList = fileList
    },
    changeFile(file, fileList) {
      // 事件触发两次,图片选择完后会触发,上传成功或失败后也会触发
      // 图片没有上传成功,fileList还是一个空数组
      console.log(file, fileList)
      this.fileList = fileList.map(item => item)
      // 等待和腾讯云服务的交互,等待fileList拿到真正的图片地址
    },
    beforeUpload(file) {
      // file是一个对象,拿到要上传图片的大小(size),以及格式(type),
      // console.log(file, '8465165')
      // 检查文件类型
      const type = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      // 数组的 includes 方法会判断有没有符合条件的,有则返回true,没有则返回false 且它有包含的意思
      if (!type.includes(file.type)) {
        // 不符合条件,给一个错误提示
        this.$message.error('上传图片格式只能是JPG,GIF,BMP,PNG格式')
        return false
      }
      // 检查 文件大小 5M 1M = 1024 * 1024
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        // 代表图片超过规定大小
        // 超过限制文件大小
        this.$message.error('上传图片大小不能超过5MB !s')
        return false
      }
      // 已经确定了当前上传的文件 file,将当前上传成功的文件的uid做个记录,后面用来判断查找,当前的文件
      // console.log(file)
      this.currentUid = file.uid
      this.showPercent = true // 格式校验成功图片上传之前展示进度条
      // 如果图片格式和大小都符合要求,则返回true
      return true // 最后一定要返回 true
    },
    // 调用腾讯云的存储桶进行上传操作
    // 选择完文件,执行自定义上传方法,里面有一个参数params可以拿到要上传的图片信息
    upload(params) {
      // console.log(params.file)
      // 上传前判断文件是否存在,存在则执行上传操作
      if (params.file) {
        // 执行上传操作
        // cos的putObject方法有两个参数,第一个参数是个对象,第二个参数是一个回调函数function
        cos.putObject({
          // 上传到腾讯云 => 哪个存储桶哪个地域的存储桶文件 => 格式 => 名称 => 回调
          Bucket: 'chacha-1314168689', // 存储桶id
          Region: 'ap-chengdu', // 存储桶所在地域
          Key: params.file.name, // 上传的文件名
          Body: params.file, // 上传的文件对象
          StorageClass: 'STANDARD', // 上传模式类型 标准模式
          onProgress: (params) => {
            console.log(params)
            this.percent = params.percent * 100 // *100 转换小数
          }
        }, (err, data) => {
          // 拿到data则说明上传文件成功,里面包含了之后的图片信息的url地址,如果上传失败,进入err错误提示信息
          // console.log(err || data)
          if (!err && data.statusCode === 200) {
            // 说明文件上传成功
            // fileList 才能显示到上传组件,此时将fileList中的数据的url地址变为现在上传成功的地址
            // 目前是一张图片,fileList是一个数组,里面可能会有多个对象,我们要将上传成功之后的地址赋值给哪个对象,需要进行判断
            // 需要知道当前上传成功的是哪一张图片
            // 将上传成功的图片放回到fileList里面,fileList变化, upload组件就会根据数组的变化而去更改视图
            this.fileList = this.fileList.map(item => {
              // 找数组内所有文件的uid,如果全等于先前记录的currentUid的话说明是我们刚刚上传的那张图片,否则就返回原数组
              // 考虑到图片大小不同,上传速度不同,为了防止在没上传成功的时候点击保存按钮,我们需要添加一个上传成功的标识
              if (item.uid === this.currentUid) {
                // upload为true表示上传完毕
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            // 文件上传成功之后,关闭进度条,并且重置百分比为0
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 500)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
// .isShow {
//     .el-upload--picture-card{
//         display: none;
//     }
// }

.isShow {
    .el-upload--picture-card {
    display: none !important;
    background-color: aqua!important;
    }
}
</style>
