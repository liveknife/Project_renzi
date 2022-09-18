/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
// 手机号校验规则方法
export function validMobile(str) {
  return /^1[3-9]\d{9}$/.test(str) // test 方法检查字符串是否与给出的正则表达式模式相匹配，如果是则返回 true，否则就返回 false。
}
