<template>
    <div class="chat-container">
        <!-- 页面头部 -->
        <header class="chat-header">
            <h1>在线客服</h1>
        </header>

        <!-- 主要内容区域 -->
        <main class="chat-main">
            <!-- 对话列表 -->
            <div class="chat-messages" ref="messagesContainer">
                <!-- 系统消息 -->
                <div class="message system-message">
                    <div class="message-content">
                        <span>欢迎咨询！我是您的专属客服，有什么可以帮您的吗？</span>
                    </div>
                </div>
                <!-- 客服消息 -->
                <!-- support-message是客服消息的类名  -->
                <template v-for="(message, index)
                    in Messages" :key="index">
                    <div :class="`message ${message.style}`">
                        <!-- <div :class="`message support-message`"> -->
                        <!-- 客服和用户消息的头像 -->
                        <div class="message-avatar">
                            <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="客服头像" />
                        </div>
                        <!-- 客服和用户消息的内容 -->
                        <div class="message-body">
                            <div :class="`message-content ${message.order}`">
                                <!-- <div :class="`message-content support-message`"> -->
                                <span>{{ message.message }}</span>
                            </div>
                            <div class="message-time">{{ new Date().getHours() }}:{{ new Date().getMinutes() }}</div>
                        </div>
                    </div>
                </template>
            </div>
            <!-- 输入区域 -->
            <!-- @keydown.enter.exact="sendmessage" 
               exact 表示必须按下 enter 键才能触发事件
               .shift 表示按下 shift 键同时按下 enter 键才能触发事件 -->
            <div class="chat-input-area">
                <textarea v-model="inputMessage" class="chat-input" placeholder="请输入消息" rows="1"
                    @keydown.enter.exact="sendmessage"></textarea>
                <button class="send-button" @click="sendmessage">发送</button>
            </div>
        </main>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useLoginStore } from '@/pinia/loginstor';
// 获取用户ID
const loginStore = useLoginStore();
const userId = loginStore.userInfo?.userInfo?.userId;

// 用户输入的消息
const inputMessage = ref('');
// 存储用户消息
const Messages = ref<any>([]);
// 储存客服或者其他用户的消息
// WebSocket 连接
const ws = new WebSocket('ws://127.0.0.1:1234');
watch(inputMessage, () => {
    if (inputMessage.value.length == 100) {
        // 添加换行符
        inputMessage.value += '\n';
        console.log(inputMessage.value);
    }
    // 限制消息长度不超过400个字符
    if (inputMessage.value.length > 400) {
        // inputMessage.value.substring(0, 400); 
        // 是一个 JavaScript 字符串方法，用于截取字符串的一部分。
        inputMessage.value =
            inputMessage.value.substring(0, 400);
        alert('消息长度不能超过400个字符');
    }
    // 自动调整textarea高度
    // nextTick 是 Vue 提供的一个异步方法，用于在 DOM 更新后执行回调函数
    // 这里的作用是确保 textarea 的高度更新后再计算滚动高度
    nextTick(() => {
        const textarea = document.querySelector('.chat-input') as HTMLTextAreaElement;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }
    });
});

// 发送消息
const sendmessage = () => {
    // 检查消息长度
    if (inputMessage.value.length > 400) {
        alert('消息长度不能超过400个字符');
        return;
    }
    if (inputMessage.value.length == 0) {
        alert('请输入消息');
        return;
    }
    // 把用户消息添加到Messages数组中
    Messages.value.push({
        message: inputMessage.value,
        name: userId,
        style: 'user-message',
        order: 'user-message'
    })

    const data = {
        name: userId,
        message: inputMessage.value
    }
    ws.send(JSON.stringify(data))
    inputMessage.value = ''
    // console.log('发送消息:', data)
}

// 收到消息
ws.onmessage = (event) => {
    try {
        let data = JSON.parse(event.data);
        // console.log('收到消息:', data);
        if (!Array.isArray(data)) {
            // 转换为数组
            data = [data];
            // console.log('转换后的数组:', data);
            data.forEach((item: any) => {
                // 筛选出客服的消息
                if (item.name !== userId) {
                    Messages.value.push({
                        message: item.message,
                        name: item.name,
                        style: 'support-message',
                        order: 'support-message'
                    });
                    // console.log('添加到Messages:', Messages.value);
                } else {
                    // console.log('跳过自己的消息:', item.message);
                }
            })
        }

    } catch (error) {
        console.error('解析消息失败:', error);
        return;
    }

}
onMounted(() => {
    ws.onopen = function () {
        console.log('链接客服成功')
    }
})

</script>

<style scoped>
.chat-container {
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
}

/* 头部样式 */
.chat-header {
    background: white;
    border-bottom: 1px solid #e9ecef;
    padding: 15px 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chat-header h1 {
    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}

/* 主要内容样式 */
.chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 20px;
}

/* 消息列表样式 */
.chat-messages {
    flex: 1;
    background: white;
    border-radius: 12px;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: #b12828;
}

/* 消息样式 */
.message {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background-color: #2c3e50;
}

.message.system-message {
    justify-content: center;
    align-items: center;
}

.message.system-message .message-content {
    background: #e9ecef;
    color: #6c757d;
    border-radius: 16px;
    padding: 8px 16px;
    font-size: 14px;
    max-width: 70%;
    text-align: center;
}

/* 客服消息样式 */
.message.support-message {
    flex-direction: row;
}

/* 用户消息样式 */
.message.user-message {
    /* background-color: #c1c1c1; */
    /* 反转消息方向，用户消息从右到左 */
    flex-direction: row-reverse;
}

.message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
}

.message-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 客服和用户消息的内容 */
.message-body {
    display: flex;
    align-items: end;
    gap: 4px;
    max-width: 50%;
    background-color: #f0f9ff;
}

/* 消息内容样式 */
/* order: 1  时间在消息前面 
    0 是在消息后面
*/
.message-content {
    padding: 10px 16px;
    border-radius: 18px;
    font-size: 14px;
    max-width: 100%;
    word-wrap: break-word;
}

.user-message {
    order: 1;
}

.support-message {
    order: 0;
}



/* 消息时间样式 */
.message-time {
    font-size: 12px;
    color: #6c757d;
    margin-right: 8px;
    margin-top: 4px;
    justify-content: flex-end;
}

/* 客服消息样式 */
.support-message .message-content {
    background: #f0f9ff;
    color: #2c3e50;
    border-bottom-left-radius: 8px;
}

/* 用户消息样式 */
.user-message .message-content {
    background: rgb(16, 202, 16);
    color: black;
    border-bottom-right-radius: 8px;
}



.chat-input-area {
    display: flex;
    align-items: center;
    justify-content: center;

    textarea {
        padding: 5px 10px;
        width: 90%;
        height: auto;
        min-height: 40px;
        border: none;
        border-radius: 8px;
        background: white;
        border: 1px solid #4a90e2;
        /* 防止用户调整大小 */
        resize: none;
        font-size: 14px;
        /* 文字溢出自动换行 */
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
        line-height: 1.4;
        /* 允许垂直滚动 */
        overflow-y: auto;
        /* 去除默认边距 */
    }

    button {
        padding: 5px 10px;
        border: none;
        border-radius: 8px;
        background: #4a90e2;
        color: white;
        font-size: 14px;
        cursor: pointer;
    }
}
</style>