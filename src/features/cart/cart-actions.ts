import apiClient from "@/lib/api";
import CartType, { CartItemType } from "@/types/cart-type";
import CheckoutResponseType from "@/types/checkout-response-type";

export const getMyCart = async (): Promise<CartType | null> => {
    try {
        const response = await apiClient.get("Carts?page=1&limit=100");
        if (response.status == 204 || response.status == 201 || response.status == 200) {
            const finalData: CartType = {
                ...response.data,
                cartItems: response.data.cartItems.map((item: CartItemType) => ({
                    ...item,
                    product: {
                        ...item.product,
                        imageUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.product?.imageUrl}`,
                    },
                }))
            };
            return finalData;
        }
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const addToCart = async (productId: string): Promise<boolean> => {
    try {
        const response = await apiClient.post("Carts/add", productId);
        if (response.status == 204 || response.status == 201 || response.status == 200) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const removeItemFromCart = async (productId: string): Promise<boolean> => {
    try {
        const response = await apiClient.delete("Carts/remove", {
            data: productId,
        });
        if (response.status == 204 || response.status == 201 || response.status == 200) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const removeFromCart = async (productId: string): Promise<boolean> => {
    try {
        const response = await apiClient.delete("Carts/remove?removeAll=true", {
            data: productId,
        });
        if (response.status == 204 || response.status == 201 || response.status == 200) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const createCheckout = async ({ shippingAddress, paymentMethod, shippingPrice }: { shippingAddress: string, paymentMethod: string, shippingPrice: number }): Promise<CheckoutResponseType | null> => {
    try {
        const response = await apiClient.post<CheckoutResponseType>("Checkout", {
            shippingAddress,
            paymentMethod,
            shippingPrice,
        });
        if (response.status == 204 || response.status == 201 || response.status == 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}