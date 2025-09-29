import { useSidebar as useSidebarFromUi } from "@/components/ui/sidebar"

/**
 * @deprecated Use `import { useSidebar } from "@/components/ui/sidebar"` instead
 */
export function useSidebar() {
  return useSidebarFromUi()
}
