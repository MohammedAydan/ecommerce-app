import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import OrderType from "@/types/order-type";
import OrderItemType from "@/types/order-item-type"; // Make sure this import path is correct

interface OrderDetailsDialogProps {
    order: OrderType | undefined;
    isOpen: boolean;
    onClose: () => void;
}

export const OrderDetailsDialog = ({
    order,
    isOpen,
    onClose,
}: OrderDetailsDialogProps) => {
    if (!order) {
        return null;
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'default';
            case 'processing':
                return 'secondary';
            case 'cancelled':
                return 'destructive';
            case 'shipped':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Using date-fns for more flexible date formatting, as suggested previously

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold">Order Details #{order.id}</DialogTitle>
                    <DialogDescription>
                        Comprehensive information about this order.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm font-medium text-gray-500">Order ID:</p>
                        <p className="text-sm font-semibold">{order.id}</p>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm font-medium text-gray-500">User ID:</p>
                        <p className="text-sm font-semibold">{order.userId}</p>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm font-medium text-gray-500">Total Amount:</p>
                        <p className="text-sm font-semibold">{formatCurrency(order.totalAmount)}</p>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm font-medium text-gray-500">Status:</p>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize w-fit">
                            {order.status.toLowerCase()}
                        </Badge>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm font-medium text-gray-500">Payment Method:</p>
                        <p className="text-sm font-semibold capitalize">{order.paymentMethod.toLowerCase()}</p>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm font-medium text-gray-500">Shipping Address:</p>
                        <p className="text-sm font-semibold">{order.shippingAddress}</p>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm font-medium text-gray-500">Shipping Price:</p>
                        <p className="text-sm font-semibold">{formatCurrency(order.shippingPrice)}</p>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm font-medium text-gray-500">Created At:</p>
                        <p className="text-sm font-semibold">
                            {formatDate(order.createdAt)}
                        </p>
                    </div>
                    {order.updatedAt && (
                        <div className="grid grid-cols-2 items-center gap-4">
                            <p className="text-sm font-medium text-gray-500">Last Updated:</p>
                            <p className="text-sm font-semibold">
                                {formatDate(order.updatedAt)}
                            </p>
                        </div>
                    )}

                    <div className="mt-4">
                        <h3 className="text-lg font-bold mb-2 border-b pb-2">Order Items</h3>
                        {order.orderItems.length > 0 ? (
                            <div className="space-y-4">
                                {order.orderItems.map((item: OrderItemType, index: number) => (
                                    <div key={item.id || index} className="border p-3 rounded-md shadow-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-semibold text-base">{item.productName}</p>
                                            <p className="font-semibold text-base">{formatCurrency(item.price * item.quantity)}</p>
                                        </div>
                                        <div className="text-sm text-gray-600 grid grid-cols-2 gap-1">
                                            <p>Product ID: {item.productId}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Unit Price: {formatCurrency(item.price)}</p>
                                            {/* Display ProductDtoType details if available */}
                                            {item.product && (
                                                <>
                                                    <p>Product SKU: {item.product.sku}</p>
                                                    <p>Product Category: {item.product.categoryId}</p>
                                                    {item.product.description && <p>Description: {item.product.description}</p>}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No items found for this order.</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};