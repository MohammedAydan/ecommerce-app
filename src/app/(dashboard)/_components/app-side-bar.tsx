import { 
  HomeIcon, 
  ListOrderedIcon, 
  PackageIcon, 
  UsersIcon, 
  ShoppingCartIcon,
  Settings2Icon
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/admin",
    icon: HomeIcon,
  },
  {
    title: "Categories",
    url: "/admin/categories", 
    icon: ListOrderedIcon,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: PackageIcon,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: UsersIcon,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCartIcon,
  },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarHeader className="border-b border-border/40 px-6 py-4">
        <Link href="/admin" className="flex items-center gap-2">
          <Settings2Icon className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-primary">Dashboard</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-muted-foreground/70">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        href={item.url}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary",
                          isActive && "bg-muted text-primary"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
