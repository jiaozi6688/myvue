<template>
    <Transition name="message" @after-leave="props.onClose?.()" appear>
        <div class="message" :class="`message--${type}`" v-if="isShow">
            {{ text }}
        </div>
    </Transition>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
    text: String,
    type: {
        type: String,
        default: 'info',
        validator: (v) => ['success', 'warning', 'error', 'info'].includes(v as string)
    },
    onClose: Function
})

const isShow = ref(true)

// 3秒后关闭，触发动画
setTimeout(() => {
    isShow.value = false
}, 3000)
</script>

<style lang="scss" scoped>
/* 进入：从上往下滑 */
.message-enter-from {
    opacity: 0 !important;
    transform: translateY(-70%) !important;
}

.message-enter-active {
    transition: all 0.3s ease !important;
}

/* 离开：往上消失 */
.message-leave-active {
    transition: all 0.3s ease !important;
    position: fixed !important;
}

.message-leave-to {
    opacity: 0 !important;
    transform: translateY(-70%) !important;
}

/* 基础样式 */
.message {
    z-index: 9999;
    position: fixed;
    top: 20px;
    left: 50%;
    padding: 12px 20px;
    border-radius: 15px;
    font-family: 'Microsoft Yahei', sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: #ffffff;
}

.message--info {
    background: #f0f9ff;
    border-color: #72c1ff;
    color: #1890ff;
}

.message--success {
    background: #f6ffed;
    border-color: #b7eb8f;
    color: #52c41a;

    &::before {
        content: ' ✓ ';
        font-weight: bold;
        margin-right: 8px;
    }
}
// 警告
.message--warning {
    background: #fffbe6;
    border-color: #ffe58f;
    color: #faad14;
    &::before {
        content: ' ! ';
        font-weight: bold;
        margin-right: 8px;
    }
}

.message--error {
    background: #fff2f0;
    border-color: #ffccc7;
    color: #ff4d4f;
    &::before {
        content: ' × ';
        font-weight: bold;
        margin-right: 8px;
    }
}
</style>