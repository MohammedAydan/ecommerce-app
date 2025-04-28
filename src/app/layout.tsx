import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import ClientCartProvider from "@/features/cart/cart-provider";
import ClientAuthProvider from "@/features/auth/auth-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Commerce App",
  description: "New E-Commerce app",
  openGraph: {
    title: "E-Commerce App",
    description: "New E-Commerce app",
    images: ["/favicon.ico"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* theme provider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* auth provider */}
          <ClientAuthProvider>
            {/* cart provider */}
            <ClientCartProvider>
              {/* header */}
              <Header />
              {/* my app pages */}
              {children}
            </ClientCartProvider>
          </ClientAuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
