<template>
  <div class="example-container">
    <h2>弹窗组件使用示例</h2>
    
    <!-- 方式1：受控模式（推荐） -->
    <div class="example-section">
      <h3>方式1：受控模式（通过props控制）</h3>
      <button @click="showControlledPopup('操作成功！')">显示成功弹窗</button>
      <button @click="showControlledPopup('操作失败！', true)">显示错误弹窗</button>
      
      <!-- 受控模式使用 -->
      <Tanchuang 
        v-model:show-popup="controlledShowPopup"
        :popup-message="controlledMessage"
        :is-error="controlledIsError"
        :duration="3000"
        @close="handleClose"
      />
    </div>

    <!-- 方式2：非受控模式（通过ref调用） -->
    <div class="example-section">
      <h3>方式2：非受控模式（通过ref调用方法）</h3>
      <button @click="showUncontrolledPopup('数据保存成功！')">显示弹窗（非受控）</button>
      <button @click="closeUncontrolledPopup">手动关闭弹窗</button>
      
      <!-- 非受控模式使用 -->
      <Tanchuang ref="uncontrolledPopupRef" />
    </div>

    <!-- 方式3：简单模式（仅显示消息） -->
    <div class="example-section">
      <h3>方式3：简单模式</h3>
      <button @click="showSimplePopup">显示简单弹窗</button>
      
      <!-- 简单模式使用 -->
      <Tanchuang 
        v-model:show-popup="simpleShowPopup"
        :popup-message="'这是一个简单的提示信息'"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Tanchuang from './tanchuang.vue'

// 方式1：受控模式的状态
const controlledShowPopup = ref(false)
const controlledMessage = ref('')
const controlledIsError = ref(false)

// 方式2：非受控模式的ref
const uncontrolledPopupRef = ref<InstanceType<typeof Tanchuang> | null>(null)

// 方式3：简单模式的状态
const simpleShowPopup = ref(false)

// 受控模式的方法
const showControlledPopup = (message: string, isError = false) => {
  controlledMessage.value = message
  controlledIsError.value = isError
  controlledShowPopup.value = true
}

const handleClose = () => {
  console.log('弹窗已关闭')
  // 可以在这里执行关闭后的逻辑
}

// 非受控模式的方法
const showUncontrolledPopup = (message: string) => {
  if (uncontrolledPopupRef.value) {
    uncontrolledPopupRef.value.show(message, { duration: 2000 })
  }
}

const closeUncontrolledPopup = () => {
  if (uncontrolledPopupRef.value) {
    uncontrolledPopupRef.value.close()
  }
}

// 简单模式的方法
const showSimplePopup = () => {
  simpleShowPopup.value = true
}
</script>

<style scoped>
.example-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.example-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.example-section h3 {
  margin-top: 0;
  color: #333;
}

button {
  margin: 5px;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background: #45a049;
}

button:nth-child(2) {
  background: #f44336;
}

button:nth-child(2):hover {
  background: #d32f2f;
}
</style>