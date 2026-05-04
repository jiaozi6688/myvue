<template>
    <!-- 购物车页面 -->
    <div class="cart-container">
        <header class="cart-header">
            <h1>我的购物车</h1>
        </header>

        <main class="cart-main">
            <p v-if="cartStore.cartlist.length === 0" style="text-align: center;">
                您的购物车当前为空!点击<a href="/home">返回首页</a>添加商品
            </p>
            <div v-else>
                <!-- 购物车商品列表标题 -->
                <div style="cursor: default; user-select: none;">
                    <input type="checkbox" @click="handleCheckAll"
                        :checked="cartStore.cartlist.every(item => item.isChecked)">
                    <span @click="handleCheckAll">全选</span>
                </div>
                <div>商品信息</div>
                <div>商品单价</div>
                <div>商品数量</div>
                <div>商品总价</div>
            </div>
            <!-- 购物车商品列表 -->
            <div class="cart-item" v-for="item in items" :key="item.goodsId">
                <div>
                    <input type="checkbox" :checked="item.isChecked" @click="select(item.goodsId)">
                </div>
                <div>
                    <img alt="商品图片" :src="`http://127.0.0.1:3000${item.image}`" :title="item.name">
                    {{ item.name }}
                </div>
                <div>{{ Number(item.price).toFixed(2) }}</div>
                <div>{{ Number(item.count) }}</div>
                <div>{{ (Number(item.count) * Number(item.price)).toFixed(2) }}</div>
            </div>
        </main>
        <footer class="cart-footer" v-if="cartStore.cartlist.length !== 0">
            <div>
                <input type="checkbox" @click="handleCheckAll"
                    :checked="cartStore.cartlist.every(item => item.isChecked)">
                <span @click="handleCheckAll">全选</span>
                <span v-if="cartStore.cartlist.some(item => item.isChecked)" class="selected-count">
                    已选择 {{cartStore.cartlist.filter(item => item.isChecked).length}} 件商品
                </span>
            </div>
            <button @click="cartStore.rmselectgoods()"
                v-show="cartStore.cartlist.some(item => item.isChecked)">删除选中商品</button>
            <!-- :disabled="!cartStore.cartlist.some(item => item.isChecked)"是判断购物车是否有选中商品，没有选中商品则禁用结算按钮 -->
            <button @click="handlePayment" :disabled="!cartStore.cartlist.some(item => item.isChecked)">结算（{{
                cartStore.allprice }}元）</button>
        </footer>
    </div>

</template>

<script lang="ts" setup>
import { useCartStore } from '@/pinia/Cartstor'
import router from '@/router'
import { ref, computed, watch } from 'vue';

const cartStore = useCartStore()
const items = computed(() => cartStore.cartlist);
console.log('awihdkiawhduihawiduhawiud', items.value);

// 单选
const select = (goodsId: string) => {
    const item = cartStore.cartlist.find(item => item.goodsId === goodsId)
    if (item) {
        // 切换商品的isChecked属性
        item.isChecked = !item.isChecked;
    }
}
// 全选
const handleCheckAll = () => {
    cartStore.cartlist.forEach(item => {
        item.isChecked = !item.isChecked
    })
}
// 结算 跳转到结算页面
const handlePayment = () => {
    // 设置结算页面访问权限 确保每次都需要从购物车点击结算按钮进入
    sessionStorage.setItem('canAccessJiesuan', 'true');
    router.push('/jiesuan')
}
watch(() => cartStore.cartlist, (newVal, oldVal) => {
    // 购物车商品列表发生变化时更新
    console.log('购物车商品数量:', cartStore);
    console.log('购物车数据变化:', newVal);

}, { deep: true })

</script>
<style scoped>
.cart-container {
    width: 100%;
    min-height: 100vh;
    background-color: #cfcbcb;
    display: flex;
    flex-direction: column;
}

.cart-header {
    width: 100%;
    height: 60px;
    background-color: #4a90e2;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: bold;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.cart-header:hover {
    background-color: #357abd;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
}

input {
    width: 15px;
    height: 15px;
}

.cart-main {
    width: 70%;
    margin: 15px auto 0;
    flex: 1;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #ebe6e6;

    >div:nth-child(1) {
        display: grid;
        grid-template-columns: 12% 40% 17% 17% 16%;
        width: 100%;
        height: 40px;
        align-items: center;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        background-color: #4a90e2;

        div:nth-child(1) {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-left: 10px;
        }

        >div:nth-child(2) {
            text-align: left;
        }

    }

    /* &表示 >表示 */
    >.cart-item {
        display: grid;
        grid-template-columns: 12% 40% 17% 17% 16%;
        align-items: center;
        text-align: center;
        width: 100%;
        height: 120px;
        margin-bottom: 5px;
        border-radius: 8px;
        background-color: #f5f4f4;
        transition: all 0.1s;

        >div:nth-child(2) {
            display: flex;
            align-items: center;
            gap: 20px;

            img {
                width: 80px;
                height: 80px;
            }
        }

        &:hover {
            background-color: #7a78789d;
        }
    }
}

.cart-footer {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    width: 70%;
    height: 80px;
    padding: 0 30px;
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 120px 150px;
    gap: 20px;
    background-color: #ffffff;
    border-top: 2px solid #e0e0e0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 12px 12px 0 0;
    transition: all 0.3s ease;
}

.cart-footer:hover {
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.15);
}

.cart-footer>div:first-child {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 16px;
    font-weight: 500;
    color: #333;
}

.cart-footer>div:first-child input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #4a90e2;
}

.cart-footer>div:first-child span {
    cursor: pointer;
    transition: color 0.2s ease;
}

/* 全选文字 */
.cart-footer>div:first-child span:hover {
    color: #4a90e2;
    font-weight: 600;
}

/* 删除选中商品按钮 */
.cart-footer button {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
}

/* 删除选中商品按钮悬停效果 */
.cart-footer button:first-of-type:hover {
    background-color: #99b4e7;
    color: white;
    transform: translateY(-1px);
}

/* 结算按钮 */
.cart-footer button:last-of-type {
    background-color: #52aa9b;
    color: white;
}

.cart-footer button:last-of-type:hover {
    background-color: #acddec;
    color: red;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 30, 30, 0.3);
}

/* 结算按钮禁用状态 */
.cart-footer button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
}

/* 选中商品数量显示 */
.selected-count {
    margin-left: 10px;
    font-size: 14px;
    color: #4a90e2;
    font-weight: 600;
}

/* 支付弹窗样式优化 */
.payview {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
}

.modal-content {
    background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 20px;
    padding: 30px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
    animation: slideUp 0.4s ease-out;
    position: relative;
}

.modal-content h2 {
    text-align: center;
    margin-bottom: 25px;
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
    background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.modal-content>div:not(.pay-info):not(.payment-methods) {
    margin: 15px 0;
    padding: 15px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    border: 1px solid #e9ecef;
    display: flex;
    align-items: center;
    gap: 15px;
    transition: all 0.3s ease;
}

.modal-content>div:not(.pay-info):not(.payment-methods):hover {
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.modal-content img {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    border: 2px solid #e9ecef;
    transition: all 0.3s ease;
}

.modal-content img:hover {
    border-color: #4a90e2;
    transform: scale(1.05);
}

.modal-content p {
    margin: 0;
    font-size: 16px;
    color: #495057;
    font-weight: 500;
}

/* 付款方式样式优化 */
.payment-methods {
    margin: 20px 0;
    padding: 20px;
    border-radius: 15px;
}

/* 付款方式选项样式 */
.payment-methods span {
    display: inline-block;
    padding: 12px 20px;
    margin: 5px;
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
    font-weight: 500;
    color: #495057;
}

/* 付款方式选项悬停效果 */
.payment-methods span:hover {
    border-color: #4a90e2;
    background: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(74, 144, 226, 0.2);
}

/* 选中时的付款方式样式 */
.payment-methods span:focus {
    border-color: #4a90e2;
    color: white;
    transform: translateY(-2px);
    background-color: #357abd;
}

/* 支付信息区域样式优化 */
.pay-info {
    margin-top: 25px;
    padding: 20px;
    background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
    border-radius: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 8px 25px rgba(74, 144, 226, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 支付信息文本样式 */
.pay-info p {
    color: white;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 支付按钮样式优化 */
.pay-info button {
    padding: 12px 25px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-left: 10px;
}

.pay-info button:first-of-type {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.5);
}

.pay-info button:first-of-type:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(255, 255, 255, 0.2);
}

.pay-info button:last-of-type {
    background: #ff6b6b;
    color: white;
    border: 2px solid #ff6b6b;
}

.pay-info button:last-of-type:hover {
    background: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(255, 107, 107, 0.4);
}

/* 动画效果 */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        padding: 20px;
        margin: 20px;
    }

    .pay-info {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }

    .pay-info button {
        width: 100%;
        margin: 5px 0;
    }
}
</style>
