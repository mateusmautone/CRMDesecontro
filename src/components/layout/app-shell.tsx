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
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/negotiations", label: "Negociações", icon: Briefcase },
  { href: "/leads", label: "Leads", icon: Kanban },
]

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { open, toggleSidebar } = useSidebar()
  const currentNavItem = navItems.find((item) => item.href === pathname)

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <AppLogo className="size-8 text-primary" />
            <span className="text-lg font-semibold text-primary group-data-[state=collapsed]:hidden">
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
                    <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
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
