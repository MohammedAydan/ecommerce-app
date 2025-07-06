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
import { CategoryDtoType } from "@/types/category-type";
import Image from "next/image";
import { apiBaseUrl } from "@/app/utils/strings";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Plus,
    Pencil,
    Trash2
} from "lucide-react";
import { CategoryForm } from "./_components/category-form";
import { DeleteCategoryDialog } from "./_components/delete-category-dialog";
import { Input } from "@/components/ui/input";

const CategoriesPage = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryDtoType | undefined>();

    const limit = 10;

    // Debounce search input
    useEffect(() => {
        const timeout = setTimeout(() => {
            setPage(1); // Reset to first page when searching
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const { data, error, isLoading } = useGetTableData<CategoryDtoType>({
        endpoint: 'categories',
        page,
        limit,
        searchTerm: debouncedSearch,
        ascending: false,
        sortBy: 'CreatedAt',
    });


    if (error) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-red-500 text-xl">Error loading categories</div>
            </div>
        );
    }


    return (
        // max-w-7xl
        <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sticky top-0 p-5 bg-background z-10 backdrop-blur-sm bg-opacity-90 border-b">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Categories
                </h1>
                <div className="flex gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search categories..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        className="whitespace-nowrap"
                        onClick={() => {
                            setSelectedCategory(undefined);
                            setIsFormOpen(true);
                        }}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                    </Button>
                </div>
            </div>

            {!isLoading && data?.length === 0 && (
                <div className="my-2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-2xl relative" role="alert">
                    <strong className="font-bold">No categories found.</strong>
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
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden md:table-cell">Parent ID</TableHead>
                                <TableHead className="hidden lg:table-cell">Description</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((category) => (
                                <TableRow
                                    key={category.categoryId}
                                >
                                    <TableCell className="font-medium">{category.categoryId}</TableCell>
                                    <TableCell className="font-semibold">{category.categoryName}</TableCell>
                                    <TableCell className="hidden md:table-cell">{category.parentCategoryId}</TableCell>
                                    <TableCell className="hidden lg:table-cell max-w-xs truncate">
                                        {category.description}
                                    </TableCell>
                                    <TableCell>
                                        {category.imageUrl && (
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                                                <Image
                                                    src={apiBaseUrl + "/" + category.imageUrl}
                                                    alt={category.categoryName}
                                                    fill
                                                    className="object-cover transition-transform hover:scale-110"
                                                />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {category.itemsCount}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedCategory(category);
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
                                                    setSelectedCategory(category);
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
                            disabled={data?.length != limit}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <CategoryForm
                category={selectedCategory}
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
            />

            {selectedCategory && (
                <DeleteCategoryDialog
                    category={selectedCategory}
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                />
            )}
        </div>
    );
};

export default CategoriesPage;
