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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAccessToken } from "@/lib/api";
import { apiBaseUrl } from "@/app/utils/strings";
import { queryClient } from "@/app/(dashboard)/layout";

const formSchema = z.object({
    userName: z.string().min(2, "Username is required"),
    email: z.string().email("Invalid email"),
    image: z.instanceof(File).optional(),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    address: z.string().min(1, "Address is required"),
    phoneNumber: z.string().min(8, "Phone number is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function UserForm({
    user,
    open,
    onOpenChange,
}: {
    user?: Partial<FormValues> & { id?: string };
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userName: "",
            email: "",
            image: undefined,
            country: "",
            city: "",
            address: "",
            phoneNumber: "",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                userName: user.userName || "",
                email: user.email || "",
                image: undefined,
                country: user.country || "",
                city: user.city || "",
                address: user.address || "",
                phoneNumber: user.phoneNumber || "",
            });
        }
    }, [user, form]);

    const onSubmit = async (data: FormValues) => {
        try {
            setIsLoading(true);
            const url = `${apiBaseUrl}/api/v1/user/update${user ? `/${user.id}` : ''}`;
            const method = user ? 'PUT' : 'POST';
            const formData = new FormData();

            if (user?.id) formData.append("id", user.id);
            formData.append("userName", data.userName);
            formData.append("email", data.email);
            formData.append("country", data.country);
            formData.append("city", data.city);
            formData.append("address", data.address);
            formData.append("phoneNumber", data.phoneNumber);
            if (data.image) formData.append("image", data.image);

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
                throw new Error('Failed to save user');
            }

            await queryClient.invalidateQueries({ queryKey: ['user/all'] });

            toast.success(`User ${user?.id ? "updated" : "created"} successfully`);
            onOpenChange(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to save user data");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{user ? "Edit" : "Create"} User</DialogTitle>
                    <DialogDescription>
                        {user ? "Update the user details below." : "Add a new user."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Email address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Country" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="City" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Phone Number" {...field} />
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
                                    <FormLabel>Profile Image</FormLabel>
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
                                {isLoading ? "Saving..." : user ? "Update User" : "Create User"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
