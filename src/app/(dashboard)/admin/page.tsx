"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  UsersIcon,
  PackageIcon,
  ShoppingCartIcon,
  DollarSignIcon
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { apiBaseUrl } from "@/app/utils/strings"
import { getAccessToken } from "@/lib/api"
import { Separator } from "@/components/ui/separator"
import UsersPage from "./users/page"

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  activeUsers: number
  revenueGrowth: number
  ordersGrowth: number
  productsGrowth: number
  usersGrowth: number
}

function DashboardCard({
  title,
  value,
  icon: Icon,
  description,
  isLoading
}: {
  title: string
  value: string | number
  icon: React.ElementType
  description?: string
  isLoading?: boolean
}) {
  return (
    <Card className={isLoading ? "animate-pulse" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {isLoading ? <div className="h-4 w-24 bg-gray-200 rounded"/> : title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${isLoading ? 'text-gray-200' : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? <div className="h-8 w-32 bg-gray-200 rounded"/> : value}
        </div>
        {(description || isLoading) && (
          <p className="text-xs text-muted-foreground">
            {isLoading ? <div className="h-3 w-28 bg-gray-200 rounded mt-2"/> : description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function LoadingDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="h-9 w-40 bg-gray-200 rounded animate-pulse"/>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <DashboardCard
            key={i}
            title=""
            value=""
            icon={i === 0 ? DollarSignIcon : i === 1 ? ShoppingCartIcon : i === 2 ? PackageIcon : UsersIcon}
            isLoading={true}
          />
        ))}
      </div>
    </div>
  )
}

function Page() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const url = `${apiBaseUrl}/api/v1/dashboard/stats`;

      const accessToken = getAccessToken();
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? '',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }
      return res.json()
    }
  })

  if (isLoading) {
    return <LoadingDashboard />
  }

  if (!stats) {
    return null
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSignIcon}
          description={`${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}% from last month`}
        />
        <DashboardCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCartIcon}
          description={`${stats.ordersGrowth > 0 ? '+' : ''}${stats.ordersGrowth} since last hour`}
        />
        <DashboardCard
          title="Products"
          value={stats.totalProducts}
          icon={PackageIcon}
          description={`${stats.productsGrowth > 0 ? '+' : ''}${stats.productsGrowth} added today`}
        />
        <DashboardCard
          title="Active Users"
          value={stats.activeUsers}
          icon={UsersIcon}
          description={`${stats.usersGrowth > 0 ? '+' : ''}${stats.usersGrowth} since last month`}
        />
      </div>

      <Separator />
      {!isLoading && (
        <div className="w-full">
          <UsersPage />
        </div>
      )}
    </div>
  )
}

export default Page