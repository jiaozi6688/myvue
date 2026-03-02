<template>
    <div class="goods-detail-container">
        <div class="breadcrumb">
            <span>首页</span>
            <span class="separator">/</span>
            <span>商品详情</span>
        </div>

        <div class="detail-content">
            <!-- 商品图片区域 -->
            <div class="goods-image">
                <div class="main-image">
                    <img v-if="goodsDetail.image" :src="`http://127.0.0.1:3000${goodsDetail.image}`" alt="商品图片" />
                    <div v-else class="image-placeholder">暂无图片</div>
                </div>
                <div class="thumbnail-list">
                    <div class="thumbnail active">
                        <img src="" alt="缩略图1" />
                    </div>
                    <div class="thumbnail">
                        <img src="" alt="缩略图2" />
                    </div>
                    <div class="thumbnail">
                        <img src="" alt="缩略图3" />
                    </div>
                    <div class="thumbnail">
                        <img src="" alt="缩略图4" />
                    </div>
                </div>
            </div>

            <!-- 商品信息区域 -->
            <div class="goods-info">
                <h1 class="goods-title">{{ goodsDetail.name }}</h1>
                <div class="goods-price">
                    <span class="price-label">价格：</span>
                    <span class="price-value">¥{{ goodsDetail.price }}</span>
                </div>

                <div class="goods-specs">
                    <div class="spec-style">
                        <div>
                            <span class="spec-label">选择版本</span>
                        </div>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label" >数量：</span>
                        <div class="quantity-selector">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" class="quantity-input" value="1" min="1" />
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                </div>

                <div class="goods-description">
                    <h3>商品描述</h3>
                    <p>这里是商品的详细描述信息...</p>
                </div>

                <div class="action-buttons">
                    <button class="btn btn-primary" @click="cartStore.addToCart(goodsDetail)">加入购物车</button>   
                    <button class="btn btn-secondary">立即购买</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useCartStore } from '@/pinia/Cartstor'
import axios from 'axios';
import { isArray } from 'element-plus/es/utils/types.mjs';
const route = useRoute()
// 从购物车存储中获取购物车列表
const cartStore = useCartStore();
// 保存商品详情数据
const goodsDetail = ref<any>([]);
// 商品详情页，根据商品id获取商品详情
onMounted(() => {
    try {
        const id = route.query.id
        // 没有缓存或缓存不匹配，发送请求
        axios.get(`http://127.0.0.1:3000/getgoodslist/detail/${id}`).then(res => {
            goodsDetail.value = res.data.data;
            // console.log(goodsDetail.value);
        
            
            return
        })
    } catch (error) {
        console.error('获取商品详情失败:', error);
    }
})

</script>

<style scoped>
.goods-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.breadcrumb {
    padding: 15px 0;
    font-size: 14px;
    color: #666;
}

.breadcrumb .separator {
    margin: 0 10px;
    color: #ccc;
}

.detail-content {
    display: flex;
    gap: 40px;
    margin-top: 20px;
}

/* 商品图片区域 */
.goods-image {
    flex: 1;
    max-width: 500px;
}

.main-image {
    width: 100%;
    height: 500px;
    background: #f5f5f5;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.main-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.thumbnail-list {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.thumbnail {
    width: 80px;
    height: 80px;
    border: 2px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
}

.thumbnail:hover {
    border-color: #409eff;
}

.thumbnail.active {
    border-color: #409eff;
    box-shadow: 0 0 5px rgba(64, 158, 255, 0.3);
}

.thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 商品信息区域 */
.goods-info {
    flex: 1;
    padding: 20px 0;
}

.goods-title {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin: 0 0 20px 0;
    line-height: 1.4;
}

.goods-price {
    background: #fff8f0;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 25px;
}

.price-label {
    font-size: 16px;
    color: #666;
    margin-right: 10px;
}

.price-value {
    font-size: 32px;
    font-weight: bold;
    color: #ff6700;
}

.goods-specs {
    margin-bottom: 25px;
}

.spec-style {
    font-size: 14px;
    color: #666;
    margin-right: 10px;
}







.spec-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.quantity-selector {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
}

.quantity-btn {
    width: 40px;
    height: 36px;
    border: none;
    background: #f5f5f5;
    cursor: pointer;
    font-size: 18px;
    transition: background 0.3s;
}

.quantity-btn:hover {
    background: #e0e0e0;
}

.quantity-input {
    width: 60px;
    height: 36px;
    border: none;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    text-align: center;
    font-size: 14px;
    outline: none;
}

.goods-description {
    margin-bottom: 30px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
}

.goods-description h3 {
    font-size: 16px;
    color: #333;
    margin: 0 0 10px 0;
}

.goods-description p {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin: 0;
}

.action-buttons {
    display: flex;
    gap: 15px;
}

.btn {
    flex: 1;
    padding: 15px 30px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-primary {
    background: linear-gradient(135deg, #ff6700 0%, #ff8533 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(255, 103, 0, 0.3);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 103, 0, 0.4);
}

.btn-secondary {
    background: white;
    color: #ff6700;
    border: 2px solid #ff6700;
}

.btn-secondary:hover {
    background: #fff8f0;
    transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 960px) {
    .detail-content {
        flex-direction: column;
    }

    .goods-image {
        max-width: 100%;
    }

    .main-image {
        height: 400px;
    }
}

@media (max-width: 600px) {
    .goods-detail-container {
        padding: 10px;
    }

    .goods-title {
        font-size: 22px;
    }

    .price-value {
        font-size: 26px;
    }

    .action-buttons {
        flex-direction: column;
    }

    .main-image {
        height: 300px;
    }
}
</style>