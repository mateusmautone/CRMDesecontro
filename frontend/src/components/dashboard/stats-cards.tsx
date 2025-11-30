import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  ShirtIcon,
  Music2,
  UtensilsCrossed,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

type StatsCardsProps = {
  totalParceiros: number;
  confirmados: number;
  brechosConfirmados: number;
  djsConfirmados: number;
  foodConfirmados: number;
  emNegociacao: number;
};

export function StatsCards({
  totalParceiros,
  confirmados,
  brechosConfirmados,
  djsConfirmados,
  foodConfirmados,
  emNegociacao,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Parceiros",
      value: totalParceiros,
      icon: Users,
      gradient: "from-slate-500 to-slate-600",
      bgGlow: "bg-slate-500/10",
    },
    {
      title: "Confirmados",
      value: confirmados,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-emerald-600",
      bgGlow: "bg-emerald-500/10",
    },
    {
      title: "Brechós",
      value: brechosConfirmados,
      icon: ShirtIcon,
      gradient: "from-violet-500 to-purple-600",
      bgGlow: "bg-violet-500/10",
    },
    {
      title: "DJs",
      value: djsConfirmados,
      icon: Music2,
      gradient: "from-pink-500 to-rose-600",
      bgGlow: "bg-pink-500/10",
    },
    {
      title: "Food",
      value: foodConfirmados,
      icon: UtensilsCrossed,
      gradient: "from-orange-500 to-amber-600",
      bgGlow: "bg-orange-500/10",
    },
    {
      title: "Em Negociação",
      value: emNegociacao,
      icon: MessageSquare,
      gradient: "from-blue-500 to-cyan-600",
      bgGlow: "bg-blue-500/10",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className={`absolute inset-0 ${stat.bgGlow}`} />
          <CardContent className="p-4 relative">
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs font-medium text-muted-foreground">
                {stat.title}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
