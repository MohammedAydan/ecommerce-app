"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { apiBaseUrl } from "@/app/utils/strings";
import { getAccessToken } from "@/lib/api";
import { toast } from "sonner";
import OrderType from "@/types/order-type";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    totalAmount: z.number().min(0, "Total amount must be positive"),
    paymentMethod: z.string().min(1, "Payment method is required"),
    shippingAddress: z.string().min(1, "Shipping address is required"),
    shippingPrice: z.number().min(0, "Shipping price must be positive"),
    status: z.string().min(1, "Status is required"),
});

type OrderFormValues = z.infer<typeof formSchema>;

export function OrderForm({
    order,
    isOpen,
    onClose,
    onSuccess,
}: {
    order?: OrderType;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: "",
            totalAmount: 0,
            paymentMethod: "",
            shippingAddress: "",
            shippingPrice: 0,
            status: "pending",
        },
    });

    useEffect(() => {
        if (order) {
            form.reset({
                userId: order.userId,
                totalAmount: order.totalAmount,
                paymentMethod: order.paymentMethod,
                shippingAddress: order.shippingAddress,
                shippingPrice: order.shippingPrice,
                status: order.status,
            });
        } else {
            form.reset({
                userId: "",
                totalAmount: 0,
                paymentMethod: "",
                shippingAddress: "",
                shippingPrice: 0,
                status: "pending",
            });
        }
    }, [order, form, isOpen]);

    async function onSubmit(data: OrderFormValues) {
        try {
            setIsLoading(true);
            const url = `${apiBaseUrl}/api/v1/orders${order ? `/${order.id}` : ''}`;
            const method = order ? 'PUT' : 'POST';

            const accessToken = getAccessToken();
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? '',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    ...data,
                    ...(order ? { id: order.id } : {}),
                }),
            });

            if (!response.ok) {
                throw new Error(await response.text() || 'Failed to save order');
            }

            toast.success(`Order ${order ? 'updated' : 'created'} successfully`);
            onClose();
            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast.error("Error", {
                description: `Failed to ${order ? 'update' : 'create'} order`,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{order ? 'Edit' : 'Create'} Order</DialogTitle>
                    <DialogDescription>
                        {order ? 'Update the order details below.' : 'Add a new order to your store.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {!order && (
                                <FormField
                                    control={form.control}
                                    name="userId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>User ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="User ID" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormField
                                control={form.control}
                                name="totalAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Total amount"
                                                {...field}
                                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="shippingPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Shipping Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Shipping price"
                                                {...field}
                                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Method</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select payment method" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="credit_card">Credit Card</SelectItem>
                                                <SelectItem value="paypal">PayPal</SelectItem>
                                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                                <SelectItem value="cash">Cash</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select order status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="processing">Processing</SelectItem>
                                                <SelectItem value="shipped">Shipped</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="shippingAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Shipping Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Shipping address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : order ? "Save Changes" : "Create Order"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}