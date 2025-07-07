"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createCheckout } from "@/features/cart/cart-actions"
import CheckoutResponseType from "@/types/checkout-response-type"
import { useAuth } from "@/features/auth/use-auth"
import { useCart } from "@/features/cart/use-cart"
import { toast } from "sonner"
import Link from "next/link"
import apiClient from "@/lib/api"
import { redirect, useRouter } from "next/navigation"

export function CheckoutDialog({ disableButton }: { disableButton: boolean }) {
    const { user } = useAuth()
    const { clearCart, shipping } = useCart();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState("")
    const [shippingAddress, setShippingAddress] = useState("")
    const [errors, setErrors] = useState<{ shippingAddress?: string; paymentMethod?: string }>({})
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [checkoutRes, setCheckoutRes] = useState<CheckoutResponseType | null>(null)

    // Pre-fill user address if available
    useEffect(() => {
        if (user?.address) {
            setShippingAddress(user.address)
        }
    }, [user?.address])

    const validate = () => {
        const newErrors: typeof errors = {}
        if (!shippingAddress.trim()) newErrors.shippingAddress = "Address is required"
        if (!paymentMethod.trim()) newErrors.paymentMethod = "Payment method is required"
        return newErrors
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        try {
            setLoading(true)
            
            if (paymentMethod === "Card") {
                const response = await apiClient.post("/payment/invoiceInitPay", {
                    paymentMethod: "2",
                    shippingAddress: shippingAddress,
                    shippingPrice: shipping,
                });

                if (!response.data?.success) {
                    setError(response.data?.message || "Something went wrong. Please try again.")
                    return
                }

                const redirectUrl = response.data?.data?.payment_data?.redirectTo;
                if (redirectUrl) {
                    // Clear cart before redirecting
                    clearCart();
                    // Redirect to payment gateway
                    // router.push(redirectUrl);
                    redirect(redirectUrl);
                    return;
                } else {
                    setError("Payment gateway URL not found");
                    return;
                }
            } else {
                const response = await createCheckout({ 
                    shippingAddress, 
                    paymentMethod, 
                    shippingPrice: shipping 
                });

                if (!response) {
                    setError("Something went wrong. Please try again.")
                    return
                }

                setCheckoutRes(response)
                setShippingAddress(user?.address ?? "")
                setPaymentMethod("")
                setErrors({})
                clearCart();
                toast.success("Order placed successfully!");
            }
        } catch (err) {
            console.error(err)
            setError(err?.toString() || "An unexpected error occurred.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full" disabled={disableButton}>
                    Proceed to Checkout
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <span>{error}</span>
                    </div>
                )}

                {checkoutRes ? (
                    <div className="space-y-3 text-center">
                        <h2 className="text-xl font-semibold text-green-600">Checkout Successful</h2>
                        <p className="text-sm text-muted-foreground">Your order has been placed successfully.</p>
                        <div className="text-sm space-y-1 flex flex-col items-start">
                            <p><strong>Order ID:</strong> {checkoutRes.orderId}</p>
                            <p><strong>Payment:</strong> {checkoutRes.paymentMethod}</p>
                            <p><strong>Total:</strong> ${checkoutRes.totalAmount}</p>
                            <p><strong>Message:</strong> {checkoutRes.message}</p>
                        </div>
                        <Link href={`/orders/${checkoutRes.orderId}`}>
                            <Button className="w-full mt-3">Show Order</Button>
                        </Link>
                    </div>
                ) : loading ? (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center p-5">
                        <div className="w-12 h-12 rounded-full border-4 border-foreground border-r-transparent animate-spin">
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Checkout</DialogTitle>
                            <DialogDescription>
                                Enter your address and select a payment method to complete your order.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            {/* Payment Method */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="payment-method" className="text-right">
                                    Payment
                                </Label>
                                <div className="col-span-3">
                                    <Select
                                        onValueChange={(value) => setPaymentMethod(value)}
                                        value={paymentMethod}
                                    >
                                        <SelectTrigger id="payment-method" className="w-full">
                                            <SelectValue placeholder="Select payment method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Card">Card</SelectItem>
                                            <SelectItem value="CashOnDelivery">Cash on delivery</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.paymentMethod && (
                                        <p className="text-xs text-red-500 mt-1">{errors.paymentMethod}</p>
                                    )}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="address" className="text-right">
                                    Address
                                </Label>
                                <div className="col-span-3">
                                    <Input
                                        id="address"
                                        placeholder="Enter your address"
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                    />
                                    {errors.shippingAddress && (
                                        <p className="text-xs text-red-500 mt-1">{errors.shippingAddress}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Processing..." : "Place Order"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}