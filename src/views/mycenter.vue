<template>
    <div class="mycenter-container">
        <!-- 顶部导航栏 -->
        <header class="header">
            <div class="header-content">
                <h1 class="logo">个人中心</h1>
                <!-- 购物车功能 -->
                <div class="cart-icon">
                    <router-link to="/cart">
                        <span class="cart-badge">{{ cartStore.cartlength }}</span>
                        <svg class="cart-svg" viewBox="0 0 24 24">
                            <path
                                d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                    </router-link>
                </div>
            </div>
        </header>

        <!-- 个人信息展示区域 -->
        <section class="user-profile">
            <div class="profile-card">
                <div class="avatar-section">
                    <img src="/1bde467bd1f2ad1227592b995a2c364d.jpg" alt="用户头像" class="user-avatar">
                    <div class="vip-badge">VIP</div>
                </div>
                <div class="user-info">
                    <h2 class="username">张三</h2>
                    <p class="user-level">黄金会员</p>
                    <div class="user-stats">
                        <div class="stat-item">
                            <span class="stat-number">128</span>
                            <span class="stat-label">积分</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">15</span>
                            <span class="stat-label">优惠券</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 订单状态快捷入口 -->
        <section class="order-section">
            <h3 class="section-title">我的订单</h3>
            <div class="order-grid">
                <div class="order-item">
                    <div class="order-icon">
                        <svg viewBox="0 0 24 24">
                            <path
                                d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                        </svg>
                        <span class="order-badge">2</span>
                    </div>
                    <span class="order-label">待付款</span>
                </div>
                <div class="order-item">
                    <div class="order-icon">
                        <svg viewBox="0 0 24 24">
                            <path
                                d="M20 8h-3V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10h20V10c0-1.1-.9-2-2-2zm-5 0H9V6h6v2z" />
                        </svg>
                        <span class="order-badge">5</span>
                    </div>
                    <span class="order-label">待收货</span>
                </div>
                <div class="order-item">
                    <div class="order-icon">
                        <svg viewBox="0 0 24 24">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <span class="order-badge">3</span>
                    </div>
                    <span class="order-label">待评价</span>
                </div>
                <div class="order-item">
                    <div class="order-icon">
                        <svg viewBox="0 0 24 24">
                            <path
                                d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
                        </svg>
                        <span class="order-badge">1</span>
                    </div>
                    <span class="order-label">退款/售后</span>
                </div>
                <div class="order-item">
                    <div class="order-icon">
                        <svg viewBox="0 0 24 24">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>
                    <span class="order-label">全部订单</span>
                </div>
            </div>
        </section>

        <!-- 浏览记录功能 -->
        <section class="history-section">
            <div class="section-header">
                <h3 class="section-title">浏览记录</h3>
                <span class="history-count">最近浏览：8件商品</span>
            </div>
            <div class="history-preview">
                <div class="history-item" v-for="i in 3" :key="i">
                    <img src="/1bde467bd1f2ad1227592b995a2c364d.jpg" alt="浏览商品" class="history-image">
                    <div class="history-info">
                        <p class="history-name">商品名称 {{ i }}</p>
                        <p class="history-price">￥{{ i * 100 + 99 }}</p>
                    </div>
                </div>
            </div>
            <button class="view-all-btn">查看全部浏览记录</button>
        </section>

        <!-- 设置功能 -->
        <section class="settings-section">
            <!-- 客服对话 -->
            <router-link to="/chat" class="settings-item">
                <div class="settings-icon">
                    <svg viewBox="0 0 24 24">
                        <path
                            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12zm-2-5h-2V9h2v2zm-4 0H8V9h6v2z" />
                    </svg>
                </div>
                <span class="settings-label">在线客服</span>
                <span class="settings-arrow">›</span>
            </router-link>
            <!-- 设置 -->
            <div class="settings-item">
                <div class="settings-icon">
                    <svg viewBox="0 0 24 24">
                        <path
                            d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                    </svg>
                </div>
                <span class="settings-label">设置</span>
                <span class="settings-arrow">›</span>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
// 引入购物车store
import { useCartStore } from '@/pinia/Cartstor'
const cartStore = useCartStore()


</script>

<style scoped>
/* 基础样式重置 */
.mycenter-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 顶部导航栏样式 */
.header {
    background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
    padding: 15px 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    color: white;
    font-size: 24px;
    font-weight: 600;
    margin: 0;
}

.cart-icon {
    position: relative;
    cursor: pointer;
    padding: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
}

.cart-icon:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.cart-svg {
    width: 24px;
    height: 24px;
    fill: white;
}

.cart-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff4757;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

/* 个人信息展示区域 */
.user-profile {
    padding: 30px 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.profile-card {
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 25px;
    transition: transform 0.3s ease;
}

.profile-card:hover {
    transform: translateY(-5px);
}

.avatar-section {
    position: relative;
}

.user-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid #4a90e2;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.user-avatar:hover {
    transform: scale(1.05);
}

.vip-badge {
    position: absolute;
    bottom: 0;
    right: 0;
    background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
    color: #8b4513;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.user-info {
    flex: 1;
}

.username {
    font-size: 28px;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 5px 0;
}

.user-level {
    color: #7f8c8d;
    font-size: 16px;
    margin: 0 0 15px 0;
}

.user-stats {
    display: flex;
    gap: 30px;
}

.stat-item {
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: #4a90e2;
}

.stat-label {
    font-size: 14px;
    color: #7f8c8d;
}

/* 订单状态快捷入口 */
.order-section {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.section-title {
    font-size: 22px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 20px;
    position: relative;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
    border-radius: 2px;
}

.order-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
}

.order-item {
    background: white;
    border-radius: 15px;
    padding: 20px 15px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    position: relative;
}

.order-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.order-icon {
    position: relative;
    margin-bottom: 10px;
}

.order-icon svg {
    width: 32px;
    height: 32px;
    fill: #4a90e2;
}

.order-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ff4757;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.order-label {
    font-size: 14px;
    font-weight: 500;
    color: #2c3e50;
}

/* 浏览记录功能 */
.history-section {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.history-count {
    color: #7f8c8d;
    font-size: 14px;
}

.history-preview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.history-item {
    background: white;
    border-radius: 12px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.history-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
}

.history-image {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
}

.history-name {
    font-size: 14px;
    font-weight: 500;
    color: #2c3e50;
    margin: 0 0 5px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.history-price {
    font-size: 16px;
    font-weight: 600;
    color: #e74c3c;
    margin: 0;
}

.view-all-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.view-all-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
}

/* 设置功能 */
.settings-section {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.settings-item {
    background: white;
    border-radius: 15px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.settings-item:hover {
    transform: translateX(5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.settings-icon svg {
    width: 24px;
    height: 24px;
    fill: #4a90e2;
}

.settings-label {
    flex: 1;
    font-size: 18px;
    font-weight: 500;
    color: #2c3e50;
}

.settings-arrow {
    font-size: 24px;
    color: #bdc3c7;
    font-weight: 300;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .profile-card {
        flex-direction: column;
        text-align: center;
        padding: 20px;
    }

    .user-stats {
        justify-content: center;
    }

    .order-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .history-preview {
        grid-template-columns: repeat(2, 1fr);
    }

    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
}

@media (max-width: 480px) {
    .header {
        padding: 10px 15px;
    }

    .logo {
        font-size: 20px;
    }

    .user-avatar {
        width: 80px;
        height: 80px;
    }

    .username {
        font-size: 24px;
    }

    .order-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .history-preview {
        grid-template-columns: 1fr;
    }
}

/* 动画效果 */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.profile-card,
.order-item,
.history-item,
.settings-item {
    animation: fadeInUp 0.6s ease-out;
}

.order-item:nth-child(2) {
    animation-delay: 0.1s;
}

.order-item:nth-child(3) {
    animation-delay: 0.2s;
}

.order-item:nth-child(4) {
    animation-delay: 0.3s;
}

.order-item:nth-child(5) {
    animation-delay: 0.4s;
}

.history-item:nth-child(2) {
    animation-delay: 0.1s;
}

.history-item:nth-child(3) {
    animation-delay: 0.2s;
}
</style>