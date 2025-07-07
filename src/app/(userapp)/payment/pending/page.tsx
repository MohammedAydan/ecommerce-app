"use client"
import { Clock, Home, RefreshCw, CreditCard, ShoppingBag } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaymentPending() {
    const router = useRouter();

    const handleRefresh = () => {
        // Add any additional refresh logic here before reloading
        window.location.reload();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="flex flex-col items-center text-center space-y-6 max-w-md"
            >
                {/* Animated Clock */}
                <div className="relative">
                    <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full animate-pulse" />
                    <div className="p-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full relative z-10 shadow-lg">
                        <Clock className="h-12 w-12 text-white" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                        Payment Pending
                    </CardTitle>
                    <p className="text-gray-500 text-lg font-light">
                        We're verifying your payment. This may take a few minutes.
                    </p>
                </div>

                {/* Animated Loading Dots */}
                <div className="flex space-x-2 pt-2">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -5, 0],
                                opacity: [0.6, 1, 0.6],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                delay: i * 0.3,
                            }}
                            className="h-2.5 w-2.5 bg-amber-400 rounded-full"
                        />
                    ))}
                </div>

                {/* Action Buttons - Improved Layout */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-6 w-full space-y-3"
                >
                    <Button
                        onClick={() => router.push('/orders')}
                        variant="outline"
                        className="w-full border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        View Orders
                    </Button>

                    <Button
                        onClick={() => router.push('/')}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Go to Home
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}