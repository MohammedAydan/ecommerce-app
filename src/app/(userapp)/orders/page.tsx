"use client"
import { Separator } from "@/components/ui/separator";
import apiClient from "@/lib/api";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import OrderType from "@/types/order-type";
import OrderCard from "@/components/order-card";

const Page = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get("Orders/user?page=1&limit=20");
            setOrders(response.data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setError("Failed to load your orders. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getOrders();
    }, []);

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

    return (
        <div className="mt-16 w-full max-w-6xl mx-auto">
            <div className="p-3">
                <h1 className="font-bold text-2xl">My Orders (Last 20)</h1>
            </div>
            <Separator />
            
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loading />
                </div>
            ) : error ? (
                <div className="p-8 text-center">
                    <p className="text-red-500">{error}</p>
                    <button 
                        onClick={() => getOrders()} 
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        Try Again
                    </button>
                </div>
            ) : orders.length === 0 ? (
                <div className="p-8 text-center">
                    <p className="text-gray-500">You don&#39;t have any orders yet.</p>
                </div>
            ) : (
                <div className="p-3 flex flex-col gap-4">
                    {orders.map((order) => (
                        <OrderCard
                            key={order.id} 
                            order={order} 
                            formatDate={formatDate}
                            formatCurrency={formatCurrency}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Page;
