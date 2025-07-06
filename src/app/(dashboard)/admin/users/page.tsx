"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useGetTableData } from "../../_hooks/get-table-data-hook";
import UserType from "@/types/user-type";
import Image from "next/image";
import { apiBaseUrl } from "@/app/utils/strings";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Pencil,
    Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserForm } from "./_components/user-form";
import { DeleteUserDialog } from "./_components/delete-user-dialog";

const UsersPage = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType | undefined>();

    // Add form and delete dialog components
    const UserFormDialog = (
        <UserForm
            user={selectedUser}
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
        />
    );

    const DeleteDialog = selectedUser && (
        <DeleteUserDialog
            user={selectedUser}
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
        />
    );

    const limit = 10;

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPage(1);
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const { data, error, isLoading } = useGetTableData<UserType>({
        endpoint: "user/all",
        page,
        limit,
        searchTerm: debouncedSearch,
        ascending: false,
        sortBy: 'CreatedAt',
    });

    if (error) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-red-500 text-xl">Error loading users</div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sticky top-0 p-5 bg-background z-10 backdrop-blur-sm bg-opacity-90 border-b">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Users
                </h1>
                <div className="flex gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search users..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* <Button
                        className="whitespace-nowrap"
                        onClick={() => {
                            setSelectedUser(undefined);
                            setIsFormOpen(true);
                        }}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button> */}
                </div>
            </div>

            {!isLoading && data?.length === 0 && (
                <div className="my-2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-2xl relative" role="alert">
                    <strong className="font-bold">No users found.</strong>
                </div>
            )}

            <div className="border shadow-lg rounded-xl overflow-hidden p-1">
                {isLoading ? (
                    <div className="p-4 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead className="hidden lg:table-cell">Location</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead>Last Sign In</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {user.imageUrl && (
                                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                                    <Image
                                                        src={`${apiBaseUrl}/${user.imageUrl}`}
                                                        alt={user.userName}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <span className="font-semibold">{user.userName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        {user.city}, {user.country}
                                    </TableCell>
                                    <TableCell>{user.phoneNumber || "-"}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {user.roles?.map((role, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="capitalize"
                                                >
                                                    {role.toLowerCase()}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.lastSignIn
                                            ? new Date(user.lastSignIn).toLocaleDateString()
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsFormOpen(true);
                                                }}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                <div className="flex items-center justify-between px-4 py-4 border-t">
                    <div className="text-sm text-gray-500">
                        Showing page {page}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => p + 1)}
                            disabled={data?.length !== limit}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            {UserFormDialog}
            {DeleteDialog}
        </div>
    );
};

export default UsersPage;