import { MdDelete } from "react-icons/md";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useCart } from "@/features/cart/use-cart";

const CardDiscount = () => {
    const { total, isLoading, } = useCart();

    return (
        <div className=""></div>
    )

    return (
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
    )
}

export default CardDiscount;