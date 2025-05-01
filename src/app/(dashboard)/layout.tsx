"use client"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React, { ReactNode } from 'react'
import AppSideBar from './_components/app-side-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/use-auth'
import { redirect } from 'next/navigation'

export const queryClient = new QueryClient()

const Layout = ({ children }: { children: ReactNode }) => {
    const { isLoading, user } = useAuth();
    
    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col gap-4 items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary">
                    <div className="w-28 h-28 rounded-full border-4 border-gray-200"></div>
                </div>
                <p className="text-lg font-medium text-gray-600">Checking authorization...</p>
            </div>
        )
    }

    if (!user || !user.roles?.some(role => role.toLowerCase() === 'admin')) {
        redirect('/sign-in')
    }
    
    return (
        <div className="w-full">
            <QueryClientProvider client={queryClient}>
                <SidebarProvider>
                    <AppSideBar />
                    <SidebarTrigger />
                    {children}
                </SidebarProvider>
            </QueryClientProvider>
        </div>
    )
}

export default Layout