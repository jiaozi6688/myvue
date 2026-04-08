<template>
    <div :class="['popup', currentType]" v-if="isVisible">{{ message }}</div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'

// 弹窗组件 showPopup控制弹窗的显示与隐藏
const props = defineProps({
    showPopup: {
        type: Boolean,
        default: false
    },
    popupMessage: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'success',
    },
})

// 定义emit事件，用于通知父组件
const emit = defineEmits(['close'])

// 内部可见性状态，用于非受控模式
const isVisible = ref(props.showPopup)
const message = ref(props.popupMessage)
const currentType = ref(props.type)

// 监听props变化
watch(() => props.showPopup, (newValue) => {
    isVisible.value = newValue
})

watch(() => props.popupMessage, (newValue) => {
    message.value = newValue
})

watch(() => props.type, (newValue) => {
    currentType.value = newValue
})

// 监听可见性变化
watch(isVisible, (newValue) => {
    if (newValue) {
        // 当弹窗显示时，3秒后自动关闭并通知父组件
        setTimeout(() => {
            close()
        }, 3000)
    }
})

// 显示弹窗的方法（非受控模式）
const show = (msg: string, options?: { duration?: number, type?: string }) => {
    message.value = msg
    currentType.value = options?.type || 'success'
    isVisible.value = true
    
    if (options?.duration) {
        setTimeout(() => {
            close()
        }, options.duration)
    }
}

// 关闭弹窗的方法
const close = () => {
    isVisible.value = false
    emit('close')
}

// 暴露方法给父组件
defineExpose({
    show,
    close
})

</script>
<style scoped>
.popup {
    color: white;
    width: auto;
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: fixed;
    top: 30px;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 15px;
    z-index: 9999;
    font-weight: 500;
    font-size: 14px;
    /* 优化动画曲线 - 更加丝滑的弹跳效果 */
    animation: popupFadeIn 2.5s cubic-bezier(0.68, -0.8, 0.32, 1.8) forwards;
}

/* 成功状态样式 */
.success {
    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
    box-shadow: 0 5px 20px rgba(76, 175, 80, 0.4);
}

.success::before {
    content: '√';
}

/* 失败状态样式 */
.error {
    background: linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%);
    color: white;
    box-shadow: 0 8px 24px rgba(255, 120, 117, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.error::before {
    content: '×';
}



@keyframes popupFadeIn {
    0% {
        top: -4%;
        opacity: 0;
    }

    50% {
        top: 5%;
        opacity: 1;
    }

    100% {
        top: 5%;
        /* opacity是最终状态的透明度 */
        opacity: 1;

    }
}
</style>