<template>
    <!-- 弹窗设置 -->
    <tanchuang :showPopup="showPopup" :popupMessage="popupMessage" :type="popupType"></tanchuang>
    <div class="register-container">
        <div class="register-form">
            <h1>用户注册</h1>
            <form id="registerForm" autocomplete="off">
                <div>
                    <!-- 手机号 验证手机号格式是否正确 -->
                    <label for="phone">手机号:</label>
                    <!-- required 是 HTML 表单属性，用于指定输入字段必须填写 鼠标取消聚焦时 -->
                    <input type="text" id="phone" name="phone" @blur="validatePhone(phone)" v-model="phone" required>
                </div>
                <div>
                    <label for="username" @blur="validateUsername(username)">用户名：</label>
                    <!-- required 是 HTML 表单属性，用于指定输入字段必须填写 -->
                    <input type="text" id="username" name="username" v-model="username" required>
                </div>
                <div>
                    <label for="password">密码：</label>
                    <input type="password" id="password" name="password" v-model="password" required>
                </div>
                <div>
                    <label for="confirmPassword">确认密码：</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" v-model="confirmPassword"
                        required @blur="register(confirmPassword)">
                </div>
                <div>
                    <!-- 角色选择 -->
                    <label for="role">角色：</label>
                    <select id="role" name="role" v-model="role">
                        <option value="user">普通用户</option>
                        <option value="admin">管理员</option>
                    </select>
                </div>
                <div>
                    <!-- 阻止表单默认提交行为 -->
                    <input value="注册" @submit.prevent="addregister" @click="addregister">
                </div>
            </form>
        </div>
    </div>
</template>
<script setup lang="ts">

import router from '@/router'
import axios from 'axios'
import { ref } from 'vue'
import Tanchuang from '@/components/modal/tanchuang.vue'

const phone = ref('')    // 手机号
const role = ref('user') // 角色默认值为普通用户
const showPopup = ref(false) // 弹窗默认值为关闭
const popupMessage = ref('') // 弹窗提示信息默认值为空
const popupType = ref('success') // 弹窗类型默认值为成功
// 创建对tanchuang组件的引用

const username = ref('')
const password = ref('')
const confirmPassword = ref('')// 确认密码
const messagetrue = ref(false) // 注册成功默认值为空
// 手机号验证函数
function validatePhone(phone: string) {
    // 手机号正则表达式
    const phoneRegex = /^1[3456789]\d{9}$/;
    if (phone === '') {
        showPopupMessage('请输入手机号', 'error');
        return messagetrue.value = false
    }
    if (!phoneRegex.test(phone)) {
        showPopupMessage('手机号格式错误', 'error');
        return messagetrue.value = false
    }
    return messagetrue.value = true
}
// 用户名验证函数
function validateUsername(username: string) {
    // 用户名正则表达式，符合4-16位数字、字母、下划线
    const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/;
    if (username === '') {
        showPopupMessage('请输入用户名', 'error');
        return messagetrue.value = false
    }
    if (!usernameRegex.test(username)) {
        showPopupMessage('用户名格式错误', 'error');
        return messagetrue.value = false
    }
    return messagetrue.value = true
}
// 判断密码是否一致
function register(confirmPassword: string) {
    // 三元运算符，判断密码是否一致，不一致返回false，一致返回true
    const isPasswordSame = password.value !== confirmPassword ? false : true;
    if (!isPasswordSame) {
        showPopupMessage('两次输入的密码不一致', 'error');
        return messagetrue.value = false
    }
    return messagetrue.value = true
}

// 注册函数
function addregister() {
    if (messagetrue.value !== true) {
        return showPopupMessage('注册失败，请检查输入信息', 'error');
    }
    // 判断密码是否一致
    axios.post('http://127.0.0.1:3000/users/register', {
        username: username.value,
        password: password.value,
        role: role.value,
        phone: phone.value
    }).then(res => {
        console.log(res.data.code);

        if (res.data.code === 200) {
            // 注册成功，弹窗提示
            showPopupMessage('注册成功', 'success');
            // 延迟跳转，确保弹窗提示显示出来
            setTimeout(() => {
                router.push('/login')
            }, 2000);
            return true;
        }
    }).catch(err => {
        // 注册失败，弹窗提示
        return showPopupMessage(err.response.data.message, 'error');
    })
}
// 弹窗动画js设置
function showPopupMessage(message: string, type: string) {
    popupMessage.value = message;
    showPopup.value = true;
    // 弹窗动画效果 3秒后消失
    popupType.value = type;
}
</script>
<style scoped>
.register-container {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    .register-form {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 350px;
        height: 400px;
        padding: 40px 30px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.49);
    }

    h1 {
        text-align: center;
        color: #333;
        font-size: 24px;
        font-weight: 400;
        margin-bottom: 30px;
    }

    #registerForm {
        height: 300px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;

        div:not(:last-child) {
            width: 300px;
            display: flex;
            flex-direction: row;
            margin-bottom: 15px;

            label {
                width: 100px;
                height: 30px;
                line-height: 40px;
            }

            input {
                width: 200px;
                height: 30px;
                padding: 5px;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
        }

        div:last-child {
            display: flex;
            flex-direction: row;
            justify-content: center;

            input {
                width: 120px;
                height: 45px;
                background: linear-gradient(45deg, #3498db, #2980b9);
                text-align: center;
                margin-top: 20px;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                letter-spacing: 1px;
            }

            input:hover {
                background: linear-gradient(45deg, #2980b9, #2471a3);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
            }
        }
    }
}
</style>
