<template>
    <div class="chat-container">
        <div class="ai" @click="showChat = !showChat">
            <p>AI 聊天</p>
        </div>
        <div class="chat" v-show="showChat">
            <div class="chat-header">AI 聊天助手</div>
            <!-- 新增ref，用于自动滚动 -->
            <div class="chat-body" ref="chatBodyRef">
                <template v-for="(msg, index) in messages" :key="index">
                    <div class="message" :class="msg.isAI ? 'ai-message' : 'user-message'">
                        <p>{{ msg.content }}</p>
                    </div>
                    <span class="read-status" :class="msg.isAI ? 'ai-read' : 'user-read'">
                        {{ msg.read ? "已读" : "" }}
                    </span>
                </template>
            </div>
            <div class="chat-footer">
                <input v-model="inputMessage" class="chat-input" placeholder="输入你的问题..." @keyup.enter="sendMessage" />
                <button class="chat-button" @click="sendMessage">发送</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";

const showChat = ref(false);
interface Message {
    content: string;
    isAI: boolean;
    read: boolean;
}

const messages = ref<Message[]>([]);
// 输入框内容
const inputMessage = ref("");
// 是否正在输入
const isTyping = ref(false);
// 当前AI回复
const currentAiResponse = ref("");
let eventSource: EventSource | null = null;
// 滚动容器ref
const chatBodyRef = ref<HTMLDivElement | null>(null);

// 自动滚动到最新消息
const scrollToBottom = async () => {
    await nextTick();
    if (chatBodyRef.value) {
        chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight;
    }
};

// 初始化欢迎消息
const initChat = () => {
    messages.value = [
        {
            content: "你好！我是你的AI聊天助手，有什么可以帮助你的吗？",
            isAI: true,
            read: false,
        },
    ];
    scrollToBottom();
};

// 发送消息（流式核心）
const sendMessage = () => {
    // 强制关闭上一次的SSE连接，绝对不堆积
    if (eventSource) eventSource.close();
    // 空值校验
    if (!inputMessage.value.trim()) return;
    const userMsg = inputMessage.value;
    inputMessage.value = "";
    // 清空历史回复
    currentAiResponse.value = "";
    // 1. 添加用户消息
    messages.value.push({
        content: userMsg,
        isAI: false,
        read: false,
    });
    // 2. 预先添加一个空的AI消息占位
    messages.value.push({
        content: "",
        isAI: true,
        read: false,
    });
    // 发送消息后立即滚动
    scrollToBottom();

    // 3. 创建SSE连接
    const url = `http://localhost:3000/chat?message=${encodeURIComponent(userMsg)}`;
    eventSource = new EventSource(url);

    // 监听流式消息
    eventSource.onmessage = (e) => {
        const data = e.data;
        if (data === "[DONE]") {
            // 如果是[DONE]，关闭连接
            if (eventSource) eventSource.close();
            // 标记已读
            const len = messages.value.length;
            // 如果有2条以上消息，且最后2条消息分别是用户消息和AI消息占位
            if (len >= 2) {
                const lastMsg = messages.value[len - 1];
                const secondLastMsg = messages.value[len - 2];
                if (lastMsg) lastMsg.read = true;
                if (secondLastMsg) secondLastMsg.read = true;
            }
            scrollToBottom();
            return;
        }
        try {
            // 解析JSON数据
            const { content } = JSON.parse(data);
            if (content) {
                // 记录当前AI回复内容
                currentAiResponse.value += content;
                // 获取到最新的AI消息占位消息
                const lastMsg = messages.value[messages.value.length - 1];
                // 如果存在占位消息，更新内容为当前AI回复内容
                if (lastMsg) {
                    lastMsg.content = currentAiResponse.value;
                    scrollToBottom();
                }
            }
        } catch (err) { }
    };

    // 错误处理
    eventSource.onerror = (err) => {
        if (eventSource) eventSource.close();
        const lastMsg = messages.value[messages.value.length - 1];
        if (lastMsg) lastMsg.content = "AI回复失败";
    };
};

// 初始化
initChat();
</script>
<style scoped lang="scss">
// 你的所有样式代码 完全保留，一行没改！
.ai {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
    line-height: 1.2;
    padding: 10px;
    box-sizing: border-box;
    border: 2px solid rgba(255, 255, 255, 0.3);

    &:hover {
        transform: scale(1.1) translateY(-2px);
        box-shadow: 0 8px 16px rgba(76, 175, 80, 0.4);
        border-color: rgba(255, 255, 255, 0.6);
    }

    &:active {
        transform: scale(0.95);
    }

    p {
        margin: 0;
    }
}

.chat {
    position: fixed;
    bottom: 90px;
    right: 2rem;
    width: 380px;
    max-width: 90vw;
    height: 500px;
    max-height: 80vh;
    border-radius: 16px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    background: white;
    z-index: 999;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideUp 0.3s ease-out;

    &::before {
        content: '';
        position: absolute;
        bottom: -10px;
        right: 24px;
        width: 20px;
        height: 20px;
        background: white;
        transform: rotate(45deg);
        border-bottom: 1px solid #e0e0e0;
        border-right: 1px solid #e0e0e0;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.chat-header {
    padding: 16px 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    font-weight: 600;
    font-size: 16px;
    color: #343a40;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    &::after {
        content: '💬';
        font-size: 18px;
        margin-left: 8px;
    }
}

.chat-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 20px 20px 0px 20px;
    overflow-y: auto;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    gap: 12px;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }

    .message {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 20px;
        word-wrap: break-word;
        animation: messageAppear 0.3s ease-out;

        &.ai-message {
            background: #e8f5e8;
            color: #2d3748;
            border-bottom-left-radius: 6px;
            align-self: flex-start;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        &.user-message {
            background: #4CAF50;
            color: white;
            border-bottom-right-radius: 6px;
            align-self: flex-end;
            box-shadow: 0 1px 2px rgba(76, 175, 80, 0.2);
        }

        p {
            margin: 0;
            font-size: 14px;
            line-height: 1.4;
        }
    }

    .read-status {
        width: fit-content;
        display: inline-block;
        font-size: 12px;
        color: #999;

        &.ai-read {
            align-self: flex-start;
        }

        &.user-read {
            align-self: flex-end;
        }
    }
}

@keyframes messageAppear {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.chat-footer {
    padding: 12px 20px;
    border-top: 1px solid #e9ecef;
    background: white;
    display: flex;
    gap: 10px;
    align-items: center;
    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
}

.chat-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #ced4da;
    border-radius: 24px;
    outline: none;
    font-size: 14px;
    transition: all 0.3s ease;
    background: #f8f9fa;

    &:focus {
        border-color: #4CAF50;
        box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        background: white;
    }
}

.chat-button {
    padding: 12px 24px;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    border: none;
    border-radius: 24px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);

    &:hover {
        background: linear-gradient(135deg, #45a049, #3d8b40);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
    }

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
        box-shadow: none;
    }
}

@media (max-width: 768px) {
    .ai {
        bottom: 1rem;
        right: 1rem;
        width: 55px;
        height: 55px;
        font-size: 12px;
    }

    .chat {
        bottom: 75px;
        right: 1rem;
        left: 1rem;
        width: auto;
        height: 70vh;
        max-width: none;
    }

    .chat-header {
        padding: 14px 16px;
        font-size: 15px;
    }

    .chat-body {
        padding: 16px;
    }

    .chat-footer {
        padding: 10px 16px;
    }

    .chat-input {
        padding: 10px 14px;
    }

    .chat-button {
        padding: 10px 20px;
    }
}

@media (prefers-color-scheme: dark) {
    .chat {
        background: #1f2937;
        border-color: #374151;
    }

    .chat::before {
        background: #1f2937;
        border-color: #374151;
    }

    .chat-header {
        background: #111827;
        border-color: #374151;
        color: #f3f4f6;
    }

    .chat-body {
        background: #1f2937;
    }

    .message.ai-message {
        background: #374151;
        color: #e5e7eb;
    }

    .chat-footer {
        background: #111827;
        border-color: #374151;
    }

    .chat-input {
        background: #374151;
        border-color: #4b5563;
        color: #e5e7eb;

        &::placeholder {
            color: #9ca3af;
        }
    }
}
</style>