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
import { ProductDtoType } from "@/types/product-type";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryDtoType } from "@/types/category-type";
import { useGetTableData } from "@/app/(dashboard)/_hooks/get-table-data-hook";
import { queryClient } from "@/app/(dashboard)/layout";

export function ProductForm({
    product,
    open,
    onOpenChange,
}: {
    product?: ProductDtoType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [isLoading, setIsLoading] = useState(false);

    const { data: categories } = useGetTableData<CategoryDtoType>({
        endpoint: 'categories',
        page: 1,
        limit: 100
    });

    const formSchema = z.object({
        productName: z.string().min(2, "Name is required"),
        description: z.string().min(1, "Description is required"),
        price: z.number().min(0.01, "Price must be greater than 0"),
        categoryId: z.number().min(1, "Category is required"),
        sku: z.string().min(1, "SKU is required"),
        stockQuantity: z.number().min(1, "Stock quantity must be at least 1"),
        image: product
            ? z.instanceof(File).optional()
            : z.instanceof(File, { message: "Image is required" }),
        discount: z.number().min(0, "Discount must be positive"),
        rating: z.number().min(0, "Rating must be at least 0").max(5, "Max rating is 5"),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: "",
            description: "",
            price: 0,
            categoryId: 0,
            sku: "",
            stockQuantity: 0,
            image: undefined,
            discount: 0,
            rating: 0,
        },
    });

    useEffect(() => {
        if (product) {
            form.reset({
                productName: product.productName || "",
                description: product.description || "",
                price: product.price || 0,
                categoryId: product.categoryId || 0,
                sku: product.sku || "",
                stockQuantity: product.stockQuantity || 0,
                image: undefined,
                discount: product.discount || 0,
                rating: product.rating || 0
            });
        } else {
            form.reset({
                productName: "",
                description: "",
                price: 0,
                categoryId: 0,
                sku: "",
                stockQuantity: 0,
                image: undefined,
                discount: 0,
                rating: 0
            });
        }
    }, [product, form]);

    type ProductFormValues = z.infer<typeof formSchema>;

    async function onSubmit(data: ProductFormValues) {
        try {
            setIsLoading(true);
            const url = `${apiBaseUrl}/api/v1/products${product ? `/${product.productId}` : ''}`;
            const method = product ? 'PUT' : 'POST';

            const formData = new FormData();
            if (product) formData.append('productId', product.productId?.toString() || '');
            formData.append('productName', data.productName);
            formData.append('price', data.price.toString());
            formData.append('categoryId', data.categoryId.toString());
            formData.append('sku', data.sku || '');
            formData.append('stockQuantity', data.stockQuantity.toString());
            if (data.description) formData.append('description', data.description);
            if (data.image) formData.append('image', data.image);
            if (data.discount) formData.append('discount', data.discount.toString());
            if (data.rating) formData.append('rating', data.rating.toString());

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
                throw new Error('Failed to save product');
            }

            await queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success(`Product ${product ? 'updated' : 'created'} successfully`, {
                description: `The product has been ${product ? 'updated' : 'created'}.`,
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Error", {
                description: `Failed to ${product ? 'update' : 'create'} product. Please try again.`,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{product ? 'Edit' : 'Create'} Product</DialogTitle>
                    <DialogDescription>
                        {product ? 'Update the product details below.' : 'Add a new product to your store.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="productName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SKU</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product SKU" {...field} />
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
                                            placeholder="Product description"
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
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="Product price"
                                            {...field}
                                            onChange={e => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="Product discount"
                                            {...field}
                                            onChange={e => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="stockQuantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock Quantity</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Stock quantity"
                                            {...field}
                                            onChange={e => field.onChange(parseInt(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                            placeholder="Product rating"
                                            {...field}
                                            onChange={e => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                        value={field.value ? field.value.toString() : ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories?.map((category) => (
                                                <SelectItem
                                                    key={category.categoryId}
                                                    value={category.categoryId.toString()}
                                                >
                                                    {category.categoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                ) : product ? (
                                    "Save changes"
                                ) : (
                                    "Create product"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}