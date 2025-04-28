"use client"
import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BiEdit } from 'react-icons/bi'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/features/auth/use-auth'
import { redirect } from 'next/navigation'
import Loading from '@/components/loading'
import { MdOutlineStorefront } from 'react-icons/md'

function Page() {
    const { user, isLoading, signOut } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            redirect("/sign-in");
        }
    }, [user, isLoading]);

    const signOutHandle = () => {
        signOut();
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto py-10 mt-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className='flex justify-between items-center'>
                    <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
                    <div className="flex justify-end space-x-4 pt-4">
                        <Link href="/profile/edit">
                            <Button variant="outline" className="px-4 py-2">
                                <BiEdit /> Edit
                            </Button>
                        </Link>
                        <Link href="/orders">
                            <Button variant="outline" className="px-4 py-2">
                                <MdOutlineStorefront /> My Orders
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4">

                        {/* add image */}
                        <div className="space-y-2">
                            <Label>Image</Label>
                            <Image
                                src={user?.imageUrl ?? ""}
                                alt="Profile"
                                width={100}
                                height={100}
                                className="w-32 h-32 rounded-full object-cover mx-auto"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={user?.userName} readOnly />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={user?.email} readOnly />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" value={user?.phoneNumber || ''} readOnly />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" value={user?.country} readOnly />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" value={user?.city} readOnly />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" value={user?.address} readOnly />
                        </div>

                        {user?.roles?.map((r) => r.toLowerCase()).includes("admin") && (
                            <div className="space-y-2">
                                <Label>Roles</Label>
                                <div className="flex gap-2">
                                    {user?.roles?.map((role, index) => (
                                        <Badge key={index} variant="secondary">{role}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="address">Last SignIn: </Label>
                            <p>{user?.lastSignIn}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Last Update: </Label>
                            <p>{user?.updatedAt}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Created At: </Label>
                            <p>{user?.createdAt}</p>
                        </div>

                    </div>
                    <Button onClick={signOutHandle} variant="destructive" className="w-full px-4 py-2">
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page
