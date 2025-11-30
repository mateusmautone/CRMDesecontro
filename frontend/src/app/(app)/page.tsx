import { StatsCards } from "@/components/dashboard/stats-cards";
import { LeadsByStatusChart } from "@/components/dashboard/leads-by-status-chart";
import { RecentNegotiations } from "@/components/dashboard/recent-negotiations";
import { CLIENTS, NEGOTIATIONS } from "@/lib/data";
import { ClientStatus } from "@/lib/types";

export default function DashboardPage() {
  // Métricas por tipo de parceiro
  const totalParceiros = CLIENTS.length;
  const brechosConfirmados = CLIENTS.filter(
    (c) => c.type === "Brechó" && c.status === "Confirmado"
  ).length;
  const djsConfirmados = CLIENTS.filter(
    (c) => c.type === "DJ" && c.status === "Confirmado"
  ).length;
  const foodConfirmados = CLIENTS.filter(
    (c) => c.type === "Food" && c.status === "Confirmado"
  ).length;
  const confirmados = CLIENTS.filter((c) => c.status === "Confirmado").length;
  const emNegociacao = CLIENTS.filter(
    (c) => c.status === "Em negociação"
  ).length;

  const leadsByStatusData = (
    Object.keys(
      CLIENTS.reduce((acc, client) => {
        acc[client.status] = (acc[client.status] || 0) + 1;
        return acc;
      }, {} as Record<ClientStatus, number>)
    ) as ClientStatus[]
  ).map((status) => ({
    status,
    count: CLIENTS.filter((c) => c.status === status).length,
    fill: `var(--color-${status.replace(" ", "")})`,
  }));

  const recentNegotiations = NEGOTIATIONS.slice(0, 5);

  return (
    <div className="space-y-6 h-full">
      <StatsCards
        totalParceiros={totalParceiros}
        confirmados={confirmados}
        brechosConfirmados={brechosConfirmados}
        djsConfirmados={djsConfirmados}
        foodConfirmados={foodConfirmados}
        emNegociacao={emNegociacao}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <LeadsByStatusChart data={leadsByStatusData} />
        </div>
        <div className="lg:col-span-2">
          <RecentNegotiations negotiations={recentNegotiations} />
        </div>
      </div>
    </div>
  );
}
