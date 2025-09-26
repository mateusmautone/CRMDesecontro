"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ClientStatus } from "@/lib/types"

type ChartData = {
  status: ClientStatus;
  count: number;
  fill: string;
}

const chartConfig = {
  count: {
    label: "Clients",
  },
  Lead: {
    label: "Lead",
    color: "hsl(var(--chart-1))",
  },
  Contacted: {
    label: "Contacted",
    color: "hsl(var(--chart-2))",
  },
  Negotiating: {
    label: "Negotiating",
    color: "hsl(var(--chart-3))",
  },
  Won: {
    label: "Won",
    color: "hsl(var(--chart-4))",
  },
  Lost: {
    label: "Lost",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function LeadsByStatusChart({ data }: { data: ChartData[] }) {
  const totalClients = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0)
  }, [data])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline">Leads by Status</CardTitle>
        <CardDescription>Current distribution of client stages</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardContent className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-center pt-4 text-lg font-medium leading-none">
          <span>Total Clients: {totalClients}</span>
        </div>
      </CardContent>
    </Card>
  )
}
