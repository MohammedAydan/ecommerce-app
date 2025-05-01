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
import UserType from "@/types/user-type";
import { toast } from "sonner";
import { queryClient } from "@/app/(dashboard)/layout";

export function DeleteUserDialog({
    user,
    open,
    onOpenChange,
}: {
    user: UserType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [isLoading, setIsLoading] = useState(false);

    async function onDelete() {
        try {
            setIsLoading(true);

            const url = `${apiBaseUrl}/api/v1/user/${user.id}`;
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
                throw new Error('Failed to delete user');
            }

            await queryClient.invalidateQueries({ queryKey: ['user/all'] });
            toast.success('User deleted', {
                description: "The user has been deleted successfully.",
            });
            onOpenChange(false);
        } catch (error: unknown) {
            console.error(error);
            toast.error("Error", {
                description: error instanceof Error
                    ? error.message
                    : "Failed to delete user. Please try again.",
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
                        user {user.userName} and remove all their data from the server.
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