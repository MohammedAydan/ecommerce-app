import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { apiUnauth } from "@/lib/api";
import { ProductDtoType } from "@/types/product-type";
import { Metadata } from "next";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export const metadata: Metadata = {
    title: "Products | E-Commerce Store",
    description: "Browse all available products.",
    openGraph: {
        title: "Products | E-Commerce Store",
        description: "Browse all available products.",
        images: [`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/logo.png`],
        type: "website",
    },
};

const getProducts = async (page: number = 1, limit: number = 10): Promise<ProductDtoType[]> => {
    try {
        limit = limit > 50 ? 50 : limit;
        const apiEndPint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/top?page=${page}&limit=${limit}`;
        const response = await apiUnauth.get(apiEndPint);
        const products = (response.data as ProductDtoType[]).map((product) => ({
            ...product,
            imageUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}${product.imageUrl}`
        }));
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}


type Props = {
    searchParams?: Promise<{ [key: string]: string | undefined }>;
};

async function page({ searchParams }: Props) {
    // Wait for searchParams to be available
    const params = await searchParams;
    const pageParam = Number(params?.["page"]) || 1;
    const limitParam = Number(params?.["limit"]) || 20;
    const products: ProductDtoType[] = await getProducts(pageParam, limitParam);

    return (
        <div className="mt-16">
            <div className="flex justify-center w-full px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl text-center py-8 sm:py-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">Products Section</h1>
                    <p className="text-base sm:text-lg mb-6 sm:mb-8">Browse our latest products</p>
                    {/* Add your category section content here */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {products.map((product) => (
                            <div className="flex justify-center" key={product.productId}>
                                <ProductCard
                                    key={product.productId}
                                    product={product}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-6 py-12">

                {!products && (
                    <div className="text-center text-gray-500">
                        <p>No products available</p>
                    </div>
                )}

                {/* Previous Button */}
                {pageParam > 1 && (
                    <Button
                        variant="ghost"
                        size="lg"
                        className="group relative transition-all duration-300 hover:bg-slate-100 disabled:opacity-50"
                        asChild
                    >
                        <Link
                            href={`?page=${pageParam - 1}&limit=${limitParam}`}
                            className="flex items-center gap-2"
                        >
                            <FiChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            <span>Previous</span>
                        </Link>
                    </Button>
                )}

                {/* Pages Numbers */}
                <div className="flex items-center gap-2">
                    {Array.from({ length: 3 }).map((_, index) => {
                        const page = products.length == limitParam ? (pageParam - 1 + index) : (pageParam - 1 + index) - 1;
                        if (page < 1) return null;

                        return (
                            <Button
                                key={page}
                                variant={page === pageParam ? "default" : "ghost"}
                                size="icon"
                                className="w-10 h-10 rounded-full"
                                asChild
                            >
                                <Link href={`?page=${page}&limit=${limitParam}`}>
                                    {page}
                                </Link>
                            </Button>
                        );
                    })}
                </div>

                {/* Next Button */}
                {products.length >= limitParam && (
                    <Button
                        variant="ghost"
                        size="lg"
                        className="group relative transition-all duration-300 hover:bg-slate-100 disabled:opacity-50"
                        asChild
                    >
                        <Link
                            href={`?page=${pageParam + 1}&limit=${limitParam}`}
                            className="flex items-center gap-2"
                        >
                            <span>Next</span>
                            <FiChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    )
}

export default page