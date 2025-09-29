import AppShellWrapper from "@/components/layout/app-shell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShellWrapper>{children}</AppShellWrapper>;
}
