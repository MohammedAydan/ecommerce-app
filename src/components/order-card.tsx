import Link from "next/link";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { MdOutlineStorefront } from "react-icons/md";
import OrderType from "@/types/order-type";

interface OrderCardProps {
    order: OrderType;
    formatDate: (date: string) => string;
    formatCurrency: (amount: number) => string;
}

const OrderCard = ({ order, formatDate, formatCurrency }: OrderCardProps) => {
    // Map status to appropriate badge variant
    const getStatusVariant = (status: string) => {
        switch(status.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'processing':
                return 'warning';
            case 'cancelled':
                return 'destructive';
            case 'pending':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <Link href={`orders/${order.id}`} className="rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">Order #{order.id}</h2>
                <Badge variant={getStatusVariant(order.status) as "destructive" | "secondary" | "outline" | "default"}>
                    {order.status}
                </Badge>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex flex-col md:flex-row justify-between gap-6 mt-3">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <MdOutlineStorefront size={60} className="text-primary" />
                    </div>
                    <div className="space-y-2">
                        <p className="font-medium">Total: <span className="font-bold">{formatCurrency(order.totalAmount)}</span></p>
                        <p>Payment method: <span className="font-medium">{order.paymentMethod}</span></p>
                        <p>Address: <span className="font-medium">{order.shippingAddress}</span></p>
                        <p>Created: <span className="font-medium">{formatDate(order.createdAt)}</span></p>
                    </div>
                </div>
                
                {order.orderItems && order.orderItems.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium mb-2">Items: {order.orderItems.length}</p>
                        <ul className="text-sm space-y-1">
                            {order.orderItems.map(item => (
                                <li key={item.id}>
                                    {item.quantity}x {item.productName} - {formatCurrency(item.price * item.quantity)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Link>
    );
}

export default OrderCard;