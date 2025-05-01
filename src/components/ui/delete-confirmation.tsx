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
import { toast } from "sonner";
import { apiBaseUrl } from "@/app/utils/strings";
import { getAccessToken } from "@/lib/api";
import { queryClient } from "@/app/(dashboard)/layout";

interface DeleteConfirmationProps {
    title: string;
    description: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resourceId: number;
    resourceType: 'users' | 'products' | 'categories' | 'orders';
}

export function DeleteConfirmation({
    title,
    description,
    open,
    onOpenChange,
    resourceId,
    resourceType,
}: DeleteConfirmationProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function onDelete() {
        try {
            setIsLoading(true);
            const url = `${apiBaseUrl}/api/v1/${resourceType}/${resourceId}`;

            const accessToken = getAccessToken();
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? '',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete ${resourceType.slice(0, -1)}`);
            }

            await queryClient.invalidateQueries({ queryKey: [resourceType] });

            toast.success('Deleted successfully', {
                description: `The ${resourceType.slice(0, -1)} has been deleted.`,
            });

            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Error", {
                description: `Failed to delete ${resourceType.slice(0, -1)}. Please try again.`,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
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