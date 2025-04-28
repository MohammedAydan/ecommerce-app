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
            className="flex items-center justify-between py-4 border-b last:border-none"
        >
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-md">
                    <Image
                        src={item.product?.imageUrl ?? ""}
                        alt={item.product?.productName ?? "Product Image"}
                        width={64}
                        height={64}
                        className="object-cover h-full w-full"
                    />
                </div>
                <div className="flex flex-col">
                    <p className="font-medium">{item.product?.productName}</p>
                    {/* <p className="text-sm text-gray-500">${item.product?.salePrice?.toFixed(2)}</p> */}
                    <div className="flex items-center justify-start gap-2">
                        <span className="text-base font-bold text-primary">${item.product?.salePrice ? item.product.salePrice.toFixed(2) : (item.product?.price ? item.product.price.toFixed(2) : '0.00')}</span>
                        {item.product?.salePrice && item.product?.price && item.product?.salePrice < item.product?.price && (
                            <span className="text-sm text-muted-foreground line-through">${item.product?.price.toFixed(2)}</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Input
                    type="number"
                    value={item.quantity ?? 1}
                    min={1}
                    className="w-20"
                    readOnly
                />
                <Button disabled={isLoading} onClick={decrementCartItemHandler} variant="outline" size="icon" className="cursor-pointer">
                    <IoRemove />
                </Button>
                <Button disabled={isLoading} onClick={incrementCartItemHandler} variant="outline" size="icon" className="cursor-pointer">
                    <IoIosAdd />
                </Button>
                <Button disabled={isLoading} onClick={removeCartItemHandler} variant="destructive" size="sm" className="cursor-pointer">
                    Remove
                </Button>
            </div>
        </div>
    )
}

export default CardCartItem;