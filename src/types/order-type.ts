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

    paymentStatus: string;
    invoiceId: string;
    invoiceKey: string;
    referenceNumber: string;

    createdAt: string;
    updatedAt: string;
}

export interface OrderDtoType {
    id: string;
    totalAmount: number;
    paymentMethod: string;
    shippingAddress: string;
    shippingPrice: number;
    status: string;
    paymentStatus: string;
    invoiceId: string;
    invoiceKey: string;
    referenceNumber: string;
}