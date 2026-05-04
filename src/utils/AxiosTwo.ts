import axios from 'axios'

const service = axios.create({
    // baseURL: 'http://127.0.0.1:3000',
    // 超时时间
    timeout: 10000,
    // 跨域请求时是否需要使用凭证
    withCredentials: true,
})
// 请求拦截器
service.interceptors.request.use(config => {
    // 浏览器自动添加cookie就不需要手动添加了
        return config
    }
    , error => {
        return Promise.reject(error)
    }
)
// 响应拦截器
service.interceptors.response.use(
    response => {
        return response
    }
    , error => {
        return Promise.reject(error)
    }
)