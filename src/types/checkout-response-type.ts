/**
 * {
    "code": 200,
    "message": "Order created successfully",
    "orderId": "a69a9c72-3b70-4f0e-9382-7d5e0761b964",
    "totalAmount": 699.99,
    "paymentMethod": "CashOnDelivery"
}
 */

export default interface CheckoutResponseType {
    code: number | null;
    message: string | null;
    orderId: string | null;
    totalAmount: number | null;
    paymentMethod: string | null;
}