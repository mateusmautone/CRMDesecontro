"use client";

import { useQuery } from "@tanstack/react-query";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { LeadsByStatusChart } from "@/components/dashboard/leads-by-status-chart";
import { RecentNegotiations } from "@/components/dashboard/recent-negotiations";
import { listClients } from "@/lib/api/clients";
import { listNegotiations } from "@/lib/api/negotiations";
import { mapClientDtoToClient, mapNegotiationDtoToNegotiation } from "@/lib/mappers";
import { ClientStatus } from "@/lib/types";

export default function DashboardView() {
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const dtos = await listClients();
      return dtos.map(mapClientDtoToClient);
    },
  });

  const { data: negotiations = [] } = useQuery({
    queryKey: ["negotiations"],
    queryFn: async () => {
      const dtos = await listNegotiations();
      return dtos.map((dto) => mapNegotiationDtoToNegotiation(dto));
    },
  });

  // Métricas por tipo de parceiro
  const totalParceiros = clients.length;
  const brechosConfirmados = clients.filter(
    (c) => c.type === "Brechó" && c.status === "Confirmado"
  ).length;
  const djsConfirmados = clients.filter(
    (c) => c.type === "DJ" && c.status === "Confirmado"
  ).length;
  const foodConfirmados = clients.filter(
    (c) => c.type === "Food" && c.status === "Confirmado"
  ).length;
  const confirmados = clients.filter((c) => c.status === "Confirmado").length;
  const emNegociacao = clients.filter(
    (c) => c.status === "Em negociação"
  ).length;

  const leadsByStatusData = (
    Object.keys(
      clients.reduce((acc, client) => {
        acc[client.status] = (acc[client.status] || 0) + 1;
        return acc;
      }, {} as Record<ClientStatus, number>)
    ) as ClientStatus[]
  ).map((status) => ({
    status,
    count: clients.filter((c) => c.status === status).length,
    fill: `var(--color-${status.replace(" ", "")})`,
  }));

  const recentNegotiations = negotiations.slice(0, 5);

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
