"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Kanban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { AppLogo } from "@/components/icons";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Parceiros", icon: Users },
  { href: "/negotiations", label: "Negociações", icon: Briefcase },
  { href: "/leads", label: "Pipeline", icon: Kanban },
];

export default function AppShellClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const currentNavItem = navItems.find((item) => item.href === pathname);

  return (
    <div className="flex h-screen bg-background max-w-[100vw]">
      {/* Sidebar - Dark theme */}
      <aside
        className={`relative flex flex-col bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-16" : "w-64"} border-r border-white/5`}
      >
        {/* Logo + Title */}
        <div className="flex items-center h-16 px-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <AppLogo className="w-9 h-9 text-primary flex-shrink-0" />
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              }`}
            >
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                Desencontro
              </span>
              <span className="block text-[10px] font-medium text-white/50 uppercase tracking-widest">
                CRM
              </span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }
                  ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? "text-white" : ""
                  }`}
                />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={`p-3 border-t border-white/5 ${
            isCollapsed ? "hidden" : ""
          }`}
        >
          <div className="px-3 py-2 rounded-xl bg-white/5">
            <p className="text-xs text-white/40">
              Moda circular • Cultura urbana
            </p>
          </div>
        </div>

        {/* Toggle button - agora na borda direita, mais visível */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all duration-200"
          aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden w-[100vw]">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background/80 backdrop-blur-xl">
          <div className="w-full px-6">
            <h1 className="text-2xl font-bold tracking-tight">
              {currentNavItem?.label || "Dashboard"}
            </h1>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
