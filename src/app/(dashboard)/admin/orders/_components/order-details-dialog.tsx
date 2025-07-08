// order details dialog component
"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import OrderType from "@/types/order-type";
import OrderItemType from "@/types/order-item-type"; // Ensure this path is correct
import { useQuery } from "@tanstack/react-query"; // Import useQuery from React Query
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state
import { apiBaseUrl } from "@/app/utils/strings";
import { getAccessToken } from "@/lib/api";
import { Button } from "@/components/ui/button"; // Import Button component
import { Printer } from "lucide-react"; // Import Printer icon
import { format } from "date-fns"; // Import format from date-fns

// Define UserType interface based on the provided API response
interface UserType {
    id: string;
    userName: string;
    email: string;
    imageUrl: string | null;
    country: string;
    city: string;
    address: string;
    phoneNumber: string;
    roles: string[];
    lastSignIn: string;
    createdAt: string | null;
    updatedAt: string | null;
}

interface OrderDetailsDialogProps {
    order: OrderType | undefined; // Initial order data, primarily for ID
    isOpen: boolean;
    onClose: () => void;
}

export const OrderDetailsDialog = ({
    order,
    isOpen,
    onClose,
}: OrderDetailsDialogProps) => {
    const orderId = order?.id;
    const shouldFetchOrder = isOpen && !!orderId;

    // Use React Query's useQuery hook to fetch order details
    const { data: fetchedOrder, isLoading: isLoadingOrder, error: orderError } = useQuery<OrderType, Error>({
        queryKey: ['orderDetails', orderId], // Unique key for this query, includes orderId for caching
        queryFn: async () => {
            if (!orderId) {
                throw new Error("Order ID is required to fetch details.");
            }
            const response = await fetch(`${apiBaseUrl}/api/v1/orders/${orderId}?includeProducts=true&page=1&limit=200`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? '',
                    'Authorization': `Bearer ${getAccessToken() ?? ''}`
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch order details: ${response.statusText}`);
            }
            console.log("Fetched order ID:", order.id);
            return response.json();
        },
        enabled: shouldFetchOrder, // Enable query only when dialog is open and orderId exists
        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
        refetchOnWindowFocus: false, // Prevent refetching on window focus for this dialog
    });

    const displayOrder = fetchedOrder || order;

    // Fetch user data based on displayOrder.userId
    const userId = displayOrder?.userId;
    const shouldFetchUser = isOpen && !!userId;

    const { data: fetchedUser, isLoading: isLoadingUser, error: userError } = useQuery<UserType, Error>({
        queryKey: ['userDetails', userId],
        queryFn: async () => {
            if (!userId) {
                throw new Error("User ID is required to fetch details.");
            }
            const response = await fetch(`${apiBaseUrl}/api/v1/User/user/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? '',
                    'Authorization': `Bearer ${getAccessToken() ?? ''}`
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch user details: ${response.statusText}`);
            }
            return response.json();
        },
        enabled: shouldFetchUser,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const displayUser = fetchedUser; // Use fetchedUser for display

    if (!displayOrder) {
        return null;
    }

    /**
     * Determines the appropriate badge variant based on order status.
     * @param status The order status string.
     * @returns Tailwind CSS badge variant.
     */
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

    /**
     * Formats a number as a USD currency string.
     * @param amount The numerical amount to format.
     * @returns Formatted currency string.
     */
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    /**
     * Formats a date string into a readable date and time format.
     * @param dateString The date string to format.
     * @returns Formatted date and time string, or 'N/A' if invalid.
     */

    const formatDateTime = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'PPP - hh:mm a'); // Example: Jan 1, 2023 - 01:00 PM
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString; // Return original if formatting fails
        }
    };


    /**
     * Generates the HTML content for printing the invoice (basic details only).
     * @param orderData The order data to include in the invoice.
     * @param userData The user data to include in the invoice.
     * @returns HTML string for the invoice.
     */
    const generateInvoiceContent = (orderData: OrderType, userData?: UserType) => {
        return `
            <div class="receipt-container p-8 bg-white text-gray-800 font-sans leading-relaxed">
                <div class="text-center mb-8">
                    <h1 class="text-4xl font-extrabold text-blue-700 mb-2">Invoice</h1>
                    <p class="text-lg text-gray-600">Order #${orderData.id}</p>
                </div>

                ${userData ? `
                <div class="mb-8 p-6 bg-purple-50 rounded-lg shadow-sm">
                    <h3 class="text-xl font-bold text-purple-800 mb-4 border-b pb-2">Customer Details</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
                        <p><span class="font-semibold">Name:</span> ${userData.userName}</p>
                        <p><span class="font-semibold">Email:</span> ${userData.email}</p>
                        <p><span class="font-semibold">Phone:</span> ${userData.phoneNumber}</p>
                        <p><span class="font-semibold">Address:</span> ${userData.address}, ${userData.city}, ${userData.country}</p>
                    </div>
                </div>
                ` : ''}

                <div class="mb-8 p-6 bg-blue-50 rounded-lg shadow-sm">
                    <h3 class="text-xl font-bold text-blue-800 mb-4 border-b pb-2">Order Summary</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
                        <div>
                            <p><span class="font-semibold">Order ID:</span> ${orderData.id}</p>
                            <p><span class="font-semibold">User ID:</span> ${orderData.userId}</p>
                            <p><span class="font-semibold">Payment Method:</span> <span class="capitalize">${orderData.paymentMethod.toLowerCase()}</span></p>
                            <p><span class="font-semibold">Status:</span> <span class="capitalize">${orderData.status.toLowerCase()}</span></p>
                            <p><span class="font-semibold">Invoice Id:</span> <span class="capitalize">${orderData.invoiceId}</span></p>
                            <p><span class="font-semibold">Payment Status:</span> <span class="capitalize">${orderData.paymentStatus.toLowerCase()}</span></p>
                        </div>
                        <div>
                            <p><span class="font-semibold">Created At:</span> ${formatDateTime(orderData.createdAt)}</p>
                            ${orderData.updatedAt ? `<p><span class="font-semibold">Last Updated:</span> ${formatDateTime(orderData.updatedAt)}</p>` : ''}
                            <p><span class="font-semibold">Shipping Address:</span> ${orderData.shippingAddress}</p>
                        </div>
                    </div>
                </div>

                <div class="mb-8 p-6 bg-green-50 rounded-lg shadow-sm">
                    <h3 class="text-xl font-bold text-green-800 mb-4 border-b pb-2">Financial Details</h3>
                    <div class="grid grid-cols-2 gap-4 text-base">
                        <p class="font-semibold text-lg">Subtotal:</p>
                        <p class="text-lg text-right">${formatCurrency(orderData.totalAmount - orderData.shippingPrice)}</p>
                        <p class="font-semibold text-lg">Shipping Price:</p>
                        <p class="text-lg text-right">${formatCurrency(orderData.shippingPrice)}</p>
                        <p class="font-extrabold text-xl text-blue-700">Total Amount:</p>
                        <p class="font-extrabold text-xl text-blue-700 text-right">${formatCurrency(orderData.totalAmount)}</p>
                    </div>
                </div>

                <div class="text-center mt-12 text-gray-500 text-sm">
                    <p>Thank you for your order!</p>
                    <p>For support, please contact us at mohammedaydan12@gmail.com</p>
                </div>
            </div>
        `;
    };

    /**
     * Generates the HTML content for printing the invoice with full product details.
     * @param orderData The order data to include in the invoice.
     * @param userData The user data to include in the invoice.
     * @returns HTML string for the invoice with products.
     */
    const generateInvoiceWithProductsContent = (orderData: OrderType, userData?: UserType) => {
        console.log(orderData.orderItems);
        const itemsHtml = orderData.orderItems && orderData.orderItems.length > 0 ?
            orderData.orderItems.map((item: OrderItemType) => `
                <div class="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-bold text-lg text-gray-900">${item.product.productName}</h4>
                        <p class="font-bold text-lg text-blue-700">${formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-sm text-gray-700">
                        <p><span class="font-medium">Product ID:</span> ${item.productId}</p>
                        <p><span class="font-medium">Quantity:</span> ${item.quantity}</p>
                        <p><span class="font-medium">Unit Price (After Discount):</span> ${formatCurrency(item.price)}</p>
                        ${item.product ? `
                            <p><span class="font-medium">Original Price:</span> ${formatCurrency(item.product.price ?? 0)}</p>
                            <p><span class="font-medium">SKU:</span> ${item.product.sku}</p>
                            <p><span class="font-medium">Category ID:</span> ${item.product.categoryId}</p>
                            ${item.product.description ? `<p><span class="font-medium">Description:</span> ${item.product.description}</p>` : ''}
                            ${typeof item.product.discount === 'number' ? `<p><span class="font-medium">Discount:</span> ${item.product.discount}%</p>` : ''}
                            ${typeof item.product.stockQuantity === 'number' ? `<p><span class="font-medium">Stock:</span> ${item.product.stockQuantity}</p>` : ''}
                            ${typeof item.product.rating === 'number' ? `<p><span class="font-medium">Rating:</span> ${item.product.rating} / 5</p>` : ''}
                        ` : ''}
                    </div>
                </div>
            `).join('') : '<p class="text-gray-500 text-center">No items found for this order.</p>';

        return `
            ${generateInvoiceContent(orderData, userData)}
            <div class="mt-8 pt-6 border-t-2 border-gray-300">
                <h3 class="text-2xl font-bold mb-6 text-center text-blue-700">Items Purchased</h3>
                <div class="space-y-4">
                    ${itemsHtml}
                </div>
            </div>
        `;
    };

    /**
     * Handles printing content by opening a new window/iframe and injecting HTML.
     * @param contentHtml The HTML string to be printed.
     */
    const handlePrint = (contentHtml: string) => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (!printWindow) {
            console.error("Could not open print window. Please check pop-up blockers.");
            return;
        }

        const printDoc = printWindow.document;
        printDoc.write('<html><head><title>Order Receipt</title>');
        // Include Tailwind CSS for styling in the print window
        printDoc.write('<script src="https://cdn.tailwindcss.com"></script>');
        // Add custom print styles to ensure clean output
        printDoc.write(`
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
                body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; color: #000; background: #fff; }
                .receipt-container {
                    max-width: 800px;
                    margin: 0 auto;
                    box-shadow: none; /* Remove shadow for print */
                    border: none; /* Remove border for print */
                    background: #fff;
                }
                /* Print-specific styles to hide elements not needed for receipt */
                @media print {
                    body { margin: 0; padding: 0; }
                    .receipt-container {
                        width: 100%;
                        max-width: none;
                        height: auto;
                        overflow: visible;
                        box-shadow: none;
                        border: none;
                        padding: 0;
                        margin: 0;
                    }
                    /* Ensure text is black and background is white for printing */
                    * { color: #000 !important; background: #fff !important; }
                    /* Hide print button if it somehow gets copied (though it has no-print class) */
                    .no-print { display: none !important; }
                }
            </style>
        `);
        printDoc.write('</head><body>');
        printDoc.write(contentHtml); // Inject the specific content HTML here
        printDoc.write('</body></html>');
        printDoc.close();

        // Wait for styles/scripts to load, then print
        printWindow.onload = () => {
            printWindow.focus(); // Focus the new window
            printWindow.print(); // Trigger print
            // Optionally close the window after printing, but often not preferred
            // printWindow.onafterprint = () => printWindow.close();
        };
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-col  justify-between items-center mb-4 gap-2">
                    <DialogTitle className="text-3xl font-bold text-center sm:text-left">Order Details #{displayOrder.id}</DialogTitle>
                    <div className="flex gap-2 flex-wrap justify-center sm:justify-end no-print">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrint(generateInvoiceContent(displayOrder, displayUser))}
                            className="flex items-center gap-2"
                            disabled={isLoadingUser} // Disable print button while user data is loading
                        >
                            {isLoadingUser ? 'Loading User...' : (
                                <>
                                    <Printer className="h-4 w-4" />
                                    Print Invoice Only
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrint(generateInvoiceWithProductsContent(displayOrder, displayUser))}
                            className="flex items-center gap-2"
                            disabled={isLoadingUser} // Disable print button while user data is loading
                        >
                            {isLoadingUser ? 'Loading User...' : (
                                <>
                                    <Printer className="h-4 w-4" />
                                    Print with Products
                                </>
                            )}
                        </Button>
                    </div>
                </DialogHeader>
                <DialogDescription className="mb-4">
                    Comprehensive information about this order.
                </DialogDescription>

                {isLoadingOrder || isLoadingUser ? ( // Combine loading states
                    <div className="p-4 space-y-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-32 w-full" /> {/* For order items */}
                    </div>
                ) : orderError || userError ? ( // Combine error states
                    <div className="text-red-500 text-center py-8">
                        Error loading details: {orderError?.message || userError?.message || 'Unknown error'}
                    </div>
                ) : (
                    <div className="grid gap-4 py-4">
                        {/* Customer Details Section */}
                        {displayUser && (
                            <div className="mb-6 p-6 bg-foreground/10 rounded-lg shadow-sm">
                                <h3 className="text-xl font-bold text-purple-800 mb-4 border-b pb-2">Customer Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
                                    <p><span className="font-semibold">Name:</span> {displayUser.userName}</p>
                                    <p><span className="font-semibold">Email:</span> {displayUser.email}</p>
                                    <p><span className="font-semibold">Phone:</span> {displayUser.phoneNumber}</p>
                                    <p><span className="font-semibold">Address:</span> {displayUser.address}, {displayUser.city}, {displayUser.country}</p>
                                </div>
                            </div>
                        )}

                        {/* Basic Invoice Details (always visible in the dialog) */}
                        <div className="grid grid-cols-2 items-center gap-4">
                            <p className="text-sm font-medium text-gray-500">Order ID:</p>
                            <p className="text-sm font-semibold">{displayOrder.id}</p>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <p className="text-sm font-medium text-gray-500">User ID:</p>
                            <p className="text-sm font-semibold">{displayOrder.userId}</p>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <p className="text-sm font-medium text-gray-500">Total Amount:</p>
                            <p className="text-sm font-semibold">{formatCurrency(displayOrder.totalAmount)}</p>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <p className="text-sm font-medium text-gray-500">Status:</p>
                            <Badge variant={getStatusBadgeVariant(displayOrder.status)} className="capitalize w-fit">
                                {displayOrder.status.toLowerCase()}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <p className="text-sm font-medium text-gray-500">Invoice Id:</p>
                            <p className="text-sm font-semibold">{displayOrder.invoiceId}</p>
                        </div><div className="grid grid-cols-2 items-center gap-4">
                            <p className="text-sm font-medium text-gray-500">Invoice Key:</p>
                            <p className="text-sm font-semibold">{displayOrder.invoiceKey}</p>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <p className="text-sm font-medium text-gray-500">Payment Status:</p>
                            <p className="text-sm font-semibold">{displayOrder.paymentStatus.toLowerCase()}</p>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <p className="text-sm font-medium text-gray-500">Payment Method:</p>
                            <p className="text-sm font-semibold capitalize">{displayOrder.paymentMethod.toLowerCase()}</p>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <p className="text-sm font-medium text-gray-500">Shipping Address:</p>
                            <p className="text-sm font-semibold">{displayOrder.shippingAddress}</p>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <p className="text-sm font-medium text-gray-500">Shipping Price:</p>
                            <p className="text-sm font-semibold">{formatCurrency(displayOrder.shippingPrice)}</p>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <p className="text-sm font-medium text-gray-500">Created At:</p>
                            <p className="text-sm font-semibold">
                                {formatDateTime(displayOrder.createdAt)}
                            </p>
                        </div>
                        {displayOrder.updatedAt && (
                            <div className="grid grid-cols-2 items-center gap-4">
                                <p className="text-sm font-medium text-gray-500">Last Updated:</p>
                                <p className="text-sm font-semibold">
                                    {formatDateTime(displayOrder.updatedAt)}
                                </p>
                            </div>
                        )}

                        {/* Order Items Details (always visible in the dialog) */}
                        <div className="mt-4">
                            <h3 className="text-lg font-bold mb-2 border-b pb-2">Order Items</h3>
                            {displayOrder.orderItems && displayOrder.orderItems.length > 0 ? (
                                <div className="space-y-4">
                                    {displayOrder.orderItems.map((item: OrderItemType, index: number) => (
                                        <div key={item.id || index} className="border p-3 rounded-md shadow-sm">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-semibold text-base">{item.productName}</p>
                                                <p className="font-semibold text-base">{formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                            <div className="text-sm text-gray-600 grid grid-cols-2 gap-1">
                                                <p>Product ID: {item.productId}</p>
                                                <p>Quantity: {item.quantity}</p>
                                                <p>Unit Price (After Discount): {formatCurrency(item.price)}</p>
                                                {/* Display all ProductDtoType details if available */}
                                                {item.product && (
                                                    <>
                                                        <p>Original Product Price: {formatCurrency(item.product.price ?? 0)}</p>
                                                        <p>Product SKU: {item.product.sku}</p>
                                                        <p>Product Category ID: {item.product.categoryId}</p>
                                                        {item.product.description && <p>Description: {item.product.description}</p>}
                                                        {/* {item.product.brand && <p>Brand: {item.product.brand}</p>} */}
                                                        {typeof item.product.discount === 'number' && <p>Product Discount: {item.product.discount}%</p>}
                                                        {typeof item.product.stockQuantity === 'number' && <p>Stock Quantity: {item.product.stockQuantity}</p>}
                                                        {typeof item.product.rating === 'number' && <p>Rating: {item.product.rating} / 5</p>}
                                                        {typeof item.product?.cartAddedCount === 'number' && <p>Cart Added Count: {item.product?.cartAddedCount}</p>}
                                                        {typeof item.product?.createdOrderCount === 'number' && <p>Created Order Count: {item.product?.createdOrderCount}</p>}
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
                )}
            </DialogContent>
        </Dialog>
    );
};
