import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Negotiation, NegotiationStatus } from "@/lib/types";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const statusConfig: Record<
  NegotiationStatus,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ElementType;
    className: string;
  }
> = {
  Ativa: {
    variant: "default",
    icon: Clock,
    className: "bg-blue-500/10 text-blue-600 border-blue-200",
  },
  Pendente: {
    variant: "secondary",
    icon: AlertCircle,
    className: "bg-amber-500/10 text-amber-600 border-amber-200",
  },
  "Fechada - Ganhos": {
    variant: "default",
    icon: CheckCircle2,
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  },
  "Fechada - Perdida": {
    variant: "destructive",
    icon: XCircle,
    className: "bg-red-500/10 text-red-600 border-red-200",
  },
};

export function RecentNegotiations({
  negotiations,
}: {
  negotiations: Negotiation[];
}) {
  return (
    <Card className="border-0 shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          Negociações Recentes
        </CardTitle>
        <CardDescription className="text-xs">
          Acompanhamento das conversas em andamento
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div className="divide-y max-h-full overflow-y-auto">
          {negotiations.map((neg) => {
            const config = statusConfig[neg.status];
            const StatusIcon = config.icon;
            return (
              <div
                key={neg.id}
                className="px-6 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{neg.clientName}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {neg.agreementDetails}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-2 py-0.5 font-medium ${config.className}`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {neg.status.replace("Fechada - ", "")}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {neg.lastUpdated}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
