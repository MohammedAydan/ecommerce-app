"use client";
import OrderItemType from "@/types/order-item-type";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineStorefront } from "react-icons/md";

export const OrderItemCard = ({ orderItem }: { orderItem: OrderItemType; }) => {
    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <Link href={`/products/${orderItem.productId}`} key={orderItem.id} className="grid grid-cols-12 p-4 border-t border-gray-200 dark:border-foreground/40">
            <div className="col-span-6 flex items-center gap-3">
                <div className="relative w-12 h-12 overflow-hidden rounded-md border bg-gray-100">
                    {orderItem.product.imageUrl ? (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${orderItem.product.imageUrl}`}
                            alt={orderItem.product.productName || "Product image"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 48px) 100vw, 48px" />
                    ) : (
                        <MdOutlineStorefront className="w-6 h-6 m-3 text-gray-400" />
                    )}
                </div>
                <span>{orderItem.product.productName}</span>
            </div>
            <div className="col-span-2 text-center">{formatCurrency(orderItem.price)}</div>
            <div className="col-span-2 text-center">{orderItem.quantity}</div>
            <div className="col-span-2 text-right font-medium">{formatCurrency(orderItem.price * orderItem.quantity)}</div>
        </Link>
    );
};
