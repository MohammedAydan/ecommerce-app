import Link from "next/link";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { MdOutlineStorefront } from "react-icons/md";

interface InvoiceCardProps {
    invoice: {
        id: string;
        invoice_id: number;
        invoice_key: string;
        payment_data?: string | null;
        order: {
            totalAmount: number;
            shippingAddress?: string;
            paymentMethod: string;
            orderItems: {
                id: string;
                productName: string;
                quantity: number;
                price: number;
            }[];
        };
        status: string;
        createdAt: string;
    };
    formatDate: (date: string) => string;
    formatCurrency: (amount: number) => string;
}

const InvoiceCard = ({ invoice, formatDate, formatCurrency }: InvoiceCardProps) => {
    console.log(invoice);
    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'default';
            case 'processing':
                return 'secondary';
            case 'cancelled':
                return 'destructive';
            case 'shipped':
                return 'outline';
            default:
                return 'outline';
        }
    };

    return (
        <Link
            href={`/invoices/${invoice.id}`}
            className="group border rounded-xl p-6 bg-white dark:bg-[#1f1f1f] hover:shadow-md transition-shadow flex flex-col gap-5"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Invoice #{invoice.invoice_id}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Created on {formatDate(invoice.createdAt)}
                    </p>
                </div>
                <Badge
                    variant={getStatusBadgeVariant(invoice.status) as "default" | "secondary" | "destructive" | "outline"}
                    className="capitalize"
                >
                    {invoice.status}
                </Badge>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                    <div className="bg-muted rounded-md p-4">
                        <MdOutlineStorefront size={32} className="text-primary" />
                    </div>
                    <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">Total Amount</p>
                        <p className="text-base font-medium">{formatCurrency(invoice.order.totalAmount)}</p>

                        <p className="text-muted-foreground mt-3">Payment Method</p>
                        <p className="text-sm">{invoice.order.paymentMethod}</p>

                        {invoice.invoice_key && (
                            <>
                                <p className="text-muted-foreground mt-3">Invoice Key</p>
                                <p className="font-mono text-xs break-all text-primary">{invoice.invoice_key}</p>
                            </>
                        )}
                    </div>
                </div>

                {invoice.order.orderItems?.length > 0 && (
                    <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-md border">
                        <p className="font-medium mb-2 text-sm">Items ({invoice.order.orderItems.length}):</p>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                            {invoice.order.orderItems.map(item => (
                                <li key={item.id}>
                                    {item.quantity}× {item.productName} —{" "}
                                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Link>
    );
};

export default InvoiceCard;
