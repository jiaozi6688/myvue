import { defineStore } from "pinia";
import { ref } from "vue";

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
        userInfo.value = {...userInfo.value, ...userData};
        // 保存到localStorage
        localStorage.setItem('islogin', 'true');
        // userInfo是登录成功后返回的用户信息，包含用户名、密码、手机号、邮箱、角色等
        localStorage.setItem('userInfo', JSON.stringify(userData));

    }

    // 退出
    function logout() {
        islogin.value = false;
        userInfo.value = null;
        // 清除localStorage
        localStorage.removeItem('islogin');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
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