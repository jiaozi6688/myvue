<template>

    <div class="body">
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
                    <p>已阅读并同意<span><a href="/privacypolicy">《隐私政策》</a>和<a href="/useragreement">《用户协议》</a></span></p>
                </div>
            </div>
        </div>
    </div>

    <!-- 弹窗设置 -->
    <tanchuang :showPopup="showPopup" :popupMessage="popupMessage" :type="types" @close="showPopup = false"></tanchuang>
</template>
<script setup lang="ts">
// 引入路由，并实例化路由
import { useRouter } from 'vue-router'
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
        axios.defaults.baseURL = 'http://127.0.0.1:3000/login';
        axios.post('/login', {
            // 根据usernameOrPhone判断是手机号登录还是用户名登录
            [usernameOrPhone.value ? 'phone' : 'username']: usernameOrPhoneMsg.value.trim(),
            password: password.value.trim()
        }).then(res => {
            // 登录成功，重置fasonqq.value为1
            fasonqq.value = 1;
            if (res.data.code === 200) {
                showPopupMessage(res.data.message, 'success');
                // 登录成功后，将token存储到localStorage
                localStorage.setItem('token', res.data.token);
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
                showPopupMessage(res.data.message, 'error');
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

<style scoped>
.body {
    background-image: url('../../public/0\ \(1\).png');
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-container {
    position: relative;
    width: 800px;
    height: 500px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    display: flex;
   /* 毛玻璃效果 */
    backdrop-filter: blur(3px);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.4);
}

.login-containerimage {
    width: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    font-weight: 300;
    letter-spacing: 2px;
}

.login-containerform {
    width: 400px;
    padding: 0 40px;
    /* background: #ffffff; */
    background-color: rgba(255, 255, 255, 0.5);
    display: flex;
    flex-direction: column;
    /* 垂直居中 */
    justify-content: center;
}

.login-containerform h2 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #2c3e50;
    text-align: center;
    letter-spacing: 1px;
}

.login-containerform form {
    display: flex;
    flex-direction: column;

    /* 用户名，密码的默认文字效果或样式 */
    >div:not(:last-child) {

        /* 用户名 密码 输入框样式 */
        input::placeholder {
            font-size: 14px;
            font-weight: 500;
        }

        /* 聚焦时 输入框文字消失*/
        input:focus::placeholder {
            color: white;
        }

        /* 忘记密码 记住密码 去注册 样式 */
        >div {

            /*  去注册 样式 */
            p {
                margin-top: 8px;
            }

            /* 忘记密码记住密码样式 */
            >div {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                margin-top: 8px;

                span {
                    >input {
                        width: 15px;
                        height: 15px;
                    }
                }

                a {
                    font-size: 14px;
                    font-weight: 500;
                    color: #3498db;
                }

            }
        }
    }
}

/* 登录表单样式 */
.login-containerform form>div {
    width: 100%;
    display: flex;
    flex-direction: column;
}

/* 输入框样式 */
.login-containerform form>div input {
    height: 45px;
    border-radius: 8px;
    border: 1px solid #d7d0d0;
    padding: 0 10px;
    font-size: 16px;
    transition: all 0.3s ease;
}

/* 记住密码勾选框 */
.login-containerform form>div:nth-child(2) {
    margin: 15px 0 15px 0;

    >div {
        span {
            display: flex;
            flex-direction: row;
            align-items: center;

            input {
                margin-right: 8px;
            }
        }

        p {
            padding-top: 5px;
        }
    }

}

.login-containerform form>div input:focus {
    outline: none;
    border-color: #3498db;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/* 登录按钮样式 */
.login-containerform form>div:nth-child(3) {
    align-items: center;

    input {
        text-align: center;
    }
}

.login-containerform form>div:nth-child(3) input {
    width: 120px;
    height: 45px;
    background: linear-gradient(45deg, #3498db, #2980b9);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    /* 增加间距 */
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 1px;
}

.login-containerform form>div:nth-child(3) input:hover {
    background: linear-gradient(45deg, #2980b9, #2471a3);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.login-containerform form>div:nth-child(3) input:active {
    transform: translateY(0);
}

/* 用户协议 */
.user-agreement {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;

    /* style="color: #3498db;" */
    input {
        margin-right: 8px;
    }

    p {
        font-size: 15px;

        a {
            color: #3498db;
            text-decoration: none;
        }
    }
}

/* 适配移动端 */
@media screen and (max-width: 1024px) {
    .login-container {
        width: 90%;
        max-width: 600px;
        height: auto;
        min-height: 500px;
    }

    .login-containerimage {
        width: 300px;
    }

    .login-containerform {
        width: 300px;
        padding: 40px 30px;
    }

    input {
        width: 85%;
    }
}

@media screen and (max-width: 768px) {
    .login-container {
        width: 95%;
        max-width: 400px;
        height: auto;
        flex-direction: column;
        margin: 20px auto;
    }

    .login-containerimage {
        width: 100%;
        height: 150px;
        font-size: 20px;
        letter-spacing: 1px;
    }

    .login-containerform {
        width: 100%;
        padding: 40px 25px;
    }

    .login-containerform h2 {
        font-size: 24px;
        margin-bottom: 25px;
    }

    .login-containerform form {
        gap: 20px;
    }

    .login-containerform form>div input {
        width: 85%;
        height: 42px;
        font-size: 14px;
    }

    .login-containerform form>div:nth-child(3) input {
        width: 110px;
        height: 42px;
        font-size: 15px;
    }
}

@media screen and (max-width: 480px) {
    .login-container {
        width: 95%;
        max-width: 350px;
        border-radius: 15px;
        margin: 15px auto;
    }

    .login-containerimage {
        height: 120px;
        font-size: 18px;
    }

    .login-containerform {
        padding: 30px 20px;
    }

    .login-containerform h2 {
        font-size: 22px;
        margin-bottom: 20px;
    }

    .login-containerform form {
        gap: 18px;
    }

    .login-containerform form>div label {
        font-size: 13px;
    }

    .login-containerform form>div input {
        height: 40px;
        font-size: 13px;
        padding: 0 12px;
    }

    .login-containerform form>div:nth-child(3) input {
        width: 100px;
        height: 40px;
        font-size: 14px;
    }
}

@media screen and (max-width: 320px) and (min-width: 280px) {
    .login-container {
        width: 98%;
        max-width: 300px;
        border-radius: 12px;
    }

    .login-containerimage {
        height: 100px;
        font-size: 16px;
    }

    .login-containerform {
        padding: 25px 15px;
    }

    .login-containerform h2 {
        font-size: 20px;
    }

    .login-containerform form>div input {
        height: 38px;
    }

    .login-containerform form>div:nth-child(3) input {
        width: 90px;
        height: 38px;
    }
}
</style>
