// 购物车数据类型
export interface CartItem {
    goodsId: string;
    // 商品名称
    name: string;
    // 商品价格（后端可能返回字符串，所以使用联合类型）
    price: number | string;
    // 商品数量（后端可能返回字符串，所以使用联合类型）
    count: number;
    // 商品图片
    image: string;
    // 商品描述（可选）
    description?: string;
    // 商品是否选中（前端添加的属性）
    isChecked: boolean;
}
export interface NewCartItem {
    goodsId: string;
    count: number | string;
}
