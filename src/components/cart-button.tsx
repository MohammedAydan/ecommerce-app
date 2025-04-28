"use client"
import Link from "next/link";
import { Button } from "./ui/button";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/features/cart/use-cart";

const CartButton = () => {
    const { getItemsCount } = useCart();
    return (
        <Link href="/cart" className="relative">
            <Button size={"icon"} variant={"outline"}>
                <FiShoppingCart className="w-5 h-5" />
            </Button>
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 border rounded-full">
                {getItemsCount()}
            </span>
        </Link>
    );
}

export default CartButton;