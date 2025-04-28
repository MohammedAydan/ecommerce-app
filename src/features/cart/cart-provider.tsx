"use client"

import { CartProvider } from "./cart-context";

const ClientCartProvider = ({ children }: { children: React.ReactNode }) => {
    return <CartProvider>
        {children}
    </CartProvider>
}

export default ClientCartProvider;