import Link from "next/link";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { MdOutlineStorefront } from "react-icons/md";
import OrderType from "@/types/order-type";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";

interface OrderCardProps {
  order: OrderType;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

const OrderCard = ({ order, formatDate, formatCurrency }: OrderCardProps) => {
  // Map status to appropriate badge variant and progress
  const getStatusDetails = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('processing')) return {
      variant: 'secondary',
      progress: 25,
      color: 'bg-blue-500'
    };
    if (statusLower.includes('shipped')) return {
      variant: 'default',
      progress: 65,
      color: 'bg-purple-500'
    };
    if (statusLower.includes('completed')) return {
      variant: 'default',
      progress: 100,
      color: 'bg-green-500'
    };
    if (statusLower.includes('cancelled') || statusLower.includes('failed')) return {
      variant: 'destructive',
      progress: 100,
      color: 'bg-red-500'
    };
    if (statusLower.includes('pending')) return {
      variant: 'outline',
      progress: 10,
      color: 'bg-yellow-500'
    };
    
    return {
      variant: 'outline',
      progress: 0,
      color: 'bg-gray-500'
    };
  };

  const statusDetails = getStatusDetails(order.status);
  const paymentStatusDetails = getStatusDetails(order?.paymentStatus?.toLowerCase() || 'pending');

  return (
    <Link href={`orders/${order.id}`}>
      <Card className="hover:shadow-lg transition-shadow hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold">
              Order #{order.id}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={statusDetails.variant as any}>
                {order.status}
              </Badge>
              <Badge variant={paymentStatusDetails.variant as any}>
                {order.paymentStatus}
              </Badge>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Order Progress</span>
              <span>{statusDetails.progress}%</span>
            </div>
            <Progress value={statusDetails.progress} className="h-2" />
            <style jsx>{`
              .progress-indicator {
                background-color: ${statusDetails.color.replace('bg-', '')};
              }
            `}</style>
          </div>
        </CardHeader>
        
        <CardContent>
          <Separator className="mb-4" />
          
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <MdOutlineStorefront size={60} className="text-primary" />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm">
                  <span className="text-muted-foreground">Total:</span> 
                  <span className="font-medium ml-2">{formatCurrency(order.totalAmount)}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Payment:</span> 
                  <span className="font-medium ml-2">{order.paymentMethod}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Invoice:</span> 
                  <span className="font-medium ml-2">{order?.invoiceId || 'N/A'}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Created:</span> 
                  <span className="font-medium ml-2">{formatDate(order.createdAt)}</span>
                </p>
              </div>
            </div>

            {order.orderItems && order.orderItems.length > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg min-w-[200px]">
                <p className="font-medium text-sm mb-2">
                  {order.orderItems.length} {order.orderItems.length === 1 ? 'Item' : 'Items'}
                </p>
                <ul className="text-sm space-y-1">
                  {order.orderItems.slice(0, 2).map(item => (
                    <li key={item.id} className="truncate">
                      {item.quantity}x {item.productName}
                    </li>
                  ))}
                  {order.orderItems.length > 2 && (
                    <li className="text-muted-foreground">
                      +{order.orderItems.length - 2} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default OrderCard;