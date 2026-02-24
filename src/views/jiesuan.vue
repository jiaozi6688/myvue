<template>
    <!-- 页面头部 -->
    <header class="checkout-header">
        <div class="header-content">
            <h1>订单结算</h1>
            <div class="step-indicator">
                <div class="step active">
                    <span class="step-number">1</span>
                    <span class="step-text">确认订单</span>
                </div>
                <div class="step-line"></div>
                <div class="step">
                    <span class="step-number">2</span>
                    <span class="step-text">支付订单</span>
                </div>
                <div class="step-line"></div>
                <div class="step">
                    <span class="step-number">3</span>
                    <span class="step-text">完成</span>
                </div>
            </div>
        </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="checkout-main">
        <!-- 收货地址区域 -->
        <section class="section">
            <div class="section-header">
                <h2>收货地址</h2>
                <button class="section-action" id="manageAddressBtn" @click="showAddressModal = true">管理地址</button>
            </div>
            <!-- 地址列表 -->
            <div class="address-list">
                <div v-for="address in addresses" :key="address._id" class="address-card"
                    :class="{ active: selectedAddressId === address._id }" @click="selectAddress(address._id)">
                    <div class="address-info">
                        <div class="recipient-info">
                            <span class="recipient-name">{{ address.name }}</span>
                            <span class="recipient-phone">{{ address.phone }}</span>
                        </div>
                        <p class="address-detail">{{ address.province }} {{ address.city }} {{ address.district }} {{
                            address.detail }}</p>
                        <div class="address-tags">
                            <span v-if="address.isDefault" class="tag default">默认</span>
                            <span class="tag">{{ getTagText(address.tag) }}</span>
                        </div>
                    </div>
                    <div class="address-actions">
                        <button class="edit-btn">编辑</button>
                        <button class="delete-btn" @click="deleteAddress(address._id)">删除</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- 商品信息区域 -->
        <section class="section">
            <div class="section-header">
                <h2>商品信息</h2>
                <span class="product-count">{{ selectedGoods.length }}件商品</span>
            </div>
            <!-- 商品列表展示需要结算的商品 -->
            <div class="products-list">
                <div v-for="item in selectedGoods" :key="item.goodsId" class="product-card">
                    <div class="product-image-placeholder"></div>
                    <div class="product-info">
                        <h3 class="product-name">{{ item.name }}</h3>
                        <p class="product-spec">规格：{{ '无' }}</p>
                        <p class="product-count">数量：{{ item.count }}</p>
                    </div>
                    <div class="product-price">
                        <span class="unit-price">￥{{ item.price }}</span>
                        <span class="quantity">x{{ item.count }}</span>
                        <!-- 商品总价 -->
                        <span class="total-price">￥{{ }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- 支付方式区域 -->
        <section class="section">
            <div class="section-header">
                <h2>支付方式</h2>
            </div>
            <div class="payment-methods">
                <div class="payment-method active">
                    <div class="method-icon alipay-icon"></div>
                    <span class="method-name">支付宝</span>
                    <div class="method-check">
                        <div class="checkmark"></div>
                    </div>
                </div>
                <div class="payment-method">
                    <div class="method-icon wechat-icon"></div>
                    <span class="method-name">微信支付</span>
                    <div class="method-check">
                        <div class="checkmark"></div>
                    </div>
                </div>
                <div class="payment-method">
                    <div class="method-icon bank-icon"></div>
                    <span class="method-name">银行卡</span>
                    <div class="method-check">
                        <div class="checkmark"></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 订单信息区域 -->
        <section class="section">
            <div class="section-header">
                <h2>订单信息</h2>
            </div>
            <div class="order-summary">
                <div class="summary-item">
                    <span>商品总价：</span>
                    <span>￥{{ cartStore.allprice }}</span>
                </div>
                <div class="summary-item">
                    <span>运费：</span>
                    <span>￥0.00</span>
                </div>
                <div class="summary-item discount"><span>优惠:</span>
                    <span>-￥20.00</span>
                </div>
                <div class="summary-item total">
                    <span>实付金额：</span>
                    <span class="final-price">￥{{ cartStore.allprice }}</span>
                </div>
            </div>
        </section>
    </main>

    <!-- 底部操作栏 -->
    <footer class="checkout-footer">
        <div class="footer-content">
            <div class="price-summary">
                <span class="label">应付金额：</span>
                <span class="price">￥{{ cartStore.allprice }}</span>
            </div>
            <button class="submit-order-btn" id="submitOrderBtn" @click="submitOrder">
                确认订单 ￥{{ cartStore.allprice }}
            </button>
        </div>
    </footer>

    <!-- 弹窗部分 -->
    <!-- 地址管理弹窗 -->
    <div class="modal-overlay" v-if="showAddressModal" @click="showAddressModal = false">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>地址管理</h3>
                <button class="close-btn" @click="showAddressModal = false">×</button>
            </div>
            <div class="modal-body">
                <!-- 地址列表 -->
                <div class="address-list-modal">
                    <div v-for="address in addresses" :key="address._id" class="address-card-modal"
                        :class="{ active: selectedAddressId === address._id }">
                        <div class="address-info">
                            <div class="recipient-info">
                                <span class="recipient-name">{{ address.name }}</span>
                                <span class="recipient-phone">{{ address.phone }}</span>
                            </div>
                            <p class="address-detail">{{ address.province }} {{ address.city }} {{ address.district }}
                                {{ address.detail }}</p>
                            <div class="address-tags">
                                <span v-if="address.isDefault" class="tag default">默认</span>
                                <span class="tag">{{ getTagText(address.tag) }}</span>
                            </div>
                        </div>
                        <div class="address-actions">
                            <button class="edit-btn">编辑</button>
                            <button class="delete-btn" @click="deleteAddress(address._id)">删除</button>
                            <button class="default-btn">设为默认</button>
                        </div>
                    </div>
                    <div class="add-new-address">
                        <span><router-link to="/newaddress">添加新地址</router-link></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useLoginStore } from '@/pinia/loginstor'
import { useCartStore } from '@/pinia/Cartstor'

const router = useRouter()
const cartStore = useCartStore()
// 选中需要结算的商品渲染到页面
const selectedGoods = computed(() => {
    return cartStore.selectedGoods
})



const userId = useLoginStore().userInfo.userInfo.userId
console.log('userId:', userId);



// 存放地址数据
const addresses = ref<any[]>([])
// 选中的地址ID
const selectedAddressId = ref<string>('')
// 显示地址弹窗
const showAddressModal = ref(false)
// 删除地址
function deleteAddress(addressId: string) {

    try {
        console.log('删除地址请求参数:', addressId);
        axios.delete(`http://127.0.0.1:3000/userads/deladrs/${addressId}/${userId}`)
            .then(response => {
                if (response.status === 200) {
                    // 删除成功后刷新地址列表
                    if (addresses.value.length === 0) {
                        // 如果删除的是当前选中的地址，清空选中
                        addresses.value = []
                    }
                    fetchAddresses();
                }
            })
            .catch(error => {
                console.error('删除地址失败:', error)
            })
    } catch (err) {
        console.error('删除地址失败:', err)
    }
}
// 获取地址列表
const fetchAddresses = async () => {
    try {
        // 使用环境变量中的API基础URL
        const baseURL = 'http://127.0.0.1:3000/userads/getadrs/';
        const response = await axios.get(`${baseURL}${userId}`)

        if (response.status === 200) {
            addresses.value = response.data.data || response.data
            console.log('获取到的地址列表:', addresses.value)

            // 设置默认选中地址
            if (addresses.value.length > 0) {
                const defaultAddress = addresses.value.find(addr => addr.isDefault)
                selectedAddressId.value = defaultAddress ? defaultAddress._id : addresses.value[0]._id
            } else {
                // 没有地址时清空选中
                selectedAddressId.value = ''
            }
        }
    } catch (error: any) {
        console.error('获取地址失败:', error)
        // 如果是404错误，说明用户没有地址，清空地址列表
        if (error.response?.status === 404) {
            addresses.value = []
            selectedAddressId.value = ''
            console.log('用户没有地址，清空地址列表')
        }
    }
}

// 选择地址
const selectAddress = (addressId: string) => {
    selectedAddressId.value = addressId
}

// 获取标签文本
const getTagText = (tag: string) => {
    const tagMap: Record<string, string> = {
        'home': '家',
        'company': '公司',
        'school': '学校',
        'other': '其他'
    }
    return tagMap[tag] || '其他'
}

// 页面加载时获取地址列表  和 只能从购物车点击结算按钮进入
onMounted(() => {
    // 检查是否有权限访问 sessionStorage.getItem('canAccessJiesuan')是浏览器存储的权限
    const canAccess = sessionStorage.getItem('canAccessJiesuan');
    if (canAccess !== 'true') {
        // 没有权限，跳转到购物车页面
        console.log('未授权访问结算页面，跳转到购物车');
        router.push('/cart');
        return;
    }

    fetchAddresses();
    // 清除访问权限，确保每次都需要从购物车点击结算按钮进入
    sessionStorage.removeItem('canAccessJiesuan');

})

// 监听路由变化，当从添加地址页面返回时重新获取地址
router.afterEach((to, from) => {
    if (from.path === '/newaddress') {
        fetchAddresses()
    }
})

// 提交订单
function submitOrder() {
    // 检查是否选择了地址
    // if (!selectedAddressId.value) {
    //     alert('请选择一个地址')
    //     return
    // }
    // 先创建一个订单对象保存订单信息
    // 包含用户ID、地址ID、订单金额、订单状态、订单创建时间
    // 商品数据
    const orderData = {
        userId,
        addressId: selectedAddressId.value,
        // 订单金额
        orderAmount: 10878.00,
        // 订单状态
        orderStatus: '待支付',
        // 订单创建时间
        orderCreateTime: new Date().toISOString(),
        // 所购买的商品
        ordergoods: [{ ...cartStore.selectedGoods }]
    }
    console.log(orderData)
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    color: #333;
}

.checkout-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* 头部样式 */
.checkout-header {
    background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
    color: white;
    padding: 20px 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-content h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
}

.step-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.step.active .step-number {
    background: #ff6b6b;
    color: white;
}

.step.active .step-text {
    color: #ff6b6b;
    font-weight: 600;
}

.step-number {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.step-text {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
}

.step-line {
    width: 50px;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
}

/* 主要内容样式 */
.checkout-main {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px 100px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e9ecef;
}

.section-header h2 {
    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}

.section-action {
    padding: 8px 16px;
    border: 2px solid #4a90e2;
    background: transparent;
    color: #4a90e2;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.section-action:hover {
    background: #4a90e2;
    color: white;
}

/* 地址卡片样式 */
.address-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 15px;
}

.address-card {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.address-card:hover {
    border-color: #4a90e2;
    transform: translateY(-2px);
}

.address-card.active {
    border-color: #4a90e2;
    background: #f8f9ff;
}

.address-info {
    margin-bottom: 12px;
}

.recipient-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
}

.recipient-name {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
}

.recipient-phone {
    color: #6c757d;
    font-size: 14px;
}

.address-detail {
    color: #495057;
    line-height: 1.5;
    margin-bottom: 8px;
}

.address-tags {
    display: flex;
    gap: 8px;
}

.tag {
    padding: 2px 8px;
    background: #e9ecef;
    border-radius: 4px;
    font-size: 12px;
    color: #6c757d;
}

.tag.default {
    background: #4a90e2;
    color: white;
}

.address-actions {
    display: flex;
    gap: 8px;
}

.edit-btn,
.delete-btn {
    padding: 4px 8px;
    border: 1px solid #dee2e6;
    background: white;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.edit-btn:hover {
    border-color: #4a90e2;
    color: #4a90e2;
}

.delete-btn:hover {
    border-color: #dc3545;
    color: #dc3545;
}

/* 商品列表样式 */
.products-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.product-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
}

.product-image-placeholder {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6c757d;
    font-size: 12px;
    position: relative;
}

.product-image-placeholder::before {
    content: "商品图片";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 1.2;
}

.product-info {
    flex: 1;
}

.product-name {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 4px;
}

.product-spec {
    color: #6c757d;
    font-size: 14px;
}

.product-price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
}

.unit-price {
    color: #6c757d;
    font-size: 14px;
}

.quantity {
    color: #6c757d;
    font-size: 14px;
}

.total-price {
    font-size: 16px;
    font-weight: 600;
    color: #e74c3c;
}

/* 支付方式样式 */
.payment-methods {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.payment-method {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.payment-method:hover {
    border-color: #4a90e2;
}

.payment-method.active {
    border-color: #4a90e2;
    background: #f8f9ff;
}

.method-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: white;
    font-size: 14px;
}

.method-icon.alipay-icon {
    background: linear-gradient(135deg, #1677ff 0%, #0e5cd9 100%);
}

.method-icon.alipay-icon::before {
    content: "支";
}

.method-icon.wechat-icon {
    background: linear-gradient(135deg, #07c160 0%, #06a952 100%);
}

.method-icon.wechat-icon::before {
    content: "微";
}

.method-icon.bank-icon {
    background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%);
}

.method-icon.bank-icon::before {
    content: "银";
}

.method-name {
    flex: 1;
    font-size: 16px;
    font-weight: 500;
}

.method-check {
    width: 20px;
    height: 20px;
    border: 2px solid #dee2e6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.method-check .checkmark {
    width: 10px;
    height: 10px;
    background: #4a90e2;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.payment-method.active .checkmark {
    opacity: 1;
}

/* 订单信息样式 */
.order-summary {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
}

.summary-item.total {
    border-top: 1px solid #e9ecef;
    padding-top: 16px;
    margin-top: 8px;
}

.final-price {
    font-size: 24px;
    font-weight: 700;
    color: #e74c3c;
}

.discount {
    color: #28a745;
}

/* 底部操作栏样式 */
.checkout-footer {
    background: white;
    border-top: 1px solid #e9ecef;
    padding: 20px 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.price-summary {
    display: flex;
    align-items: center;
    gap: 8px;
}

.price-summary .label {
    font-size: 16px;
    color: #6c757d;
}

.price-summary .price {
    font-size: 24px;
    font-weight: 700;
    color: #e74c3c;
}

.submit-order-btn {
    padding: 12px 32px;
    background: #4a90e2;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.submit-order-btn:hover:not(:disabled) {
    background: #357abd;
    transform: translateY(-1px);
}

.submit-order-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 16px;
        text-align: center;
    }

    .checkout-main {
        padding: 20px 16px 120px;
    }

    .section {
        padding: 16px;
    }

    .address-list {
        grid-template-columns: 1fr;
    }

    .footer-content {
        flex-direction: column;
        gap: 16px;
        text-align: center;
    }

    .product-card {
        flex-direction: column;
        text-align: center;
        gap: 12px;
    }

    .product-price {
        align-items: center;
    }
}

@media (max-width: 480px) {
    .step-indicator {
        flex-wrap: wrap;
        justify-content: center;
    }

    .step-line {
        width: 30px;
    }

    .section-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }

    .address-actions {
        flex-direction: column;
    }
}

/* 弹窗样式 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #6c757d;
    cursor: pointer;
    padding: 4px;
    transition: color 0.3s ease;
}

.close-btn:hover {
    color: #dc3545;
}

.modal-body {
    padding: 0 24px 24px;
}

.address-list-modal {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
}

.address-card-modal {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 16px;
    transition: all 0.3s ease;
}

.address-card-modal:hover {
    border-color: #4a90e2;
}

.address-card-modal.active {
    border-color: #4a90e2;
    background: #f8f9ff;
}

.address-card-modal .address-actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
}

.default-btn {
    padding: 4px 8px;
    border: 1px solid #28a745;
    background: white;
    color: #28a745;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.default-btn:hover {
    background: #28a745;
    color: white;
}

.add-address-section {
    text-align: center;
    padding-top: 16px;
    border-top: 1px solid #e9ecef;
}

.add-address-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: transparent;
    border: 2px dashed #4a90e2;
    color: #4a90e2;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.add-address-btn:hover {
    background: #f8f9ff;
    border-style: solid;
}

.add-address-btn span:first-child {
    font-size: 20px;
    font-weight: bold;
}

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
        transform: translateY(30px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* 响应式弹窗样式 */
@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        max-width: none;
        margin: 20px;
    }

    .modal-header {
        padding: 16px 20px;
    }

    .modal-body {
        padding: 0 20px 20px;
    }

    .address-card-modal .address-actions {
        flex-direction: column;
    }
}
</style>