<template>
    <div class="add-goods-container">
        <div class="header">
            <h1>添加商品</h1>
            <p>请填写商品信息，带 * 的为必填项</p>
        </div>

        <div class="form-container">
            <form @submit.prevent="submitGoods">
                <!-- 商品名称 -->
                <div class="form-group">
                    <label for="name">商品名称 *</label>
                    <input type="text" id="name" v-model="goodsData.name" placeholder="请输入商品名称" required>
                </div>

                <!-- 商品价格 -->
                <div class="form-group">
                    <label for="price">商品价格 *</label>
                    <input type="number" id="price" v-model="goodsData.price" placeholder="请输入商品价格" min="0" step="0.01"
                        required>
                </div>

                <!-- 商品库存 -->
                <div class="form-group">
                    <label for="count">商品库存 *</label>
                    <input type="number" id="count" v-model="goodsData.count" placeholder="请输入商品库存" min="0" required>
                </div>

                <!-- 商品图片 -->
                <div class="image-upload">
                    <!-- for="image"
                      关联label和input 中的id字段 关联起来，
                      点击label也可以触发文件选择对话框 -->
                    <label for="image">{{ goodsData.image ? '重新选择图片' : '上传商品图片' }}</label>
                    <input id="image" type="file" @change="handleImageChange" ref="fileInput">
                    <div class="image-preview" @click="toggleImageUpload" v-if="goodsData.image">
                        <img :src="goodsData.image" alt="商品图片预览">
                    </div>
                </div>

                <!-- 商品描述 -->
                <div class="form-group">
                    <label for="description">商品描述</label>
                    <textarea id="description" v-model="goodsData.description" placeholder="请输入商品描述"
                        rows="4"></textarea>
                </div>

                <!-- 提交按钮 -->
                <div class="form-actions">
                    <button type="submit" class="submit-btn" :disabled="isSubmitting">
                        {{ isSubmitting ? '提交中...' : '添加商品' }}
                    </button>
                    <button type="button" class="reset-btn" @click="resetForm">重置</button>
                </div>
            </form>
        </div>

        <!-- 弹窗组件 -->
        <tanchuang :showPopup="showPopup" :popupMessage="popupMessage" :type="popupType" @close="showPopup = false">
        </tanchuang>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Tanchuang from '@/components/modal/tanchuang.vue'
import { useLoginStore } from '@/pinia/loginstor'
// 文件输入框的ref
const fileInput = ref<HTMLInputElement | null>(null)
// 保存用户选择的原始文件对象
const selectedFile = ref<File | null>(null)

// 登录状态管理
const loginStore = useLoginStore()

// 弹窗设置
const showPopup = ref(false)
const popupMessage = ref('')
const popupType = ref('success')




const isSubmitting = ref(false)
// 商品数据
const goodsData = ref({
    name: '',
    price: 0,
    count: 0,
    image: '',
    description: ''
})


// 点击切换图片上传区域
function toggleImageUpload(e: any) {
    if (fileInput.value) {
        //  fileInput.value.click()
        // 是点击文件输入框，触发文件选择对话框
        // 点击图片预览区域也可以触发文件选择对话框
        //其实就是相当于点击了上传商品图片这个按钮
        fileInput.value.click();
    }

}






// 处理图片上传
async function handleImageChange(e: any) {
    // 1. 检查是否有文件被选择 选择了文件，将文件赋值给 selectedFile 变量
    const file = e.target.files[0]
    // 验证文件是否存在  如果不存在，直接返回 
    if (!file) {
        return
    }

    // 1. 验证文件类型（只允许图片）
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    // includes() 方法用于检查数组或字符串是否包含指定的元素或子字符串。
    // 如果包含，返回 true；否则返回 false。
    if (!allowedTypes.includes(file.type)) {
        showPopupMessage('只支持 JPG、PNG、GIF、WEBP 格式的图片', 'error')
        clearFileInput()
        return
    }

    // 2. 验证文件大小（限制 5MB）
    const maxFileSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxFileSize) {
        showPopupMessage('图片大小不能超过 5MB', 'error')
        // 清空文件输入框
        clearFileInput()
        return
    }

    // 3. 显示图片预览
    // new FileReader() 创建一个新的 FileReader 对象，用于读取文件内容。
    // onload 事件在文件读取完成后触发，将读取到的结果赋值给 e.target.result。
    // readAsDataURL(file) 方法将文件读取为 DataURL 格式的 Base64 编码字符串。
    // 这是一种将文件内容转换为可在浏览器中显示的格式的方法。
    const reader = new FileReader()
    reader.onload = (e: any) => {
        goodsData.value.image = e.target.result
        // 4. 保存用户选择的原始文件对象
        selectedFile.value = file
    }
    reader.readAsDataURL(file)
}

// 清空文件或图片输入框
function clearFileInput() {
    if (fileInput.value) {
        fileInput.value.value = ''
    }
    goodsData.value.image = ''
}

// 显示弹窗
function showPopupMessage(message: string, type: string) {
    // 立即显示弹窗，不检查之前的定时器
    popupMessage.value = message;
    popupType.value = type;
    showPopup.value = true;
    // 设置定时器自动关闭弹窗
}

// 提交商品
async function submitGoods() {
    // 验证必填字段
    if (!goodsData.value.name.trim()) {
        showPopupMessage('请输入商品名称', 'error')
        return
    }
    // 验证商品价格（必须大于0）
    if (goodsData.value.price <= 0) {
        showPopupMessage('请输入有效的商品价格', 'error')
        return
    }
    // 验证商品库存（必须大于等于0）
    if (goodsData.value.count < 0) {
        showPopupMessage('请输入有效的商品库存', 'error')
        return
    }

    isSubmitting.value = true

    try {
        // 获取当前用户ID（从登录状态或localStorage）
        const userInfo = loginStore.userInfo.userInfo
        const userId = userInfo.userId

        if (!userInfo.userId) {
            showPopupMessage('用户信息获取失败，请重新登录', 'error')
            isSubmitting.value = false
            return
        }

        // 生成商品ID（这里可以改为后端生成）
        const goodsId = 'G' + Date.now() + Math.random().toString(36).substr(2, 9)

        // 构建提交数据
        const submitData: any = {
            userId: userId,
            goodsId: goodsId,
            name: goodsData.value.name.trim(),
            price: Number(goodsData.value.price),
            count: Number(goodsData.value.count),
            description: goodsData.value.description.trim() || '',
            role: userInfo.role
        }

        // 使用 FormData 上传文件和商品数据
        const formData = new FormData()
        // 添加文件到 FormData
        if (selectedFile.value) {
            // append() 方法用于向 FormData 对象添加新的键值对。
            // 第一个参数是键名，第二个参数是键值。
            formData.append('image', selectedFile.value)
            console.log('添加文件到 FormData:', selectedFile.value.name)
        } else {
            showPopupMessage('请选择商品图片', 'error')
            isSubmitting.value = false
            return
        }
        // 使用 forEach 遍历 submitData 对象的键值对
        // key值就是 submitData中  UserId：userId  的第一个userId   第二个UserId是 value
        Object.entries(submitData).forEach(([key, value]) => {
            console.log(key, ':', value)
            // 添加商品数据到 FormData
            formData.append(key, String(value))
            // 注意：如果值是数字，需要转换为字符串才能正确提交 所以这里统一转换为字符串
        })
        // 打印 FormData 内容（调试用）
        for (let [key, value] of formData.entries()) {
            console.log('FormData 键值对:', key, ':', value)
        }

        // 发送POST请求添加商品（使用 FormData）
        await axios.post('http://127.0.0.1:3000/admingoods/addgoods' + `/${userId}/${userInfo.role}`, formData,
            {
                // 设置请求头为 multipart/form-data 以支持文件上传
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then((res) => {
            console.log('响应状态码:', res.data.code); // 添加调试信息
            if (res.data.code === 200) {
                resetForm();
                console.log('表单重置完成'); // 添加调试信息
                showPopupMessage('商品添加成功！', 'success')
            } else {
                showPopupMessage(res.data.message || '添加失败，请重试', 'error')
            }
        }).catch((err) => {
            console.error('请求失败:', err); // 添加错误捕获
        })
    } catch (error: any) {
        console.error('添加商品失败:', error)
        showPopupMessage(error.response?.data?.message || '添加失败，请检查网络连接', 'error')
    } finally {
        isSubmitting.value = false
    }
}

// 重置表单
function resetForm() {
    goodsData.value.name = ''
    goodsData.value.price = 0
    goodsData.value.count = 0
    goodsData.value.image = ''
    goodsData.value.description = ''
    clearFileInput()
}
</script>

<style scoped>
.add-goods-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.header {
    text-align: center;
    margin-bottom: 40px;
}

.header h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 10px;
    font-weight: 600;
}

.header p {
    font-size: 1.1rem;
    color: #7f8c8d;
}

.form-container {
    background: white;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 30px;
}

.form-group label {
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e6ed;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-group textarea {
    resize: vertical;
    min-height: 100px;
}

.upload-btn {
    display: inline-block;
    padding: 8px 16px;
    background: #3498db;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}

.upload-btn:hover {
    background: #2980b9;
}

.image-preview {
    margin-top: 10px;
}

.image-preview img {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    border: 2px solid #e0e6ed;
}

/* 图片上传区域样式 */
.image-upload {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 2px dashed #e0e6ed;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 20px;
}

/* 设置nput[type="file"]display: none; 
是为了隐藏默认的文件选择按钮， */
.image-upload input[type="file"] {
    display: none;
}

/* 上传按钮样式 */
.image-upload label {
    position: relative;
    display: inline-flex;
    padding: 6px 18px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.image-upload label:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.image-upload label:active {
    transform: translateY(0);
}

/* 图片预览容器 */
.image-preview {
    margin-top: 15px;
    padding: 15px;
    border: 2px dashed #e0e6ed;
    border-radius: 12px;
    background: #f8f9fa;
    display: inline-block;
    transition: all 0.3s ease;
}

.image-preview:hover {
    border-color: #667eea;
    background: #f0f4ff;
}

.image-preview img {
    max-width: 300px;
    max-height: 300px;
    border-radius: 8px;
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.image-preview img:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* 预览区域提示文字 */
.image-preview::after {
    content: '点击图片可更换';
    display: block;
    text-align: center;
    margin-top: 10px;
    font-size: 0.9rem;
    color: #667eea;
    font-weight: 500;
}








/* 提交按钮和重置按钮容器 */
.form-actions {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 40px;
}

.submit-btn,
.reset-btn {
    padding: 12px 30px;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 120px;
}

.submit-btn {
    background: linear-gradient(45deg, #3498db, #2980b9);
    color: white;
}

.submit-btn:hover:not(:disabled) {
    background: linear-gradient(45deg, #2980b9, #2471a3);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.submit-btn:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
}

.reset-btn {
    background: #95a5a6;
    color: white;
}

.reset-btn:hover {
    background: #7f8c8d;
    transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .add-goods-container {
        padding: 20px 15px;
    }

    .form-container {
        padding: 30px 20px;
    }

    .header h1 {
        font-size: 2rem;
    }

    .form-actions {
        flex-direction: column;
        gap: 15px;
    }

    .submit-btn,
    .reset-btn {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .header h1 {
        font-size: 1.8rem;
    }

    .form-container {
        padding: 20px 15px;
    }

    .form-group input,
    .form-group textarea {
        padding: 10px 12px;
    }
}
</style>