import { defineStore } from 'pinia';
import { computed, watch, ref, triggerRef } from 'vue';
import axios from 'axios';
import type { CartItem, NewCartItem } from '@/type/cart';
import { useLoginStore } from '@/pinia/loginstor';

// 使用组合式API定义购物车store
export const useCartStore = defineStore('cart', () => {
    // 持久化存储相关
    const STORAGE_KEY = 'cart_data';
    const NEWGOODS_KEY = 'newgoods';
    const CART_ITEMS_KEY = 'cartItems';
    const CART_GOODS_KEY = 'cartGoods';
    const CART_VERSION_KEY = 'cartVersion';

    // 保存购物车数据到localStorage
    //也是同步购物车商品数据
    function saveToStorage() {
        try {
            // 生成新的版本号，使用时间戳+随机数避免快速点击时版本号冲突
            const version = Date.now() + Math.floor(Math.random() * 100);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(cartlist.value));
            localStorage.setItem(NEWGOODS_KEY, JSON.stringify(newgoods.value));
            localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartlist.value));
            localStorage.setItem(CART_GOODS_KEY, JSON.stringify(goods.value));
            localStorage.setItem(CART_VERSION_KEY, version.toString());

            console.log('购物车数据已保存到本地存储，版本号:', version);
        } catch (error) {
            console.warn('保存购物车数据到本地存储失败:', error);
        }
    }

    // 从localStorage读取购物车数据
    function loadFromStorage() {
        try {
            // 检查是否存在购物车商品列表数据,获取购物车商品列表长度
            const savedCartlist = localStorage.getItem(STORAGE_KEY);
            // 检查是否存在新添加商品数据
            const savedNewgoods = localStorage.getItem(NEWGOODS_KEY);
            // 检查是否存在购物车商品数据
            const savedCartItems = localStorage.getItem(CART_ITEMS_KEY);
            const savedGoods = localStorage.getItem(CART_GOODS_KEY);

            if (savedCartlist) {
                cartlist.value = JSON.parse(savedCartlist);
                console.log('从本地存储加载购物车商品列表:', cartlist.value);
            } else if (savedCartItems) {
                cartlist.value = JSON.parse(savedCartItems);
                console.log('从本地存储加载购物车商品列表 (兼容模式):', cartlist.value);
            }

            if (savedNewgoods) {
                newgoods.value = JSON.parse(savedNewgoods);
                console.log('从本地存储加载新添加商品列表:', newgoods.value);
            }

            if (savedGoods) {
                goods.value = JSON.parse(savedGoods);
                console.log('从本地存储加载结算商品列表:', goods.value);
            }
        } catch (error) {
            console.warn('从本地存储加载购物车数据失败:', error);
        }
    }

    // 记录用户新添加的商品
    const newgoods = ref<NewCartItem[]>([]);
    // 状态
    const loginStore = useLoginStore();
    // 只记录接口返回的购物车商品列表
    // 同时也可以在添加商品时更新购物车内容用于展示商品
    const cartlist = ref<CartItem[]>([]);
    // 结算商品储存数组
    const goods = ref<any[]>([]);
    // 同步状态标志位
    const isSyncing = ref(false);

    // 初始化时从localStorage加载数据
    loadFromStorage();

    // 监听购物车数据变化，自动保存
    // 分别监听cartlist和newgoods的变化
    watch(cartlist, () => {
        if (!isSyncing.value) {
            saveToStorage();
            console.log('监测到购物车商品列表变化，自动保存到本地存储');
            console.log('当前购物车商品列表:', cartlist.value);
            // 调用获取购物车商品数量的方法
            getCartLength();
        }
    }, { deep: true });

    watch(newgoods, () => {
        if (!isSyncing.value) {
            saveToStorage();
            console.log('监测到新添加商品列表变化，自动保存到本地存储');
            console.log('当前新添加的商品列表:', newgoods.value);
        }
    }, { deep: true });

    watch(goods, () => {
        if (!isSyncing.value) {
            saveToStorage();
            console.log('监测到结算商品列表变化，自动保存到本地存储');
            console.log('当前结算商品列表:', goods.value);
        }
    }, { deep: true });

    // 监听登录状态变化，登录后自动获取购物车数据
    watch(() => loginStore.islogin, (newValue, oldValue) => {
        // 当从未登录变为登录时，自动获取购物车数据
        if (newValue === true && oldValue === false) {
            console.log('检测到用户登录，自动获取购物车数据');
            getCartList();
        }
    });

    // 方法
    // 推出登录删除localStorage数据
    function clearCartData() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(NEWGOODS_KEY);
        localStorage.removeItem(CART_ITEMS_KEY);
        localStorage.removeItem(CART_GOODS_KEY);
        localStorage.removeItem(CART_VERSION_KEY);
    }



    function getCartLength() {
        return cartlist.value.length;
    }

    // 计算购物车商品总数量（包括所有商品）
    const goodslength = computed(() => cartlist.value.length);

    // 购物车商品总数量（所有商品，不区分选中状态）
    const totalItems = computed(() => {
        return cartlist.value.reduce((total, item) => total + Number(item.count), 0);
    });

    // 总数量（选中的商品）
    const allsum = computed(() => {
        // 筛选已选中商品并计算总数量
        return cartlist.value
            .filter(item => item.isChecked)
            .reduce((total, item) => total + Number(item.count), 0);
    });

    // 总价格（选中的商品）
    const allprice = computed(() => {
        // 筛选已选中商品并计算总价格
        return cartlist.value
            .filter(item => item.isChecked)
            .reduce((total, item) => total + Number(item.price) * Number(item.count), 0);
    });

    // 获取购物车数据
    function getCartList() {
        // 登录状态已在应用启动时初始化，无需重复调用
        console.log('当前登录状态:', loginStore.islogin);
        console.log('用户信息对象:', loginStore.userInfo);
        // 查找userId，考虑嵌套结构和多种可能的字段名
        let userId = null;
        if (loginStore.userInfo) {
            // 检查多种可能的userId路径
            userId = loginStore.userInfo.userId ||
                loginStore.userInfo.userInfo?.userId ||
                loginStore.userInfo.id ||
                loginStore.userInfo.userInfo?.id ||
                null;
        }

        console.log('获取到的userId:', userId);

        if (!userId) {
            console.warn('未能获取到有效userId，可能用户未登录或用户信息格式不正确');
            // 未登录时保留本地数据，不清空购物车
            return;
        }

        axios.defaults.baseURL = 'http://127.0.0.1:3000/';
        axios.get('cart/list/' + userId)
            .then(res => {
                console.log('后端返回购物车数据', res.data.data.cart);
                // 保存当前选中状态
                // 创建一个map对象，用于存储商品id和选中状态的映射关系，默认选中
                const currentCheckedState = new Map();
                cartlist.value.forEach(item => {
                    currentCheckedState.set(item.goodsId, item.isChecked);
                });
                // 直接赋值新数组，确保响应式更新
                cartlist.value = res.data.data.cart.map((item: CartItem) => ({
                    ...item,
                    isChecked: currentCheckedState.get(item.goodsId) ?? true
                }));
                // 完成之后在localStorage中保存购物车数据
                saveToStorage();
                console.log('前端购物车数据', cartlist);
            })
            // 处理请求失败
            .catch(err => {
                console.log('购物车数据获取失败', err);
                // 请求失败时保留现有数据，不清空购物车
                // 如果当前购物车为空，尝试从本地存储加载
                if (cartlist.value.length === 0) {
                    loadFromStorage();
                }
            })
    }

    function addToCart(goodsDetail: any) {
        try {
            // 检查购物车中是否已存在该商品
            const existingCartItem = cartlist.value.find(item => item.goodsId === goodsDetail._id);
            // 检查newgoods中是否已存在该商品
            const existingNewGoodsItem = newgoods.value.find(item => item.goodsId === goodsDetail._id);
            // 如果已存在，增加数量
            if (existingCartItem) {
                // 数量增加
                existingCartItem.count += 1;

                // 更新newgoods中的商品数量
                if (existingNewGoodsItem) {
                    existingNewGoodsItem.count = existingCartItem.count;
                } else {
                    // 如果newgoods中不存在，添加新记录
                    newgoods.value = [...newgoods.value, {
                        goodsId: goodsDetail._id,
                        count: existingCartItem.count,
                    }];
                }
            } else {
                // 如果不存在，添加新商品到newgoods中 ，用于记录加入购物车的商品，传回服务器
                newgoods.value = [...newgoods.value, {
                    goodsId: goodsDetail._id,
                    count: 1,
                }];

                // 同时给cartlist添加新商品,用于展示购物车商品
                cartlist.value = [...cartlist.value, {
                    goodsId: goodsDetail._id,
                    name: goodsDetail.name,
                    price: goodsDetail.price,
                    count: 1,
                    image: goodsDetail.image,
                    description: goodsDetail.description,
                    isChecked: true,
                }];
            }
            // 强制触发响应式更新
            triggerRef(newgoods);
            triggerRef(cartlist);
            return true;
        } catch (error) {
            console.error('加入购物车失败:', error);
            return false;
        }
    }

    // 删除选中商品
    function rmselectgoods() {
        // 筛选出未选中的商品（保留未选中的，删除选中的）
        const uncheckedItems = cartlist.value.filter(item => !item.isChecked);
        // 直接赋值新数组，确保响应式更新
        cartlist.value = uncheckedItems;
        console.log('已删除选中的商品');
    }

    // 切换商品选中状态
    function toggleItemCheck(goodsId: string) {
        const item = cartlist.value.find(item => item.goodsId === goodsId);
        if (item) {
            item.isChecked = !item.isChecked;
            console.log('已切换商品选中状态:', goodsId, item.isChecked);
        }
    }

    // 切换全选状态
    function toggleCheckAll() {
        const allChecked = cartlist.value.every(item => item.isChecked);
        cartlist.value.forEach(item => {
            item.isChecked = !allChecked;
        });
        console.log('已切换全选状态:', !allChecked);
    }

    // 结算支付
    function topay(paymentMethod: string) {
        // 筛选出选中的商品
        const checkedItems = cartlist.value.filter(item => item.isChecked);
        console.log('选中结算的商品:', checkedItems);
        // 发送支付请求
        if (paymentMethod === 'alipay') {
            alert('正在跳转到支付宝支付...');
        } else if (paymentMethod === 'wechat') {
            alert('正在跳转到微信支付...');
        } else if (paymentMethod === 'bank') {
            alert('正在跳转到银行卡支付...');
        }
        // 发送支付请求
        // axios.post('/pay', {
        //     userId: loginStore.userInfo.userId,
        //     goods: checkedItems
        // })
        // .then(res => {
        //     console.log('支付成功', res.data);
        //     // 清空购物车
        //     cartlist.length = 0;
        // })
        // .catch(err => {
        //     console.log('支付失败', err);
        // })
    }

    // 结算商品列表 存着被选中的商品
    const selectedGoods = computed(() => {
        return cartlist.value.filter(item => item.isChecked);
    });

    // 结算
    function checkout() {
        if (cartlist.value.length === 0) {
            alert('还没有添加商品');
            return []; // 统一返回数组，避免其他页面接收 undefined
        }
        //返回当前所选的商品
        const selectshop = cartlist.value.filter(i => i.isChecked);
        //判断结算商品的数量==0时弹窗
        if (selectshop.length === 0) {
            alert('请选择要结算的商品');
            return []; // 无选中商品时也返回空数组，方便其他页面判断
        }
        goods.value = selectshop;
        console.log('这时需要结算的物品', goods.value);
        saveToStorage();
        return selectshop;
    }

    // 从购物车移除商品
    function removeItem(goodsId: string) {
        cartlist.value = cartlist.value.filter(item => item.goodsId !== goodsId);
        newgoods.value = newgoods.value.filter(item => item.goodsId !== goodsId);
        console.log('已从购物车移除商品:', goodsId);
    }

    // 清空购物车
    function clearCart() {
        cartlist.value = [];
        newgoods.value = [];
        goods.value = [];
        console.log('购物车已清空');
    }

    // 支付方式
    async function paymethod(pay: '微信支付' | '支付宝') {
        try {
            if (pay === '微信支付') {
                console.log('用了微信');
            } else {
                console.log('支付宝');
            }
        } catch (error) {
            alert(`支付失败`);
        }
    }

    // 初始化跨窗口同步监听
    function initSync() {
        // 用于跟踪上次同步的版本号
        let lastSyncVersion = parseInt(localStorage.getItem(CART_VERSION_KEY) || '0');
        // 添加监听事件 监听本地存储变化
        window.addEventListener("storage", (e) => {
            // 只处理特定的键
            // 购物车商品列表、购物车商品、新增商品、版本号
            // 只有当购物车商品列表、购物车商品、新增商品、版本号其中一个发生变化时才同步
            if (![CART_ITEMS_KEY, CART_GOODS_KEY, NEWGOODS_KEY, CART_VERSION_KEY].includes(e.key as string)) {
                return;
            }

            // 防止循环更新
            if (isSyncing.value) {
                return;
            }

            // 检查版本号，只有当版本号更新时才同步
            const currentVersion = parseInt(localStorage.getItem(CART_VERSION_KEY) || '0');
            if (currentVersion <= lastSyncVersion) {
                return;
            }

            try {
                // 标记为正在同步
                isSyncing.value = true;

                // 批量更新所有数据，确保数据一致性
                const savedCartlist = localStorage.getItem(CART_ITEMS_KEY);
                const savedGoods = localStorage.getItem(CART_GOODS_KEY);
                const savedNewgoods = localStorage.getItem(NEWGOODS_KEY);
                // 购物车商品列表
                if (savedCartlist) {
                    const newItems = JSON.parse(savedCartlist);
                    if (JSON.stringify(newItems) !== JSON.stringify(cartlist.value)) {
                        cartlist.value = newItems;
                        triggerRef(cartlist);
                    }
                }
                // 购物车商品
                if (savedGoods) {
                    const newGoods = JSON.parse(savedGoods);
                    if (JSON.stringify(newGoods) !== JSON.stringify(goods.value)) {
                        goods.value = newGoods;
                        triggerRef(goods);
                    }
                }
                // 新增商品
                if (savedNewgoods) {
                    const newNewGoods = JSON.parse(savedNewgoods);
                    if (JSON.stringify(newNewGoods) !== JSON.stringify(newgoods.value)) {
                        newgoods.value = newNewGoods;
                        triggerRef(newgoods);
                    }
                }

                // 更新上次同步的版本号
                lastSyncVersion = currentVersion;
                console.log('同步完成，更新版本号:', lastSyncVersion);

            } catch (error) {
                console.error("同步购物车数据失败:", error);
            } finally {
                // 确保无论如何都会重置标志位
                setTimeout(() => {
                    isSyncing.value = false;
                }, 0);
            }
        });
    }

    // 注意：在Pinia store中不应该直接使用onMounted
    // 组件在需要时调用getCartList()方法
    // 这里只导出方法供组件使用
    return {
        // 记录用户新添加的商品
        newgoods,
        // 状态管理
        loginStore,
        // 购物车内容
        cartlist,
        // 结算商品储存数组
        goods,
        // 同步状态标志位
        isSyncing,
        // 购物车商品数量
        getCartLength,
        // 响应式购物车商品数量
        goodslength,
        // 购物车商品总数量（所有商品，不区分选中状态）
        totalItems,
        // 总数量（选中的商品）
        allsum,
        // 总价格（选中的商品）
        allprice,
        // 获取购物车列表
        getCartList,
        // 从本地存储加载数据
        loadFromStorage,
        // 删除选中商品
        rmselectgoods,
        // 结算支付
        topay,
        // 添加商品到购物车
        addToCart,
        // 结算商品列表
        selectedGoods,
        // 切换商品选中状态
        toggleItemCheck,
        // 切换全选状态
        toggleCheckAll,
        // 结算
        checkout,
        // 从购物车移除商品
        removeItem,
        // 清空购物车
        clearCart,
        // 支付方式
        paymethod,
        // 初始化跨窗口同步监听
        initSync,
        // 推出登录删除localStorage数据
        clearCartData,
    }
});

// 购物车初始化函数
export function setupCart() {
    const cartStore = useCartStore();
    cartStore.loadFromStorage();
    cartStore.initSync();
}