export interface Address {
    // 地址id
    _id: string;
    userId: string;
    name: string;
    phone: string;
    // 省份
    province: string;
    // 市
    city: string;
    // 区
    district: string;
    // 详细地址
    detail: string;
    // 标签
    tag: string;
    // 是否默认地址
    isDefault: boolean;
}