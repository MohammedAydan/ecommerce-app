"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { apiBaseUrl } from "@/app/utils/strings";
import { getAccessToken } from "@/lib/api";
import { toast } from "sonner";
import OrderType from "@/types/order-type";

export function DeleteOrderDialog({
    order,
    isOpen,
    onClose,
    onSuccess,
}: {
    order: OrderType;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);

    async function onDelete() {
        try {
            setIsLoading(true);
            const url = `${apiBaseUrl}/api/v1/orders/${order.id}`;

            const accessToken = getAccessToken();
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? '',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(await response.text() || 'Failed to delete order');
            }

            toast.success('Order deleted successfully');
            onClose();
            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast.error("Error", {
                description: "Failed to delete order",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete order #{order.id}
                        for user {order.userId} and remove all associated data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : "Delete Order"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}