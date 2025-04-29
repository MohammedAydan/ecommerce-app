"use client"
import { CartItemType } from "@/types/cart-type";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { useCart } from "@/features/cart/use-cart";
import { IoIosAdd } from "react-icons/io";
import { IoRemove } from "react-icons/io5";

const CardCartItem = ({ item }: { item: CartItemType }) => {
    const { removeCartItem, increment, decrement, isLoading } = useCart();

    const incrementCartItemHandler = () => {
        if (item.productId == null) return;
        increment(item.productId ?? "");
    }

    const decrementCartItemHandler = () => {
        if (item.productId == null) return;
        decrement(item.productId ?? "");
    }

    const removeCartItemHandler = () => {
        if (item.product == null) return;
        removeCartItem(item.product!);
    }

    return (
        <div
            key={item.cartItemId}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b last:border-none space-y-4 sm:space-y-0"
        >
            <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                <div className="h-20 w-20 sm:h-16 sm:w-16 overflow-hidden rounded-md flex-shrink-0">
                    <Image
                        src={item.product?.imageUrl ?? ""}
                        alt={item.product?.productName ?? "Product Image"}
                        width={80}
                        height={80}
                        className="object-cover h-full w-full"
                    />
                </div>
                <div className="flex flex-col flex-grow">
                    <p className="font-medium text-sm sm:text-base line-clamp-2">{item.product?.productName}</p>
                    <div className="flex items-center justify-start gap-2 mt-1">
                        <span className="text-base font-bold text-primary">${item.product?.salePrice ? item.product.salePrice.toFixed(2) : (item.product?.price ? item.product.price.toFixed(2) : '0.00')}</span>
                        {item.product?.salePrice && item.product?.price && item.product?.salePrice < item.product?.price && (
                            <span className="text-sm text-muted-foreground line-through">${item.product?.price.toFixed(2)}</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between">
                <div className="flex items-center gap-2 justify-between md:justify-end w-full">
                    <div className="flex items-center gap-2">
                        <Button disabled={isLoading} onClick={decrementCartItemHandler} variant="outline" size="icon" className="h-8 w-8">
                            <IoRemove className="h-4 w-4" />
                        </Button>
                        <Input
                            type="number"
                            value={item.quantity ?? 1}
                            min={1}
                            className="w-16 h-8 text-center"
                            readOnly
                        />
                        <Button disabled={isLoading} onClick={incrementCartItemHandler} variant="outline" size="icon" className="h-8 w-8">
                            <IoIosAdd className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button disabled={isLoading} onClick={removeCartItemHandler} variant="destructive" size="sm" className="w-auto">
                        Remove
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CardCartItem;