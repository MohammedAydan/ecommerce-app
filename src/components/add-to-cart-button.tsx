"use client"
import { useCart } from "@/features/cart/use-cart";
import { ProductDtoType } from "@/types/product-type";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/features/auth/use-auth";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const AddToCartButton = ({ product }: { product: ProductDtoType }) => {
    const { addCartItem, isLoading } = useCart();
    const { user, isLoading: authLoading } = useAuth();

    const addToCartHandler = () => {
        if (!user) {
            redirect("/sign-in");
            return;
        }
        addCartItem(product);
        toast.success("Product added to cart");
    }

    return (
        <Button
            disabled={product.stockQuantity == 0 || isLoading || authLoading}
            onClick={addToCartHandler}
            className="flex-1 py-6 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
        >
            {(isLoading && authLoading) ? (
                <div className="w-10 h-10 rounded-full border-4 border-foreground border-r-transparent animate-spin"></div>
            ) : (<>
                <ShoppingCart className="w-5 h-5" />
                Add to Cart {product.stockQuantity == 0 && "(Out of Stock)"}
            </>)}
        </Button>
    );

}

export default AddToCartButton;