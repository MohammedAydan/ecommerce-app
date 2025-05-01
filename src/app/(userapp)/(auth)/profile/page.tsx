"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BiEdit } from "react-icons/bi";
import { MdOutlineStorefront } from "react-icons/md";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useAuth } from "@/features/auth/use-auth";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";
import { Settings2Icon } from "lucide-react";

function Page() {
    const { user, isLoading, signOut } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            redirect("/sign-in");
        }
    }, [user, isLoading]);

    if (isLoading) return <Loading />;

    const isAdmin = user?.roles?.map((r) => r.toLowerCase()).includes("admin");

    return (
        <div className="container mx-auto px-4 py-10 mt-16">
            <Card className="w-full max-w-3xl mx-auto shadow-xl border-none rounded-2xl">
                <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <CardTitle className="text-3xl font-semibold">Profile</CardTitle>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/profile/edit">
                            <Button variant="outline" className="gap-2">
                                <BiEdit className="text-lg" />
                                Edit
                            </Button>
                        </Link>
                        <Link href="/orders">
                            <Button variant="outline" className="gap-2">
                                <MdOutlineStorefront className="text-lg" />
                                My Orders
                            </Button>
                        </Link>

                        {isAdmin && (
                            <Link href="/admin">
                                <Button variant="outline" className="gap-2">
                                    <Settings2Icon className="text-lg" /> Dashboard
                                </Button>
                            </Link>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="flex justify-center">
                        <Image
                            src={user?.imageUrl ?? "/placeholder.jpg"}
                            alt="Profile"
                            width={128}
                            height={128}
                            className="rounded-full object-cover w-32 h-32 border-4 border-muted shadow-lg"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <Field label="Username" value={user?.userName ?? ""} />
                        <Field label="Email" value={user?.email ?? ""} />
                        <Field label="Phone Number" value={(user?.phoneNumber || "") ?? ""} />
                        <Field label="Country" value={user?.country ?? ""} />
                        <Field label="City" value={user?.city ?? ""} />
                        <Field label="Address" value={user?.address ?? ""} />
                    </div>

                    {isAdmin && (
                        <div>
                            <Label>Roles</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {user?.roles?.map((role, index) => (
                                    <Badge key={index} variant="secondary" className="capitalize">
                                        {role}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid sm:grid-cols-3 gap-4 text-muted-foreground text-sm">
                        <MetaInfo label="Last Sign In" value={user?.lastSignIn ?? "NULL"} />
                        <MetaInfo label="Last Update" value={user?.updatedAt ?? "NULL"} />
                        <MetaInfo label="Created At" value={user?.createdAt ?? "NULL"} />
                    </div>

                    <div className="flex flex-col gap-4 mt-8">
                        <Button
                            onClick={signOut}
                            variant="destructive"
                            className="w-full transition hover:scale-105"
                        >
                            Sign Out
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-1">
        <Label className="text-muted-foreground">{label}</Label>
        <Input readOnly value={value} className="bg-muted cursor-not-allowed" />
    </div>
);

const MetaInfo = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col">
        <span className="font-medium">{label}</span>
        <span>{value}</span>
    </div>
);

export default Page;
