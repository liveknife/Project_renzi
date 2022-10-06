
// 导出一个常量,这个常量值是一个对象
export const imgerror = {
  // 指令对象 会在当前dom元素插入到节点之后
  inserted(dom, options) {
    // dom表示当前指令生效的dom对象
    // 此时dom就是头像(图片img)标签
    // 第一种情况
    // 当图片有地址 但是地址没有加载成功或报错的时候  会触发图片的一个事件 => onerror ,如果图片不报错就不会触发这个事件
    // 第二种情况
    // 当图片地址为空的时候,不会触发onerror事件,这时候也需要默认一张图片展示
    dom.src = dom.src || options.value
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
  },
  // 考虑到代码的完整以及多种情况,我们需要添加一个componentUpdated钩子函数
  // 该函数同inserted一样也是一个钩子函数
  // inserted和componentUpdated的区别?
  // inserted是自定义指令所在的DOM第一次插入到节点的时候就会触发,而且只会触发一次
  // componentUpdated钩子函数是当数据更新之后,自定义指令所在的DOM需要更新,更新的时候不会再触发inserted钩子函数,触发的是componentUpdated钩子函数
  componentUpdated(dom, options) {
    // console.log(dom)
    // console.log(options)
    dom.src = dom.src || options.value
  }
}
