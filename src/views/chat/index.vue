<template>
    <div class="chat-container">
        <!-- 页面头部 -->
        <header class="chat-header">
            <h1>在线客服</h1>
            <span class="online-status">● 在线</span>
        </header>

        <!-- 主要内容区域 -->
        <main class="chat-main">
            <!-- 对话列表 -->
            <div class="chat-messages" ref="messagesContainer">
                <!-- 系统欢迎消息 -->
                <div class="message system-message">
                    <div class="message-content">
                        <span>欢迎咨询！我是您的专属客服，有什么可以帮您的吗？</span>
                    </div>
                </div>

                <!-- 消息列表 - 按时间顺序排列 -->
                <template v-for="(message, index) in sortedMessages" :key="message.id || index">
                    <div :class="['message', message.type]">
                        <!-- 头像 -->
                        <div class="message-avatar">
                            <img :src="message.type === 'user-message' ? userAvatar : supportAvatar"
                                :alt="message.type === 'user-message' ? '用户头像' : '客服头像'" />
                        </div>
                        <!-- 消息内容 -->
                        <div class="message-body">
                            <div class="message-sender">{{ message.senderName }}</div>
                            <div :class="['message-content', message.type]">
                                <span>{{ message.content }}</span>
                            </div>
                            <div class="message-meta">
                                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                                <span v-if="message.type === 'user-message' && message.status" class="message-status">
                                    {{ message.status === 'sending' ? '发送中...' : '已送达' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <!-- 输入区域 -->
            <div class="chat-input-area">
                <div class="input-wrapper">
                    <textarea v-model="inputMessage" class="chat-input" placeholder="请输入消息..." rows="1"
                        @keydown.enter.exact.prevent="sendMessage"></textarea>
                    <span class="char-count" :class="{ 'char-limit': inputMessage.length > 350 }">
                        {{ inputMessage.length }}/400
                    </span>
                </div>
                <button class="send-button" @click="sendMessage" :disabled="!inputMessage.trim()">
                    发送
                </button>
            </div>
        </main>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { useLoginStore } from '@/pinia/loginstor';

// 消息类型定义
interface Message {
    id: string;
    content: string;
    type: 'user-message' | 'support-message';
    senderName: string;
    senderId: string;
    timestamp: number;
    status?: 'sending' | 'sent' | 'failed';
}

// 获取用户信息
const loginStore = useLoginStore();
const userId = computed(() => loginStore.userInfo?.userInfo?.userId || 'user');
const userName = computed(() => loginStore.userInfo?.userInfo?.username || '我');

// 头像配置
const userAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
const supportAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';

// 状态
const inputMessage = ref('');
// 消息列表
const messages = ref<Message[]>([]);
// 消息容器
const messagesContainer = ref<HTMLDivElement>();
let messageIdCounter = 0;

// WebSocket 连接
const ws = new WebSocket('ws://127.0.0.1:1234');

// 按时间排序的消息列表
// .sort() 方法会直接修改原数组，所以需要深拷贝
const sortedMessages = computed(() => {
    return [...messages.value].sort((a, b) => a.timestamp - b.timestamp);
});

// 格式化时间
const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

// 生成唯一消息ID
const generateMessageId = () => {
    return `msg_${Date.now()}_${++messageIdCounter}`;
};

// 滚动到底部
const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};

// 监听消息变化，自动滚动
watch(messages, () => {
    scrollToBottom();
}, { deep: true });

// 监听输入变化
watch(inputMessage, () => {
    if (inputMessage.value.length > 400) {
        inputMessage.value = inputMessage.value.substring(0, 400);
        alert('消息长度不能超过400个字符');
    }

    nextTick(() => {
        const textarea = document.querySelector('.chat-input') as HTMLTextAreaElement;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }
    });
});

// 添加消息到列表
const addMessage = (message: Omit<Message, 'id'>) => {
    const newMessage: Message = {
        ...message,
        id: generateMessageId()
    };
    messages.value.push(newMessage);
    return newMessage;
};

// 更新消息状态
const updateMessageStatus = (id: string, status: Message['status']) => {
    const message = messages.value.find(m => m.id === id);
    if (message) {
        message.status = status;
    }
};

// 发送消息
const sendMessage = () => {
    const content = inputMessage.value.trim();

    if (!content) {
        alert('请输入消息');
        return;
    }

    if (content.length > 400) {
        alert('消息长度不能超过400个字符');
        return;
    }

    const timestamp = Date.now();

    // 创建消息对象
    const messageData = {
        content,
        type: 'user-message' as const,
        senderName: userName.value,
        senderId: userId.value,
        timestamp,
        status: 'sending' as const
    };

    // 添加到消息列表
    const message = addMessage(messageData);

    // 发送消息到服务器
    const data = {
        id: message.id,
        content,
        senderName: userName.value,
        senderId: userId.value,
        timestamp
    };

    try {
        ws.send(JSON.stringify(data));
        updateMessageStatus(message.id, 'sent');
    } catch (error) {
        console.error('发送消息失败:', error);
        updateMessageStatus(message.id, 'failed');
        alert('发送消息失败，请重试');
    }

    // 清空输入
    inputMessage.value = '';

    // 重置textarea高度
    nextTick(() => {
        const textarea = document.querySelector('.chat-input') as HTMLTextAreaElement;
        if (textarea) {
            textarea.style.height = 'auto';
        }
    });
};

// 收到消息
ws.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);

        // 处理数组或单个消息
        const messageArray = Array.isArray(data) ? data : [data];

        messageArray.forEach((item: any) => {
            // 只处理非当前用户的消息
            if (item.senderId !== userId.value && item.name !== userId.value) {
                addMessage({
                    content: item.content || item.message,
                    type: 'support-message',
                    senderName: item.senderName || '客服',
                    senderId: item.senderId || item.name,
                    timestamp: item.timestamp || Date.now()
                });
            }
        });
    } catch (error) {
        console.error('解析消息失败:', error);
    }
};

// WebSocket 连接状态处理
ws.onopen = () => {
    console.log('连接客服成功');
};

ws.onerror = (error) => {
    console.error('WebSocket 错误:', error);
};

ws.onclose = () => {
    console.log('WebSocket 连接关闭');
};

onMounted(() => {
    scrollToBottom();
});
</script>

<style scoped>
.chat-container {
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

/* 头部样式 */
.chat-header {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    padding: 15px 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-header h1 {
    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}

.online-status {
    color: #10b981;
    font-size: 14px;
    font-weight: 500;
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
    background: rgba(255, 255, 255, 0.7);
    border-radius: 16px;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(10px);
    max-height: calc(100vh - 200px);
}

/* 消息样式 */
.message {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    animation: messageSlide 0.3s ease-out;
}

@keyframes messageSlide {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 系统消息样式 */
.message.system-message {
    justify-content: center;
    align-items: center;
}

.message.system-message .message-content {
    background: rgba(0, 0, 0, 0.05);
    color: #6c757d;
    border-radius: 16px;
    padding: 8px 16px;
    font-size: 14px;
    max-width: 70%;
    text-align: center;
}

/* 客服消息样式 - 左侧对齐 */
.message.support-message {
    flex-direction: row;
    align-self: flex-start;
}

/* 用户消息样式 - 右侧对齐 */
.message.user-message {
    flex-direction: row-reverse;
    align-self: flex-end;
}

.message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 消息体样式 */
.message-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 60%;
}

.message-sender {
    font-size: 12px;
    color: #6c757d;
    margin-bottom: 2px;
}

/* 用户消息发送者右对齐 */
.message.user-message .message-sender {
    text-align: right;
}

/* 客服消息发送者左对齐 */
.message.support-message .message-sender {
    text-align: left;
}

/* 消息内容样式 */
.message-content {
    padding: 12px 16px;
    border-radius: 18px;
    font-size: 14px;
    word-wrap: break-word;
    line-height: 1.5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 客服消息气泡样式 */
.message-content.support-message {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    color: #1e40af;
    border-bottom-left-radius: 6px;
}

/* 用户消息气泡样式 */
.message-content.user-message {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border-bottom-right-radius: 6px;
}

/* 消息元信息样式 */
.message-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: #9ca3af;
}

/* 用户消息元信息右对齐 */
.message.user-message .message-meta {
    justify-content: flex-end;
}

/* 客服消息元信息左对齐 */
.message.support-message .message-meta {
    justify-content: flex-start;
}

.message-time {
    font-weight: 500;
}

.message-status {
    font-style: italic;
}

/* 输入区域样式 */
.chat-input-area {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    background: rgba(255, 255, 255, 0.8);
    padding: 15px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(10px);
}

.input-wrapper {
    flex: 1;
    position: relative;
}

/* 输入框样式 */
.chat-input {
    width: 92%;
    min-height: 44px;
    max-height: 120px;
    padding: 12px 50px 12px 16px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    background: white;
    resize: none;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    overflow-y: auto;
    transition: all 0.3s ease;

}

/* 输入框聚焦样式 */
.chat-input:focus {

    outline: none;
    border-color: #515357;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.char-count {
    position: absolute;
    bottom: 8px;
    right: 12px;
    font-size: 11px;
    color: #9ca3af;
    background: rgba(255, 255, 255, 0.9);
    padding: 2px 6px;
    border-radius: 4px;
}

.char-count.char-limit {

    color: #ef4444;
    font-weight: 600;
}

.send-button {
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.send-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.send-button:active:not(:disabled) {
    transform: translateY(0);
}

.send-button:disabled {
    background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%);
    cursor: not-allowed;
    box-shadow: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .chat-main {
        padding: 10px;
    }

    .chat-messages {
        padding: 15px;
    }

    .message-body {
        max-width: 75%;
    }

    .chat-input-area {
        padding: 10px;
    }

    .send-button {
        padding: 10px 18px;
    }
}
</style>
