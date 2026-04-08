import { createVNode, render } from 'vue'
import Message from '@/components/modal/message.vue'

//消息实例
let instance: any
// 消息容器
let container: any
type MessageType = 'success' | 'warning' | 'error' | 'info'
interface MessageOptions {
    text: string
    type?: MessageType
}

// 👇 定义函数 + 挂载的方法类型
interface MessageFunction {
    (options: MessageOptions | string): void
    success: (text: string) => void
    warning: (text: string) => void
    error: (text: string) => void
    info: (text: string) => void
}
const message = function (options: MessageOptions) {

    if (typeof options === 'string') {
        options = { text: options }
    }
    // 如果实例存在，先销毁实例
    if (instance) {
    }
    // 创建消息实例
    container = document.createElement('div')
    document.body.appendChild(container)
    // 创建消息实例
    instance = createVNode(Message, {
        text: options.text,
        type: options.type || 'info',
        onClose: () => {
            render(null, document.body)
            document.body.removeChild(container)
            instance = null
        }
    })
    render(instance, container)
} as MessageFunction

    ; (['success', 'warning', 'error', 'info'] as const).forEach((type) => {
        message[type] = (text: string) => {
            message({ text, type })
        }
    })
// message.success = (text) => message({ text, type: 'success' })
// message.warning = (text) => message({ text, type: 'warning' })
// message.error = (text) => message({ text, type: 'error' })
// message.info = (text) => message({ text, type: 'info' })
export default message