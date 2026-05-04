<template>
    <div class="login-root">
        <div class="login-wrapper">
            <div class="login-container">
                <div class="login-containerimage">
                </div>
                <div class="login-containerform">
                    <h2>用户登录</h2>
                    <form>
                        <div>
                            <!-- 鼠标离开时校验用户名或手机号 如果usernameOrPhone为true时 -->
                            <input @blur="validateUsernameOrPhone" placeholder="请输入用户名/手机号" type="text"
                                :id="usernameOrPhone ? 'phone' : 'username'" :name="usernameOrPhone ? 'phone' : 'username'
                                    " v-model="usernameOrPhoneMsg" required>
                        </div>
                        <div>
                            <input placeholder="请输入密码" type="password" id="password" name="password" v-model="password"
                                required>
                            <div>
                                <div>
                                    <span><input type="checkbox">记住密码</span>
                                    <a href="/resetpassword">重置密码</a>
                                </div>
                                <p>还没有账号？<a href="/register">去注册</a></p>
                            </div>

                        </div>
                        <!--@submit.prevent="login" 提交表单时阻止默认行为，避免页面刷新, 调用登录函数 -->
                        <div class="loginbt" @click="login">
                            <input value="登录">
                        </div>
                    </form>
                    <!-- 用户协议 -->
                    <div class="user-agreement">
                        <input type="checkbox" id="userAgreement" name="userAgreement" required
                            @change="userAgreement = !userAgreement">
                        <p>已阅读并同意<span><a href="/privacypolicy">《隐私政策》</a>和<a href="/useragreement">《用户协议》</a></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 弹窗设置 -->
        <tanchuang :showPopup="showPopup" :popupMessage="popupMessage" :type="types" @close="showPopup = false">
        </tanchuang>
    </div>
</template>
<script setup lang="ts">
// 引入路由，并实例化路由
import { useRouter } from 'vue-router'
import message from '@/utils/message'
const router = useRouter()
// 引入axios
import axios from 'axios'
import { ref } from 'vue'
import Tanchuang from '@/components/modal/tanchuang.vue'
// 引入登录状态存储
import { useLoginStore } from '@/pinia/loginstor'
const loginStore = useLoginStore();

// 弹窗设置
const showPopup = ref(false)
const popupMessage = ref('')



// 这是弹窗的类型，默认是success 
// 里面有success和error两种类型
const types = ref('success')



// 登录表单数据
const password = ref('')
const usernameOrPhone = ref(false) // 默认设为false，表示用户名登录
const usernameOrPhoneMsg = ref('')
// 用户协议
const userAgreement = ref(false)

// 校验usernameOrPhone是否为手机号或用户名
function validateUsernameOrPhone() {
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/.test(usernameOrPhoneMsg.value);
    // 验证纯数字
    const numberRegex = /^\d+$/.test(usernameOrPhoneMsg.value);
    // 验证用户名
    // const usernameRegex = /^[a-zA-Z0-9_]{4,12}$/.test(usernameOrPhoneMsg.value);
    if (numberRegex && phoneRegex) {
        return usernameOrPhone.value = true;
    }
    else {
        return usernameOrPhone.value = false;
    }


}



// // 弹窗动画js设置
function showPopupMessage(message: string, type: string) {
    popupMessage.value = message;
    showPopup.value = true;
    types.value = type;

    // 弹窗动画效果 4秒后消失
    // setTimeout(() => {
    //     showPopup.value = false;
    // }, 3000);
}
const fasonqq = ref(0);
// 登录函数
function login() {
    // 检查用户协议是否被勾选
    if (!userAgreement.value) {
        showPopupMessage('请先同意用户协议', 'error');
        return;
    }
    // 判断用户名和密码是否为空
    if (!usernameOrPhoneMsg.value.trim() || !password.value.trim()) {
        showPopupMessage('用户名或密码不能为空', 'error');
        return;
    }
    //0 表示没有点击登录按钮，1 表示点击登录按钮，然后进行判断当
    // fasonqq.value === 1时，
    // 表示登录中，5秒后重置为0，再次点击登录按钮时，判断fasonqq.value === 0时，
    // 表示可以点击登录按钮，发送登录请求
    // 发送登录请求

    if (fasonqq.value === 1) {
        console.log('登录中，请稍后...');
        return setTimeout(() => {
            fasonqq.value = 0;
        }, 5000);
    }
    if (fasonqq.value === 0) {
        axios.defaults.baseURL = 'http://localhost:3000';
        axios.post('/login', {
            withCredentials: true,
            // 根据usernameOrPhone判断是手机号登录还是用户名登录
            [usernameOrPhone.value ? 'phone' : 'username']: usernameOrPhoneMsg.value.trim(),
            password: password.value.trim()
        }, {
            withCredentials: true
        }).then(res => {
            // 登录成功，重置fasonqq.value为1
            fasonqq.value = 1;
            if (res.data.code === 200) {
                message.success(res.data.message);

                // 更新Pinia登录状态
                loginStore.login
                    (res.data || { [usernameOrPhone.value ? 'phone' : 'username']: usernameOrPhoneMsg.value.trim() });
                // 延迟跳转，确保token存储成功，让用户看到登录成功的提示
                setTimeout(() => {
                    // 跳转的时候，重置fasonqq.value为0
                    fasonqq.value = 0;
                    router.push('/home')
                }, 2000);
                return true;
            } else {
                message.error(res.data.message);
                return false;
            }

        }).catch(err => {
            // 登录失败，重置fasonqq.value为0
            fasonqq.value = 0;
            showPopupMessage('登录失败,系统错误', 'error');
            console.error('Login error:', err);
        })
    }

}

</script>

<style scoped lang="scss">
// 颜色变量定义
:root {
    --primary-color: #667eea;
    --primary-hover: #764ba2;
    --text-primary: #333;
    --text-secondary: #666;
    --bg-light: rgba(255, 255, 255, 0.3);
    --bg-lighter: rgba(255, 255, 255, 0.8);
    --border-color: rgba(0, 0, 0, 0.2);
    --shadow-light: rgba(0, 0, 0, 0.2);
    --shadow-medium: rgba(0, 0, 0, 0.3);
}

.login-root {
    width: 100vw;
    height: 100vh;
}

.login-wrapper {
    background-image: url('./00.png');
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .login-container {
        box-shadow: 0 0.2rem 0.8rem var(--shadow-medium);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 40vw;
        max-width: 25rem;
        height: auto;
        padding: 2rem;
        border-radius: 1rem;
        backdrop-filter: blur(8px);
        background: var(--bg-light);
        border: 1px solid rgba(255, 255, 255, 0.4);
        transition: all 0.4s ease;

        &:hover {
            box-shadow: 0 0.3rem 1.2rem rgba(0, 0, 0, 0.5);
            transform: translateY(-.5rem);
        }

        .login-containerimage {
            width: 3rem;
            height: 3rem;
            margin-bottom: 1rem;
            background-image: url('../../public/01.png');
            background-size: cover;
            background-position: center;
            border-radius: 50%;
        }

        // 登录表单
        .login-containerform {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;

            // 登录标题
            h2 {
                font-size: 1.2rem;
                color: var(--text-primary);
                margin-bottom: 1.5rem;
                text-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.1);
            }

            // 登录表单内容
            form {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 1rem;

                >div {
                    width: 100%;
                    display: flex;
                    flex-direction: column;

                    // 输入框
                    input[type="text"],
                    input[type="password"] {
                        width: 100%;
                        height: 2.8rem;
                        font-size: 0.9rem;
                        padding: 0;
                        text-indent: 1.2rem;
                        border: 1px solid rgba(0, 0, 0, 0.2);
                        border-radius: 1.4rem;
                        background: var(--bg-light);
                        color: var(--text-primary);
                        transition: all 0.4s ease;

                        &::placeholder {
                            color: var(--text-secondary);
                            font-weight: 500;
                        }

                        &:focus {
                            outline: none;
                            transform: translateY(-0.1rem);
                        }
                    }

                    >div {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 0.5rem;

                        div {
                            display: flex;
                            align-items: center;

                            span {
                                color: var(--text-primary);
                                font-size: 0.8rem;
                                margin-left: 0.5rem;
                            }

                            input[type="checkbox"] {
                                width: 0.8rem;
                                height: 0.8rem;
                                accent-color: var(--primary-color);
                            }

                            a {
                                color: var(--primary-color);
                                font-size: 0.8rem;
                                text-decoration: none;
                                transition: color 0.3s ease;

                                &:hover {
                                    color: var(--primary-hover);
                                    text-decoration: underline;
                                }
                            }
                        }

                        // 忘记密码
                        p {
                            color: var(--text-primary);
                            font-size: 0.8rem;

                            a {
                                color: var(--primary-color);
                                text-decoration: none;
                                transition: color 0.3s ease;

                                &:hover {
                                    color: var(--primary-hover);
                                    text-decoration: underline;
                                }
                            }
                        }
                    }
                }

                // 登录按钮
                .loginbt {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 1rem;

                    // 登录按钮
                    input {
                        width: 12rem;
                        height: 2.8rem;
                        color: var(--text-primary);
                        border: none;
                        border-radius: 1.4rem;
                        font-size: 1.1rem;
                        font-weight: 600;
                        text-align: center;
                        line-height: 2.8rem;
                        cursor: pointer;
                        transition: all 0.4s ease;
                        letter-spacing: 0.15rem;
                        border: 1px solid rgba(0, 0, 0, 0.2);
                        background-color: var(--bg-lighter);
                        box-shadow: 0 0.2rem 0.6rem var(--shadow-light);

                        &:hover {
                            transform: translateY(-0.2rem);
                            box-shadow: 0 0.3rem 0.9rem var(--shadow-medium);
                            background-color: rgba(241, 239, 239, 0.795);
                        }

                        &:active {
                            transform: translateY(0);
                            box-shadow: 0 0.1rem 0.3rem var(--shadow-light);
                            background-color: rgba(255, 255, 255, 0.7);
                        }
                    }
                }
            }

            .user-agreement {
                display: flex;
                align-items: center;
                margin-top: 1rem;
                width: 100%;

                input[type="checkbox"] {
                    width: 0.8rem;
                    height: 0.8rem;
                    accent-color: var(--primary-color);
                    margin-right: 0.5rem;
                }

                p {
                    color: var(--text-primary);
                    font-size: 0.7rem;

                    span {
                        a {
                            color: var(--primary-color);
                            text-decoration: none;
                            transition: color 0.3s ease;

                            &:hover {
                                color: var(--primary-hover);
                                text-decoration: underline;
                            }
                        }
                    }
                }
            }
        }
    }
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
    .login-container {
        width: 70vw;
        padding: 0.8rem;
    }

    .login-containerform h2 {
        font-size: 1rem;
        margin-bottom: 1.2rem;
    }

    .login-containerform form input[type="text"],
    .login-containerform form input[type="password"] {
        height: 2.2rem;
        font-size: 0.8rem;
        text-indent: 0.8rem;
    }

    .login-containerform form .loginbt input {
        width: 8rem;
        height: 2.2rem;
        font-size: 0.9rem;
    }

    .login-containerform .user-agreement p {
        font-size: 0.6rem;
    }
}

@media screen and (max-width: 480px) {
    .login-container {
        width: 85vw;
        padding: 0.6rem;
    }

    .login-containerimage {
        width: 2.5rem !important;
        height: 2.5rem !important;
        margin-bottom: 0.8rem !important;
    }

    .login-containerform h2 {
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .login-containerform form input[type="text"],
    .login-containerform form input[type="password"] {
        height: 2rem;
        font-size: 0.7rem;
        text-indent: 0.7rem;
    }

    .login-containerform form>div>div {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .login-containerform form>div>div div {
        width: 100%;
        justify-content: space-between;
    }

    .login-containerform form .loginbt input {
        width: 7rem;
        height: 2rem;
        font-size: 0.8rem;
    }

    .login-containerform .user-agreement {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.3rem;
    }

    .login-containerform .user-agreement p {
        font-size: 0.5rem;
        line-height: 1.2;
    }
}

@media screen and (max-width: 390px) {
    .login-container {
        width: 90vw;
        padding: 0.5rem;
    }

    .login-containerform form input[type="text"],
    .login-containerform form input[type="password"] {
        height: 1.8rem;
        font-size: 0.6rem;
        text-indent: 0.6rem;
    }

    .login-containerform form .loginbt input {
        width: 6rem;
        height: 1.8rem;
        font-size: 0.7rem;
    }
}

@media screen and (max-width: 320px) {
    .login-container {
        width: 95vw;
        padding: 0.4rem;
    }

    .login-containerimage {
        width: 2rem !important;
        height: 2rem !important;
        margin-bottom: 0.6rem !important;
    }

    .login-containerform h2 {
        font-size: 0.8rem;
        margin-bottom: 0.8rem;
    }

    .login-containerform form input[type="text"],
    .login-containerform form input[type="password"] {
        height: 1.6rem;
        font-size: 0.5rem;
        text-indent: 0.5rem;
    }

    .login-containerform form .loginbt input {
        width: 5rem;
        height: 1.6rem;
        font-size: 0.6rem;
    }
}
</style>
