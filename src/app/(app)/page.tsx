import { StatsCards } from "@/components/dashboard/stats-cards";
import { LeadsByStatusChart } from "@/components/dashboard/leads-by-status-chart";
import { RecentNegotiations } from "@/components/dashboard/recent-negotiations";
import { CLIENTS, NEGOTIATIONS } from "@/lib/data";
import { ClientStatus } from "@/lib/types";

export default function DashboardPage() {
  const totalClients = CLIENTS.length;
  const activeNegotiations = NEGOTIATIONS.filter(n => n.status === 'Active').length;
  const dealsWon = CLIENTS.filter(c => c.status === 'Won').length;
  const newLeads = CLIENTS.filter(c => c.status === 'Lead').length;

  const leadsByStatusData = (Object.keys(CLIENTS.reduce((acc, client) => {
    acc[client.status] = (acc[client.status] || 0) + 1;
    return acc;
  }, {} as Record<ClientStatus, number>)) as ClientStatus[]).map(status => ({
    status,
    count: CLIENTS.filter(c => c.status === status).length,
    fill: `var(--color-${status})`
  }));
  
  const recentNegotiations = NEGOTIATIONS.slice(0, 5);

  return (
    <div className="space-y-6">
      <StatsCards 
        totalClients={totalClients}
        activeNegotiations={activeNegotiations}
        dealsWon={dealsWon}
        newLeads={newLeads}
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
