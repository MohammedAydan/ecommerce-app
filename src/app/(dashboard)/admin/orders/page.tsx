"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useGetTableData } from "../../_hooks/get-table-data-hook";
import OrderType from "@/types/order-type";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ChevronLeft,
    ChevronRight,
    Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const OrdersPage = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const limit = 10;

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPage(1);
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const { data, error, isLoading } = useGetTableData<OrderType>({
        tableName: 'orders',
        page,
        limit,
        searchTerm: debouncedSearch,
    });

    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'default';
            case 'processing':
                return 'secondary';
            case 'cancelled':
                return 'destructive';
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

    if (error) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-red-500 text-xl">Error loading orders</div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sticky top-0 p-5 bg-background z-10 backdrop-blur-sm bg-opacity-90 border-b">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Orders
                </h1>
                <div className="flex gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search orders..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {!isLoading && data?.length === 0 && (
                <div className="my-2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-2xl relative" role="alert">
                    <strong className="font-bold">No orders found.</strong>
                </div>
            )}

            <div className="border shadow-lg rounded-xl overflow-hidden">
                {isLoading ? (
                    <div className="p-4 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Order ID</TableHead>
                                <TableHead>User ID</TableHead>
                                <TableHead className="hidden md:table-cell">Items</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead className="hidden lg:table-cell">Payment Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((order) => (
                                <TableRow
                                    key={order.id}
                                >
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>{order.userId}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge variant="outline">{order.orderItems.length} items</Badge>
                                    </TableCell>
                                    <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                                    <TableCell className="hidden lg:table-cell capitalize">
                                        {order.paymentMethod.toLowerCase()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                                            {order.status.toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                <div className="flex items-center justify-between px-4 py-4 border-t">
                    <div className="text-sm text-gray-500">
                        Showing page {page}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => p + 1)}
                            disabled={data?.length != limit}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;