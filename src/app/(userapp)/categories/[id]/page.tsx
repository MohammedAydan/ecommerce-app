import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { apiUnauth } from "@/lib/api";
import { ProductDtoType } from "@/types/product-type";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Define proper Next.js App Router types
export interface CategoryPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const getProducts = async (categoryId: string, page: number = 1, limit: number = 20): Promise<ProductDtoType[]> => {
  try {
    limit = limit > 50 ? 50 : limit;
    const apiEndpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/Products/category/${categoryId}?page=${page}&limit=${limit}`;
    const response = await apiUnauth.get(apiEndpoint);
    const products = (response.data as ProductDtoType[]).map((product) => ({
      ...product,
      imageUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}${product.imageUrl}`,
    }));
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Make sure to use this exact function signature
export default async function Page({ params, searchParams }: CategoryPageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const pageParam = Number(sp["page"] || "1");
  const limitParam = Number(sp["limit"] || "20");
  const products = await getProducts(id, pageParam, limitParam);

  return (
    <div className="mt-16">
      <div className="flex justify-center w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl text-center py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
            Category: {id}
          </h1>
          <p className="text-base sm:text-lg mb-6 sm:mb-8">
            Browse our latest products
          </p>

          {products.length === 0 ? (
            <div className="flex justify-center">
              <p>No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <div className="flex justify-center" key={product.productId}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <div className="w-full flex items-center justify-center gap-6 py-12">
            {/* Previous Button */}
            {pageParam > 1 && (
              <Button
                variant="ghost"
                size="lg"
                className="group relative transition-all duration-300 hover:bg-slate-100 disabled:opacity-50"
                asChild
              >
                <Link
                  href={`/categories/${id}?page=${pageParam - 1}&limit=${limitParam}`}
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
                const page = products.length === limitParam ? (pageParam - 1 + index) : (pageParam - 1 + index) - 1;
                if (page < 1) return null;

                return (
                  <Button
                    key={page}
                    variant={page === pageParam ? "default" : "ghost"}
                    size="icon"
                    className="w-10 h-10 rounded-full"
                    asChild
                  >
                    <Link href={`/categories/${id}?page=${page}&limit=${limitParam}`}>
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
                  href={`/categories/${id}?page=${pageParam + 1}&limit=${limitParam}`}
                  className="flex items-center gap-2"
                >
                  <span>Next</span>
                  <FiChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}