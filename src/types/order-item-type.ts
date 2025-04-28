import { ProductDtoType } from "./product-type";

export default interface OrderItemType {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    product: ProductDtoType;
    price: number;
    orderId: string;
}