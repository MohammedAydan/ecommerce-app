"use client"
import { XCircle, Home } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaymentFailed() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="flex flex-col items-center text-center space-y-6 max-w-md"
            >
                {/* Animated X Icon */}
                <div className="relative">
                    <div className="absolute inset-0 bg-rose-400/20 blur-xl rounded-full animate-pulse" />
                    <div className="p-4 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full relative z-10 shadow-lg">
                        <XCircle className="h-12 w-12 text-white" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                        Payment Failed
                    </CardTitle>
                    <p className="text-gray-500 text-lg font-light">
                        We couldn&apos;t process your payment. Please try again.
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="flex space-x-2 pt-2">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                delay: i * 0.2,
                            }}
                            className="h-2 w-2 bg-rose-400 rounded-full"
                        />
                    ))}
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-6 w-full space-y-3"
                >
                    <Button
                        variant="outline"
                        onClick={() => router.push('/')}
                        className="w-full max-w-xs border-rose-500 text-rose-600 hover:bg-rose-50"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Go to Home
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}