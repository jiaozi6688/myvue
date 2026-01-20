export interface AddGoods {
    userId: {
        type: String,
        required: true,//必填字段
    },
    // 商品ID
    goodsId: {
        type: String,
        unique: true,//商品ID唯一 unique:true 表示商品ID不能重复
    },
    name: String,
    price: Number,
    // 商品库存
    count: Number,
    image: String,
    //商品描述
    description: {
        type: String,
        default: ''//默认值为空字符串
    },
}