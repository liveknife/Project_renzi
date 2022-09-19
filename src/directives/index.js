// 导出一个常量,这个常量值是一个对象
export const imgerror = {
  // 指令对象 会在当前dom元素插入到节点之后
  inserted(dom, options) {
    // dom表示当前指令生效的dom对象
    // 此时dom就是头像(图片img)标签
    // 当图片有地址 但是地址没有加载成功或报错的时候  会触发图片的一个事件 => onerror ,如果图片不报错就不会触发这个事件
    dom.onerror = () => {
    //   console.log('失败了cccc')
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // dom可以注册error事件
      // 触发事件后给头像地址重新赋值一个地址
      // 图片地址怎么来的? 通过自定义指令的第二个参数对象的value拿到传递过来的参数
      dom.src = options.value // 这里不能写死
    //   <img v-imgerror="img"> options就相当于这个变量 它有一个value属性
    // data(){return{ img: 'a.png'}}  options.value可以获取到变量的值
    }
  }
}
