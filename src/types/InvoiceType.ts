export interface InvoiceType {
    id: string; // InvoiceData.Id
    invoice_id: number; // InvoiceData.Invoice_Id
    invoice_key: string; // InvoiceData.Invoice_Key
    payment_data?: string | null; // InvoiceData.PaymentData
    status: string; // PaymentInvoice.Status
    createdAt: string;

    order: {
        totalAmount: number;
        shippingAddress?: string;
        paymentMethod: string;
        orderItems: {
            id: string;
            productName: string;
            quantity: number;
            price: number;
        }[];
    };
}
