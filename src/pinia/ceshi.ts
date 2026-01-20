// @/pinia/ceshi.js 完整正确版本
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 严格按 Pinia 组合式 API 写法，无任何隐藏错误
export const ss = defineStore('ceshi', () => {
  // 初始化 cartlist 为数组（必选，确保不会 undefined）
  const cartlist = ref([{ 'hah': 1 }])

  // 添加商品方法（修改 ref.value，保留响应式）
  function jiayi() {
    cartlist.value.push({ 'hah': Date.now() }) // 加时间戳，方便区分新添加的项
  }

  // 导出所有需要的属性/方法（缺一不可）
  return {
    cartlist,
    jiayi
  }
})

// 默认导出（兼容两种导入方式）
export default ss