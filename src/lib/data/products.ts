import { ProductDtoType } from '@/types/product-type';
import { CategoryAndMyProductsBtoType } from '@/types/category-type';
import { apiUnauth } from '../api';

export async function getProduct(id: string): Promise<ProductDtoType | null> {
    try {
        const apiEndPoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/${id}`;
        const response = await apiUnauth.get(apiEndPoint);
        const product = {
            ...response.data,
            imageUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.data.imageUrl}`
        };

        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export const getCategoryAndProducts = async (categoryId: number, page: number = 1, limit: number = 20): Promise<CategoryAndMyProductsBtoType | null> => {
    try {
        limit = limit > 50 ? 50 : limit;
        const apiEndpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/Categories/${categoryId}?page=${page}&limit=${limit}&getMyProducts=true`;
        const response = await apiUnauth.get<CategoryAndMyProductsBtoType>(apiEndpoint);
        const category: CategoryAndMyProductsBtoType = {
            ...response.data,
            products: response.data.products.map((product) => ({
                ...product,
                imageUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}${product.imageUrl}`,
            })),
        };
        return category;
    } catch (error) {
        console.error("Error fetching category and products:", error);
        return null;
    }
};