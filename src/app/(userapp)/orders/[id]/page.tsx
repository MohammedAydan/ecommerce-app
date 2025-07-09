"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api";
import Loading from "@/components/loading";
import { MdArrowBack, MdLocalShipping, MdPayment, MdCalendarToday, MdOutlineStorefront } from "react-icons/md";
import OrderType from "@/types/order-type";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { id } = await params;
        const response = await apiClient.get(`Orders/${id}?includeProducts=true&limit=100`);
        setOrder(response.data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        setError("Failed to load order details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  const getStatusDetails = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('processing')) return {
      variant: 'secondary',
      progress: 25,
      color: 'bg-blue-500',
      steps: ['Order Placed', 'Processing', 'Shipped', 'Delivered'],
      currentStep: 1
    };
    if (statusLower.includes('shipped')) return {
      variant: 'default',
      progress: 65,
      color: 'bg-purple-500',
      steps: ['Order Placed', 'Processing', 'Shipped', 'Delivered'],
      currentStep: 2
    };
    if (statusLower.includes('completed')) return {
      variant: 'default',
      progress: 100,
      color: 'bg-green-500',
      steps: ['Order Placed', 'Processing', 'Shipped', 'Delivered'],
      currentStep: 3
    };
    if (statusLower.includes('cancelled') || statusLower.includes('failed')) return {
      variant: 'destructive',
      progress: 100,
      color: 'bg-red-500',
      steps: ['Order Placed', 'Cancelled'],
      currentStep: 1
    };
    if (statusLower.includes('pending')) return {
      variant: 'outline',
      progress: 10,
      color: 'bg-yellow-500',
      steps: ['Order Placed', 'Pending Payment'],
      currentStep: 0
    };
    
    return {
      variant: 'outline',
      progress: 0,
      color: 'bg-gray-500',
      steps: ['Order Received'],
      currentStep: 0
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => router.back()} className="mt-4">
          Return to Orders
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Return to Orders
        </Button>
      </div>
    );
  }

  const statusDetails = getStatusDetails(order.status);
  const paymentStatusDetails = getStatusDetails(order?.paymentStatus?.toLowerCase() || 'pending');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <MdArrowBack size={20} />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
      </div>
      
      <Separator className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Order #{order.id}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant={statusDetails.variant as any}>
                    {order.status}
                  </Badge>
                  <Badge variant={paymentStatusDetails.variant as any}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="mb-6">
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
              
              {/* Custom Timeline */}
              <div className="relative pl-6">
                {statusDetails.steps.map((step, index) => (
                  <div key={step} className="relative pb-6 last:pb-0">
                    <div className="absolute left-0 top-1 h-full w-6 flex flex-col items-center">
                      <div className={`rounded-full w-3 h-3 ${index <= statusDetails.currentStep ? statusDetails.color : 'bg-gray-200'}`} />
                      {index < statusDetails.steps.length - 1 && (
                        <div className={`flex-1 w-px ${index < statusDetails.currentStep ? statusDetails.color : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="ml-4 px-2">
                      <p className={`text-sm ${index <= statusDetails.currentStep ? 'font-medium' : 'text-muted-foreground'}`}>
                        {step}
                      </p>
                      {index === 0 && (
                        <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                    <div className="bg-muted rounded-md p-2">
                      <div className="w-16 h-16 flex items-center justify-center bg-primary/10 text-primary">
                        <MdOutlineStorefront size={24} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground">SKU: {item.productId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      <p className="text-sm text-muted-foreground">{item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex-col items-end space-y-2">
              <div className="flex justify-between w-full max-w-xs">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.totalAmount - order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between w-full max-w-xs">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatCurrency(order.shippingPrice)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between w-full max-w-xs font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Order Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdLocalShipping />
                <span>Shipping Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Shipping Address</p>
                <p className="font-medium">{order.shippingAddress}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shipping Method</p>
                <p className="font-medium">Standard Delivery</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p className="font-medium">
                  {statusDetails.currentStep >= 2 ? 
                    "Arriving in 2-3 business days" : 
                    "Will be calculated after processing"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdPayment />
                <span>Payment Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <p className="font-medium">
                  <Badge variant={paymentStatusDetails.variant as any}>
                    {order.paymentStatus}
                  </Badge>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invoice ID</p>
                <p className="font-medium">{order.invoiceId || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdCalendarToday />
                <span>Order Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Order Placed</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(order.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}