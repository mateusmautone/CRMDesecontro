"use client"

import type { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import dynamic from 'next/dynamic'

const AppShellClient = dynamic(() => import('./app-shell-client'), { ssr: false })

export default function AppShellWrapper(props: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppShellClient {...props} />
    </SidebarProvider>
  )
}
