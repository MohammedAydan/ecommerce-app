import CartType, { CartItemType } from "@/types/cart-type";
import ProductDtoType from "@/types/product-type";
import React, { createContext, useEffect, useState } from "react";
import { addToCart, getMyCart, removeFromCart, removeItemFromCart } from "./cart-actions";
import { useAuth } from "../auth/use-auth";

export interface CartContextProps {
    cart: CartType;
    loadCart: boolean;
    loadCartError: string | null;
    isLoading: boolean;
    error: string | null;
    addCartItem: (product: ProductDtoType) => Promise<void>;
    removeCartItem: (product: ProductDtoType) => Promise<void>;
    increment: (productId: string) => Promise<void>;
    decrement: (productId: string) => Promise<void>;
    getItemsCount: () => number;
    subtotal: () => number;
    shipping: number;
    total: () => number;
    clearCart: () => void;
}

export const CartContext = createContext<CartContextProps | undefined>(undefined);

const createCartItem = (product: ProductDtoType): CartItemType => ({
    cartItemId: null,
    productId: product.productId,
    quantity: 1,
    product,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState<CartType>({
        cartId: null,
        userId: null,
        cartItems: [],
    });
    const [loadCart, setLoadCart] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadCartError, setLoadCartError] = useState<string | null>(null);
    const shipping = 70;

    const getItemsCount = () => {
        return cart.cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
    };

    const subtotal = () => {
        return cart.cartItems.reduce((total, item) => {
            if (!item.product || !item.quantity) return total;

            const price = item.product.price ?? 0;
            const discount = item.product.discount || 0;
            const discountedPrice = price - (price * (discount / 100));

            return total + (discountedPrice * item.quantity);
        }, 0);
    };

    const total = () => {
        return subtotal() + shipping;
    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoadCart(true);
                setLoadCartError(null);
                const response = await getMyCart();
                console.log(response)
                if (response == null) {
                    setCart({
                        cartId: null,
                        userId: null,
                        cartItems: [],
                    });
                    return;
                }
                setCart(response);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                setLoadCartError(`Failed to fetch cart: ${errorMessage}`);
            } finally {
                setLoadCart(false);
            }
        }
        fetchCart();
    }, [user]);

    const updateCartItemQuantity = (productId: string, delta: number) => {
        setCart((prevCart) => ({
            ...prevCart,
            cartItems: prevCart.cartItems.map((item) =>
                item.productId === productId && (delta == 1 ? ((item.quantity ?? 1) < 10) : ((item.quantity ?? 1) > 1))
                    ? { ...item, quantity: Math.max(0, (item.quantity || 0) + delta) }
                    : item
            ).filter(item => (item.quantity || 0) > 0),
        }));
    };

    const increment = async (productId: string): Promise<void> => {
        try {
            setIsLoading(true);
            const existingItem = cart.cartItems.find(
                (item) => item.productId === productId
            );

            if (existingItem != null && existingItem!.quantity! >= 10) {
                return;
            }

            const isSuccess = await addToCart(productId);
            if (!isSuccess) {
                setError("Error add to cart.");
                return;
            }
            updateCartItemQuantity(productId, 1);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const decrement = async (productId: string): Promise<void> => {
        try {
            setIsLoading(true);
            const existingItem = cart.cartItems.find(
                (item) => item.productId === productId
            );

            if (existingItem != null && existingItem!.quantity! <= 1) {
                return;
            }

            const isSuccess = await removeItemFromCart(productId);
            if (!isSuccess) {
                setError("Error remove from cart.");
                return;
            }
            updateCartItemQuantity(productId, -1);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const addCartItem = async (product: ProductDtoType): Promise<void> => {
        if (!product.productId) {
            throw new Error('Product ID is required');
        }

        try {
            setIsLoading(true);
            setError(null);

            const existingItem = cart.cartItems.find(
                (item) => item.productId === product.productId
            );

            if (existingItem != null && existingItem!.quantity! >= 10) {
                return;
            }

            const isSuccess = await addToCart(product.productId);
            if (!isSuccess) {
                setError("Error add to cart.");
                return;
            }

            if (existingItem) {
                updateCartItemQuantity(product.productId, 1);
                return;
            }

            const newItem = createCartItem(product);
            setCart((prevCart) => ({
                ...prevCart,
                cartItems: [...prevCart.cartItems, newItem],
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            setError(`Failed to add item to cart: ${errorMessage}`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const removeCartItem = async (product: ProductDtoType): Promise<void> => {
        if (!product.productId) {
            throw new Error('Product ID is required');
        }

        try {
            setIsLoading(true);
            setError(null);
            const isSuccess = await removeFromCart(product.productId);
            if (!isSuccess) {
                setError("Error remove from cart.");
                return;
            }

            setCart((prevCart) => ({
                ...prevCart,
                cartItems: prevCart.cartItems.filter(
                    (item) => item.productId !== product.productId
                ),
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            setError(`Failed to remove item from cart: ${errorMessage}`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const clearCart = () => {
        setCart({
            cartId: null,
            userId: null,
            cartItems: [],
        });
    }


    return (
        <CartContext.Provider
            value={{
                cart,
                loadCart,
                loadCartError,
                isLoading,
                error,
                addCartItem,
                removeCartItem,
                increment,
                decrement,
                getItemsCount,
                subtotal,
                shipping,
                total,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
