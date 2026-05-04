// 触底更新数据
import axios from 'axios'
// 加载中状态
let isLoading = false
const scrollBottom = async (url: string, targetlist: any[]) => {
    // 滚动距离
    const scrollTop = window.scrollY
    // 视口高度
    const clientHeight = document.documentElement.clientHeight
    // 文档高度
    const scrollHeight = document.documentElement.scrollHeight
    // 触底更新数据
    if (scrollTop + clientHeight >= scrollHeight) {
        // 加载中状态
        isLoading = true
        try {
            const res = await axios.get(url)
            if (res.data.code === 200) {
                return targetlist.push(...res.data.data);
            }
        } catch (error) {
            console.error('请求失败:', error);
        } finally {
            // 加载中状态
            isLoading = false
        }
    }

}
export default scrollBottom