"use client";

import * as React from "react";
import { Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ClientStatus } from "@/lib/types";

type ChartData = {
  status: ClientStatus;
  count: number;
  fill: string;
};

const statusColors: Record<ClientStatus, string> = {
  Convidado: "#64748b",
  "Em conversa": "#f59e0b",
  "Em negociação": "#3b82f6",
  Confirmado: "#10b981",
  Cancelado: "#ef4444",
};

const chartConfig = {
  count: {
    label: "Parceiros",
  },
  Convidado: {
    label: "Convidado",
    color: statusColors.Convidado,
  },
  "Em conversa": {
    label: "Em conversa",
    color: statusColors["Em conversa"],
  },
  "Em negociação": {
    label: "Em negociação",
    color: statusColors["Em negociação"],
  },
  Confirmado: {
    label: "Confirmado",
    color: statusColors.Confirmado,
  },
  Cancelado: {
    label: "Cancelado",
    color: statusColors.Cancelado,
  },
} satisfies ChartConfig;

export function LeadsByStatusChart({ data }: { data: ChartData[] }) {
  const totalClients = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0);
  }, [data]);

  const dataWithColors = data.map((item) => ({
    ...item,
    fill: statusColors[item.status],
  }));

  return (
    <Card className="flex flex-col border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Parceiros por Status
        </CardTitle>
        <CardDescription className="text-xs">
          Distribuição atual do pipeline
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={dataWithColors}
              dataKey="count"
              nameKey="status"
              innerRadius={55}
              outerRadius={85}
              strokeWidth={2}
              stroke="hsl(var(--background))"
            >
              {dataWithColors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardContent className="pt-0 pb-4">
        <div className="text-center">
          <p className="text-3xl font-bold">{totalClients}</p>
          <p className="text-xs text-muted-foreground">Total de parceiros</p>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {dataWithColors.map((item) => (
            <div key={item.status} className="flex items-center gap-2 text-xs">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-muted-foreground truncate">
                {item.status}
              </span>
              <span className="font-medium ml-auto">{item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
