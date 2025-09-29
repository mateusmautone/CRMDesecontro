"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Briefcase, PanelLeft, Kanban } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import React from 'react'

import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { AppLogo } from "@/components/icons"

type NavItem = {
  href: string
  label: string
  icon: React.ElementType
  isDefaultCollapsed?: boolean
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/negotiations", label: "Negociações", icon: Briefcase },
  { href: "/leads", label: "Leads", icon: Kanban, isDefaultCollapsed: true },
]

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { setIsDefaultCollapsed } = useSidebar();
  
  const currentNavItem = navItems.find((item) => item.href === pathname);

  React.useEffect(() => {
    setIsDefaultCollapsed(currentNavItem?.isDefaultCollapsed || false);
  }, [pathname, setIsDefaultCollapsed, currentNavItem]);


  return (

      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <AppLogo className="size-8 text-primary" />
            <h1 className="font-headline text-lg font-semibold text-primary">
              Desencontro CRM
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
              <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
          <SidebarTrigger className="md:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Alternar Menu</span>
          </SidebarTrigger>
          <div className="flex-1">
            <h2 className="font-headline text-2xl font-semibold">
              {currentNavItem?.label || "Dashboard"}
            </h2>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
      </Sidebar>

  )
}


export default function AppShellWrapper(props: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppShell {...props} />
    </SidebarProvider>
  )
}
