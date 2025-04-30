"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api";
import Loading from "@/components/loading";
import { MdArrowBack } from "react-icons/md";
import OrderType from "@/types/order-type";
import { OrderItemCard } from "../../../../components/order-item-card";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [order, setOrder] = useState<OrderType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const { id } = await params;
                const response = await apiClient.get(`Orders/${id}?includeProducts=true&limit=100`);
                setOrder(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Failed to fetch order details:", error);
                setError("Failed to load order details. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [params]);

    // Format date to a more readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Map status to appropriate badge variant
    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'processing':
                return 'warning';
            case 'cancelled':
                return 'destructive';
            case 'pending':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <div className="mt-16 w-full max-w-6xl mx-auto">
            <div className="p-3 flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.back()}
                    aria-label="Go back"
                >
                    <MdArrowBack size={20} />
                </Button>
                <h1 className="font-bold text-2xl">Order Details</h1>
            </div>
            <Separator />

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loading />
                </div>
            ) : error ? (
                <div className="p-8 text-center">
                    <p className="text-red-500">{error}</p>
                    <Button
                        onClick={() => router.back()}
                        className="mt-4"
                    >
                        Return to Orders
                    </Button>
                </div>
            ) : !order ? (
                <div className="p-8 text-center">
                    <p className="text-gray-500">Order not found.</p>
                    <Button
                        onClick={() => router.back()}
                        className="mt-4"
                    >
                        Return to Orders
                    </Button>
                </div>
            ) : (
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-xl">Order #{order.id}</h2>
                        <Badge variant={getStatusVariant(order.status) as "destructive" | "secondary" | "outline" | "default"} className="text-sm px-3 py-1">
                            {order.status}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Order Information</h3>
                            <p><span className="font-medium">Order ID:</span> {order.id}</p>
                            <p><span className="font-medium">Created:</span> {formatDate(order.createdAt)}</p>
                            <p><span className="font-medium">Updated:</span> {formatDate(order.updatedAt)}</p>
                            <p><span className="font-medium">Total Amount:</span> {formatCurrency(order.totalAmount)}</p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Shipping & Payment</h3>
                            <p><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
                            <p><span className="font-medium">Shipping Address:</span> {order.shippingAddress}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="font-semibold text-lg mb-4">Order Items</h3>
                        <div className="bg-gray-50 dark:bg-foreground/5 rounded-lg overflow-hidden">
                            <div className="grid grid-cols-12 bg-gray-100 dark:bg-foreground/10 p-4 font-medium">
                                <div className="col-span-6">Product</div>
                                <div className="col-span-2 text-center">Price</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>

                            {order.orderItems.map((item) => (
                                <OrderItemCard key={item.id} orderItem={item} />
                            ))}

                            <div className="grid grid-cols-12 p-4 border-t border-gray-200 dark:border-foreground/20 bg-gray-50 dark:bg-foreground/5">
                                <div className="col-span-10 text-right font-normal">Shipping Price:</div>
                                <div className="col-span-2 text-right font-normal">{formatCurrency(order.shippingPrice)}</div>
                            </div>
                            <div className="grid grid-cols-12 p-4 border-t border-gray-200 dark:border-foreground/20 bg-gray-50 dark:bg-foreground/5">
                                <div className="col-span-10 text-right font-bold">Total:</div>
                                <div className="col-span-2 text-right font-bold">{formatCurrency(order.totalAmount)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

