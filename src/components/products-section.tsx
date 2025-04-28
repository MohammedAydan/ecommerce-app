import Link from "next/link";
import ProductCard from "./product-card";
import { Button } from "./ui/button";
import { ProductDtoType } from "@/types/product-type";
import { apiUnauth } from "@/lib/api";

const getProducts = async (page: number = 1, limit: number = 10): Promise<ProductDtoType[]> => {
    try {
        const apiEndPint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/top?page${page}&limit=${limit}`;
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

const ProductsSection = async () => {
    const products: ProductDtoType[] = await getProducts(1, 30);
    console.log(products)

    return (
        <div className="flex justify-center w-full px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl text-center py-8 sm:py-12 border-t-1 border-t-foreground/30">
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
                <Link href="/products">
                    <Button variant={"outline"} className="mt-8">View More Products</Button>
                </Link>
            </div>
        </div>
    );
};

export default ProductsSection;