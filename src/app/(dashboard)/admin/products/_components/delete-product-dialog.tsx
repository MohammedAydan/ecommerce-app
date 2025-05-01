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
import { ProductDtoType } from "@/types/product-type";
import { toast } from "sonner";
import { queryClient } from "@/app/(dashboard)/layout";

export function DeleteProductDialog({
    product,
    open,
    onOpenChange,
}: {
    product: ProductDtoType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [isLoading, setIsLoading] = useState(false);

    async function onDelete() {
        try {
            setIsLoading(true);
            const url = `${apiBaseUrl}/api/v1/products/${product.productId}`;

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
                throw new Error('Failed to delete product');
            }

            await queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted', {
                description: "The product has been deleted successfully.",
            });
            onOpenChange(false);
        } catch (error) {
            console.log(error);
            toast.error("Error", {
                description: "Failed to delete product. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        product {product.productName} and remove its data from the server.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}