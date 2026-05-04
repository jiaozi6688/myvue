<template>
    <div class="new-address-container">
        <div class="new-address-page">
            <div class="page-header">
                <h1>添加新地址</h1>
                <p>请填写您的收货地址信息</p>
            </div>

            <div class="address-form-container">
                <form class="address-form" @submit.prevent="saveAddress">
                    <div class="form-group">
                        <label for="name" class="form-label">收货人姓名</label>
                        <input type="text" id="name" name="name" class="form-input" placeholder="请输入收货人姓名"
                            v-model="formData.name" required>
                    </div>

                    <div class="form-group">
                        <label for="phone" class="form-label">手机号码</label>
                        <input type="tel" id="phone" name="phone" class="form-input" placeholder="请输入手机号码"
                            v-model="formData.phone" required>
                    </div>

                    <div class="form-group">
                        <label for="province" class="form-label">所在地区</label>
                        <div class="region-selector">
                            <select class="region-select" id="province" v-model="formData.province">
                                <option value="">请选择省份</option>
                                <option value="北京市">北京市</option>
                                <option value="上海市">上海市</option>
                                <option value="广东省">广东省</option>
                            </select>
                            <select class="region-select" id="city" v-model="formData.city">
                                <option value="">请选择城市</option>
                                <option v-if="formData.province === '北京市'" value="北京市">北京市</option>
                                <option v-if="formData.province === '上海市'" value="上海市">上海市</option>
                                <option v-if="formData.province === '广东省'" value="广东省">广东省</option>
                            </select>
                            <select class="region-select" id="district" v-model="formData.district">
                                <option value="">请选择区县</option>
                                <option v-if="formData.city === '北京市'" value="北京市">北京市</option>
                                <option v-if="formData.city === '上海市'" value="上海市">上海市</option>
                                <option v-if="formData.city === '广东省'" value="广东省">广东省</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="address" class="form-label">详细地址</label>
                        <textarea id="address" name="address" class="form-textarea" placeholder="请输入详细地址（街道、门牌号等）" rows="3"
                            v-model="formData.detail"></textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">地址标签</label>
                        <div class="tag-selector">
                            <button type="button" class="tag-option" :class="{ active: formData.tag === 'home' }"
                                @click="formData.tag = 'home'">家</button>
                            <button type="button" class="tag-option" :class="{ active: formData.tag === 'company' }"
                                @click="formData.tag = 'company'">公司</button>
                            <button type="button" class="tag-option" :class="{ active: formData.tag === 'school' }"
                                @click="formData.tag = 'school'">学校</button>
                            <button type="button" class="tag-option" :class="{ active: formData.tag === 'other' }"
                                @click="formData.tag = 'other'">其他</button>
                        </div>
                    </div>

                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="default" name="default" class="checkbox-input"
                                v-model="formData.isDefault">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-text">设为默认地址</span>
                        </label>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="cancel-btn" @click="$router.back()">取消</button>
                        <button type="submit" class="save-btn">保存地址</button>
                    </div>
                </form>
            </div>
        </div>
        <tanchuang :showPopup="showPopup" :popupMessage="popupMessage" :type="popupType"></tanchuang>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Tanchuang from '@/components/modal/tanchuang.vue'
import { useLoginStore } from '@/pinia/loginstor'
const loginStore = useLoginStore();
const userId = computed(() => {
    if (!loginStore.userInfo) return null;
    return loginStore.userInfo.userId || loginStore.userInfo.userInfo?.userId || null;
});
const router = useRouter()
const showPopup = ref(false)
const popupMessage = ref('')
const popupType = ref('')
// 表单数据
const formData = reactive({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    tag: 'home', // 默认选择"家"标签
    isDefault: false
})
function showPopupMessage(message: string, type: string) {
    // 显示弹窗的消息
    popupMessage.value = message;
    // 显示弹窗
    showPopup.value = true;
    // 设置弹窗类型
    popupType.value = type;
}
// 保存地址的方法
const saveAddress = () => {
    try {
        // 验证必填字段
        if (!formData.name.trim()) {
            return showPopupMessage('请输入姓名', 'error')

        }

        if (!formData.phone.trim()) {
            showPopupMessage('请输入手机号', 'error')
            return
        }

        if (!formData.province.trim()) {
            showPopupMessage('请选择省份', 'error')
            return
        }

        if (!formData.city.trim()) {
            showPopupMessage('请选择城市', 'error')
            return
        }

        if (!formData.district.trim()) {
            showPopupMessage('请选择区县', 'error')
            return
        }
        
        // 检查userId是否存在
        if (!userId.value) {
            showPopupMessage('用户未登录，请先登录', 'error')
            return
        }
        
        const baseURL = 'http://127.0.0.1:3000/userads/address/';
        axios.post(`${baseURL}` + userId.value, {
            ...formData,
            userId: userId.value
        }).then(response => {
            if (response.status === 201) {
                showPopupMessage('地址保存成功！', 'success')
                return setTimeout(() => {
                    router.back()
                }, 2000);
            } else {
                return showPopupMessage(response.data.message || '保存地址失败，请重试', 'error')
            }
        })
    } catch (error: any) {
        console.error('保存地址失败:', error)
        showPopupMessage(error.message || '保存地址失败，请重试', 'error')
        return
    }

    // console.log('保存地址数据:', formData)
    // // 这里可以添加保存地址的逻辑，比如调用API
    // alert('地址保存成功！')
    // // router.back()  // 保存成功后返回上一页
    // // router.back()
}
</script>

<style scoped>
.new-address-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
}

.page-header {
    text-align: center;
    margin-bottom: 40px;
    padding-top: 20px;
}

.page-header h1 {
    font-size: 28px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 8px;
}

.page-header p {
    font-size: 16px;
    color: #6c757d;
    margin: 0;
}

.address-form-container {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.address-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-label {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 4px;
}

.form-input,
.form-textarea,
.region-select {
    padding: 12px 16px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
    background: white;
}

.form-input:focus,
.form-textarea:focus,
.region-select:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.form-textarea {
    resize: vertical;
    min-height: 80px;
}

.region-selector {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
}

.region-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236c757d' d='M6 8.825L1.175 4l.825-.825L6 7.175l4-4 .825.825z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 12px;
    padding-right: 40px;
}

.tag-selector {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.tag-option {
    padding: 8px 16px;
    border: 2px solid #e9ecef;
    background: white;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #6c757d;
    outline: none;
    /* 移除默认的焦点轮廓 */
}

.tag-option:hover {
    border-color: #4a90e2;
    color: #4a90e2;
}

/* 使用 Vue 动态类名控制的选中状态，而不是 :focus */
.tag-option.active {
    background: #4a90e2;
    border-color: #4a90e2;
    color: white;
}

.checkbox-group {
    flex-direction: row;
    align-items: center;
    gap: 12px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 8px;
}

.checkbox-input {
    display: none;
}

.checkbox-custom {
    width: 20px;
    height: 20px;
    border: 2px solid #e9ecef;
    border-radius: 4px;
    position: relative;
    transition: all 0.3s ease;
}

.checkbox-input:checked+.checkbox-custom {
    background: #4a90e2;
    border-color: #4a90e2;
}

.checkbox-input:checked+.checkbox-custom::after {
    content: '';
    position: absolute;
    left: 6px;
    top: 2px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.checkbox-text {
    font-size: 14px;
    color: #2c3e50;
}

.form-actions {
    display: flex;
    gap: 16px;
    margin-top: 24px;
}

.cancel-btn,
.save-btn {
    flex: 1;
    padding: 14px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cancel-btn {
    background: #f8f9fa;
    color: #6c757d;
    border: 2px solid #e9ecef;
}

.cancel-btn:hover {
    background: #e9ecef;
    border-color: #dee2e6;
}

.save-btn {
    background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
    color: white;
}

.save-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.save-btn:active {
    transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .new-address-page {
        padding: 16px;
    }

    .address-form-container {
        padding: 24px;
    }

    .region-selector {
        grid-template-columns: 1fr;
        gap: 8px;
    }

    .form-actions {
        flex-direction: column;
    }
}
</style>