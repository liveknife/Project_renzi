const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 建立对state中token的快捷访问
  name: state => state.user.userInfo.username, // 建立对用户名的快捷访问
  userId: state => state.user.userInfo.userId, // 建立对用户id的快捷访问
  staffPhoto: state => state.user.userInfo.staffPhoto, // 建立头像的快捷访问
  companyId: state => state.user.userInfo.companyId // 建立对于公司id的快捷访问
}
export default getters
