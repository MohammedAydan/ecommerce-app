"use client"
import React, { useEffect, useState, FormEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/features/auth/use-auth'
import { redirect, useRouter } from 'next/navigation'
import UpdateUserType from '@/features/auth/types/update-user-type'
import { toast } from 'sonner'
import Loading from '@/components/loading'

function Page() {
    const router = useRouter();
    const { user, isLoading, updateUser } = useAuth();
    const [formData, setFormData] = useState<UpdateUserType>({
        userName: user?.userName || '',
        email: user?.email || '',
        image: null,
        country: user?.country || '',
        city: user?.city || '',
        address: user?.address || '',
        phoneNumber: user?.phoneNumber || ''
    });

    useEffect(() => {
        if (!isLoading && !user) {
            redirect("/sign-in");
        }
        if (user) {
            setFormData({
                userName: user.userName || '',
                email: user.email || '',
                image: null,
                country: user.country || '',
                city: user.city || '',
                address: user.address || '',
                phoneNumber: user.phoneNumber || ''
            });
        }
    }, [user, isLoading]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, files } = e.target;
        if (id === 'image' && files) {
            setFormData(prev => ({ ...prev, image: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await updateUser(formData);
            toast.success("Updated Successfully")
            router.push("/profile");
        } catch (error) {
            toast.error("Something went wrong", {
                description: `Error updating profile: ${error}`,
            });
            console.error('Error updating profile:', error);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto py-10 mt-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Edit Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="image">Profile Picture</Label>
                                <Image
                                    src={user?.imageUrl ?? ""}
                                    alt="Profile"
                                    width={100}
                                    height={100}
                                    className="w-32 h-32 rounded-full object-cover mx-auto"
                                />
                                <Input
                                    id="image"
                                    type="file"
                                    onChange={handleInputChange}
                                    accept="image/*"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <Link href="/profile">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page
