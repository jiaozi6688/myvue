import { defineStore } from "pinia";
import { ref } from "vue";
import { useCartStore } from "./Cartstor";
import axios from "axios";
import message from "../components/modal/message"
export const useLoginStore = defineStore('login', () => {
    // 状态
    // 登录状态
    const islogin = ref<boolean>(false);
    //  登录成功后返回的用户信息，包含用户名、密码、手机号、邮箱、角色等
    const userInfo = ref<any>(null);

    // 方法
    // 登录
    function login(userData: any) {
        islogin.value = true;
        // 合并用户数据
        userInfo.value = { ...userInfo.value, ...userData };
        // 保存到localStorage
        localStorage.setItem('islogin', 'true');
        // userInfo是登录成功后返回的用户信息，包含用户名、密码、手机号、邮箱、角色等
        localStorage.setItem('userInfo', JSON.stringify(userData));
        // 登录成功后，将token保存到localStorage
        localStorage.setItem('token', userData.token);
        // token到期时间
        localStorage.setItem('tokenExpireTime', userData.tokenExpireTime);
    }

    // 退出
    async function logout() {
        // 清除cookie
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie?.indexOf?.('=');
            const name = eqPos !== -1 ? cookie?.substring(0, eqPos) : cookie;
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        }
        // 清空购物车数据
        useCartStore().clearCartData();
        await axios.post('/logout', {
            userId: userInfo.value.userInfo.userId
        }).then(res => {
            message.success('成功退出');
            console.log('退出登录成功:', res.data);
            islogin.value = false;
            userInfo.value = null;
            // 清除localStorage数据
            localStorage.clear();
            // 退出登录后，清空用户信息
            userInfo.value = null;
            // 退出登录后，清空购物车数据
            useCartStore().clearCartData();
            // 退出登录后，清空token
            localStorage.removeItem('token');
        }).catch(err => {
            message.error('退出失败');
        });
    }

    // 初始化登录状态 / 从localStorage恢复登录状态
    function initLoginState() {
        try {
            // 检查localStorage是否有登录状态
            const loginStatus = localStorage.getItem('islogin');
            // 检查localStorage是否有用户信息
            const savedUserInfo = localStorage.getItem('userInfo');
            // 检测到登录状态为true且有用户信息，
            // 则将islogin设置为true，userInfo设置为解析后的用户信息
            if (loginStatus === 'true' && savedUserInfo) {
                // 登录状态为true且有用户信息
                islogin.value = true;
                // 解析用户信息
                userInfo.value = JSON.parse(savedUserInfo);
            }
        } catch (error) {
            console.error('初始化登录状态失败:', error);
            // 发生错误时重置状态
            islogin.value = false;
            userInfo.value = null;
        }
    }

    return {
        islogin,
        userInfo,
        login,
        logout,
        initLoginState
    }
})
export default useLoginStore;