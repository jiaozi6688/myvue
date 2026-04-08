import { createVNode, render, nextTick } from 'vue'
import Message from './message.vue'

// 👇 重点：定义 TS 类型，告诉 TS 有这些方法
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
// 消息实例
let instance: any = null
// 定时器
let timer: any = null
// 消息容器
let container: HTMLElement | null = null

// 👇 创建函数 + 断言类型
// options 是消息配置对象或字符串 里面有 text 和 type 属性
const message = function (options: MessageOptions | string) {
    console.log(options)
    // options 输出的结果是 success '这是success'
    if (typeof options === 'string') {
        options = { text: options }
    }
    // 如果实例存在，先销毁实例
    if (instance) {
        // 先销毁实例实例
        destroyMessage()
    }

    container = document.createElement('div')
    document.body.appendChild(container)
    // 创建消息实例
    // createVNode(组件, props, children)
    // message 传递 props 给 Message 组件实例
    instance = createVNode(Message, {
        text: options.text,
        type: options.type || 'info',
    })
    // 沉染消息实例到容器中  并将实例挂载到 container 元素上
    render(instance, container)
    clearTimeout(timer)
    timer = setTimeout(() => {
        destroyMessage()
    }, 2000)
} as MessageFunction // 👈 关键：告诉 TS 这是带方法的函数

// 销毁消息实例
function destroyMessage() {
    // 如果实例或容器不存在，直接返回
    if (!instance || !container) return
    // 触发离开动画
    // 调用组件暴露的 hide 方法，触发离开动画
    // console.log(instance.component);
    // 等待动画完成后再删除容器
    render(null, container!)

    setTimeout(() => {

        // 如果容器存在父元素，才删除容器
        if (container && container.parentNode) {
            document.body.removeChild(container)
        }
        instance = null
        container = null
    }, 300) // 与动画时长一致 0.3s

}
// as const 是类型断言，告诉 TS 数组是只读的，不能被修改
// 挂载四个方法
; (['success', 'warning', 'error', 'info'] as const).forEach((type) => {
    message[type] = (text: string) => {
        message({ text, type })
    }
})

export default message