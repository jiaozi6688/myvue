import axios from "axios";
// 配置axios的baseURL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
// 配置axios的超时时间
axios.defaults.timeout = 10000;
async function searchGoods(value: string) {
    return await axios.post("/search", {
        value
    });
}
// 导出搜索商品的函数
export default searchGoods;
