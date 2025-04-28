import Link from "next/link";
import CategoryCard from "./category-card";
import { Button } from "./ui/button";
import { CategoryBtoType } from "@/types/category-type";
import { apiUnauth } from "@/lib/api";

const getCategories = async (page: number = 1, limit: number = 8): Promise<CategoryBtoType[]> => {
    try {
        const apiEndPint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/categories/top?page${page}&limit=${limit}`;
        const response = await apiUnauth.get(apiEndPint);
        console.log(response)
        console.log(response.data)
        const categories = (response.data as CategoryBtoType[]).map((category) => ({
            ...category,
            imageUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}${category.imageUrl}`
        }));
        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

const CategorySection = async () => {
    const categories: CategoryBtoType[] = await getCategories();

    return (
        <div id="categories" className="flex justify-center w-full px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl text-center py-8 sm:py-12">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">Categories Section</h1>
                <p className="text-base sm:text-lg mb-6 sm:mb-8">Browse our latest Categories</p>
                {/* Add your category section content here */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {categories.map((category) => (
                        <div className="flex justify-center" key={category.categoryId}>
                            <CategoryCard
                                category={category}
                            />
                        </div>
                    ))}
                </div>
                <Link href={"/categories"}>
                    <Button variant={"outline"} className="mt-8">View More Categories</Button>
                </Link>
            </div>
        </div>
    );
};

export default CategorySection;