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
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { apiBaseUrl } from "@/app/utils/strings";
import { getAccessToken } from "@/lib/api";
import { CategoryDtoType } from "@/types/category-type";
import { toast } from "sonner";
import { queryClient } from "@/app/(dashboard)/layout";

const formSchema = z.object({
    categoryName: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    image: z.instanceof(File).optional()
});

type CategoryFormValues = z.infer<typeof formSchema>;

export function CategoryForm({
    category,
    open,
    onOpenChange,
}: {
    category?: CategoryDtoType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryName: "",
            description: "",
            image: undefined
        },
    });

    // Reset form with category data when editing
    useEffect(() => {
        if (category) {
            form.reset({
                categoryName: category.categoryName,
                description: category.description || "",
                image: undefined
            });
        } else {
            form.reset({
                categoryName: "",
                description: "",
                image: undefined
            });
        }
    }, [category, form]);

    async function onSubmit(data: CategoryFormValues) {
        try {
            setIsLoading(true);
            const url = `${apiBaseUrl}/api/v1/categories${category ? `/${category.categoryId}` : ''}`;
            const method = category ? 'PUT' : 'POST';

            const formData = new FormData();
            if (category) formData.append('categoryId', category?.categoryId.toString());
            formData.append('categoryName', data.categoryName);
            if (data.description) formData.append('description', data.description);
            if (data.image) formData.append('image', data.image);

            const accessToken = getAccessToken();
            const response = await fetch(url, {
                method,
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? '',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to save category');
            }

            await queryClient.invalidateQueries({ queryKey: ['categories'] });

            toast.success(`Category ${category ? 'updated' : 'created'} successfully`, {
                description: `The category has been ${category ? 'updated' : 'created'}.`,
            });

            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Error", {
                description: `Failed to ${category ? 'update' : 'create'} category. Please try again.`,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{category ? 'Edit' : 'Create'} Category</DialogTitle>
                    <DialogDescription>
                        {category ? 'Update the category details below.' : 'Add a new category to your store.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="categoryName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Category name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Category description"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field: { onChange } }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) onChange(file);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    "Saving..."
                                ) : category ? (
                                    "Save changes"
                                ) : (
                                    "Create category"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}