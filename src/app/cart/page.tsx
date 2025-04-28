'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Badge } from '@/components/ui/badge'
import { MdDelete } from "react-icons/md";
import { useCart } from '@/features/cart/use-cart'
import CardCartItem from '@/components/card-cart-item'
import { CheckoutDialog } from '@/components/checkout-dialog'

const CartPage = () => {
    const { subtotal, shipping, total, cart, getItemsCount, isLoading, loadCart } = useCart();

    return (
        <div className="container mx-auto py-16">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cart Items</CardTitle>
                            <CardDescription>Review your items before checkout</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* {loadCartError && <p className="text-red-500">{loadCartError}</p>} */}
                            {loadCart && (
                                <div className="flex justify-center items-center h-48">
                                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-r-transparent border-foreground"></div>
                                </div>
                            )}
                            {!loadCart && cart?.cartItems?.map((item) => <CardCartItem key={item.productId} item={item} />)}
                            {!loadCart && cart?.cartItems?.length == 0 && <p className="text-center">Your cart is empty.</p>}
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="flex flex-col gap-4">
                    {/* Coupon Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Coupon</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Label htmlFor="coupon-input">Enter coupon code</Label>
                            <Input id="coupon-input" placeholder="Coupon code" />
                            <Separator />
                            <div className="flex justify-between font-bold bg-primary/10 p-2 rounded-lg">
                                <div className="flex justify-between items-center gap-3">
                                    <Badge variant={"destructive"}><MdDelete /> Remove</Badge>
                                    <span className="line-through">coupon10</span>

                                </div>
                                <span className='text-green-600'>-${total().toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={isLoading} className="w-full">Apply Coupon</Button>
                        </CardFooter>
                    </Card>

                    {/* Order Total Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        {getItemsCount() == 0 ? (<></>) : (
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal()?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${total().toFixed(2)}</span>
                                </div>
                            </CardContent>
                        )}

                        <CardFooter>
                            <CheckoutDialog disableButton={getItemsCount() == 0 || isLoading} />
                            {/* <Button className="w-full" disabled={getItemsCount() == 0 || isLoading}>Proceed to Checkout</Button> */}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default CartPage
