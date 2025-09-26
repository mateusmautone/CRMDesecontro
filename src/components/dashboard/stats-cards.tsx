import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, Handshake, Target } from "lucide-react"

type StatsCardsProps = {
  totalClients: number;
  activeNegotiations: number;
  dealsWon: number;
  newLeads: number;
}

export function StatsCards({ totalClients, activeNegotiations, dealsWon, newLeads }: StatsCardsProps) {
  const stats = [
    { title: "Total de Clientes", value: totalClients, icon: Users },
    { title: "Negociações Ativas", value: activeNegotiations, icon: Handshake },
    { title: "Negócios Ganhos (YTD)", value: dealsWon, icon: Briefcase },
    { title: "Novos Leads", value: newLeads, icon: Target },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
