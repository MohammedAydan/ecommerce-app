'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import ProductCard from '@/components/product-card';

import { ProductDtoType } from '@/types/product-type';
import { SimpleCategoryType } from '@/types/category-type';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { apiUnauth } from '@/lib/api';

// Helper API calls
const fetchProducts = async (params: URLSearchParams): Promise<ProductDtoType[]> => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/search?${params.toString()}`;
        const { data } = await apiUnauth.get(url);
        return data.map((product: ProductDtoType) => ({
            ...product,
            imageUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}${product.imageUrl}`,
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

const fetchCategories = async (): Promise<SimpleCategoryType[]> => {
    try {
        const { data } = await apiUnauth.get<SimpleCategoryType[]>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/Categories/simple?limit=100`
        );
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

// Search Content Component
const SearchContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [products, setProducts] = useState<ProductDtoType[]>([]);
    const [categories, setCategories] = useState<SimpleCategoryType[]>([]);
    const [categoryId, setCategoryId] = useState(searchParams.get('category') || 'all');
    const [minPrice, setMinPrice] = useState<number | undefined>(
        searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
    );
    const [maxPrice, setMaxPrice] = useState<number | undefined>(
        searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
    );
    const [page, setPage] = useState(Number(searchParams.get('page') || '1'));
    const [isLoading, setIsLoading] = useState(false);

    // Update URL based on state
    const updateUrl = useCallback(() => {
        const params = new URLSearchParams();

        if (searchQuery) params.set('q', searchQuery);
        if (categoryId && categoryId !== 'all') params.set('category', categoryId);
        if (minPrice !== undefined) params.set('minPrice', String(minPrice));
        if (maxPrice !== undefined) params.set('maxPrice', String(maxPrice));
        if (page > 1) params.set('page', String(page));

        router.push(`/search?${params.toString()}`);
    }, [router, searchQuery, categoryId, minPrice, maxPrice, page]);

    // Fetch products based on current state
    const searchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.set('searchTerm', searchQuery);
            params.set('page', String(page));
            params.set('limit', '12');
            if (categoryId && categoryId !== 'all') params.set('categoryId', categoryId);
            if (minPrice !== undefined) params.set('minPrice', String(minPrice));
            if (maxPrice !== undefined) params.set('maxPrice', String(maxPrice));

            const fetchedProducts = await fetchProducts(params);
            setProducts(fetchedProducts);
        } catch (error) {
            console.error('Failed to search products', error);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, page, categoryId, minPrice, maxPrice]);

    // Initial fetch categories
    useEffect(() => {
        const loadCategories = async () => {
            const cats = await fetchCategories();
            setCategories(cats);
        };
        loadCategories();
    }, []);

    // Search when query or filters change
    useEffect(() => {
        if (searchQuery.trim()) {
            updateUrl();
            searchProducts();
        }
    }, [searchQuery, categoryId, minPrice, maxPrice, page, searchProducts, updateUrl]);

    // Handlers
    const handleSearchClick = () => {
        if (searchQuery.trim()) {
            setPage(1);
            searchProducts();
        }
    };

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    const handleNextPage = () => setPage((prev) => prev + 1);
    const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

    return (
        <div className="container mx-auto py-8 mt-16">
            <div className="space-y-8">
                <div className="flex flex-col items-center space-y-4">
                    <h1 className="text-3xl font-bold text-primary">Search Products</h1>

                    <div className="w-full max-w-2xl flex flex-col gap-4">
                        {/* Search Input */}
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleEnterKey}
                                className="flex-1"
                            />
                            <Button onClick={handleSearchClick} disabled={isLoading}>
                                {isLoading ? 'Searching...' : 'Search'}
                            </Button>
                        </div>

                        <Separator />
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2 items-center justify-center">
                            <Select value={categoryId} onValueChange={(val) => { setCategoryId(val); setPage(1); }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.categoryId} value={String(cat.categoryId)}>
                                            {cat.categoryName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                type="number"
                                placeholder="Min Price"
                                className="w-[120px]"
                                value={minPrice ?? ''}
                                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                            />
                            <Input
                                type="number"
                                placeholder="Max Price"
                                className="w-[120px]"
                                value={maxPrice ?? ''}
                                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {products.map((product) => (
                        <div className="flex justify-center" key={product.productId}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {products.length == 0 && (
                    <div className="w-full flex items-center justify-center">
                        <Image
                            src={"/images/search.png"}
                            alt='search image'
                            width={300}
                            height={300}
                            className="opacity-50"
                        />
                    </div>
                )}

                {/* Pagination */}
                {products.length > 0 && (
                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            variant="outline"
                            onClick={handlePrevPage}
                            disabled={page === 1 || isLoading}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleNextPage}
                            disabled={products.length < 12 || isLoading}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Page Component
const SearchPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
};

export default SearchPage;