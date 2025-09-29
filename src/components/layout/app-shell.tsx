"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Briefcase, PanelLeft, Kanban, ChevronsLeft, ChevronsRight } from "lucide-react"
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
import { Button } from "@/components/ui/button"

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
  const { setIsDefaultCollapsed, open, toggleSidebar } = useSidebar();
  
  const currentNavItem = navItems.find((item) => item.href === pathname);

  React.useEffect(() => {
    setIsDefaultCollapsed(currentNavItem?.isDefaultCollapsed || false);
  }, [pathname, setIsDefaultCollapsed, currentNavItem]);


  return (
    <div className="flex">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <AppLogo className="size-8 text-primary" />
            <span className="text-lg font-semibold text-primary group-data-[collapsible=icon]:hidden">
              Desencontro CRM
            </span>
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
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -translate-y-1/2 z-20 h-8 w-6 bg-background text-foreground border border-border rounded-full hover:bg-muted hidden md:flex group-data-[side=left]:right-0 group-data-[side=left]:translate-x-1/2 group-data-[side=right]:left-0 group-data-[side=right]:-translate-x-1/2"
          onClick={toggleSidebar}
        >
          {open ? <ChevronsLeft className="size-4" /> : <ChevronsRight className="size-4" />}
        </Button>
      </Sidebar>
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
    </div>
  )
}


export default function AppShellWrapper(props: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppShell {...props} />
    </SidebarProvider>
  )
}
