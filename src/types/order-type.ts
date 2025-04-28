import OrderItemType from "./order-item-type";

export default interface OrderType {
    id: string;
    userId: string;
    totalAmount: number;
    orderItems: OrderItemType[];
    paymentMethod: string;
    shippingAddress: string;
    shippingPrice: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}