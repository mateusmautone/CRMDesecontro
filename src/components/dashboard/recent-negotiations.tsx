import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Negotiation, NegotiationStatus } from "@/lib/types"

const statusVariant: Record<NegotiationStatus, "default" | "secondary" | "destructive"> = {
  "Active": "default",
  "Pending": "secondary",
  "Closed - Won": "default",
  "Closed - Lost": "destructive",
}

export function RecentNegotiations({ negotiations }: { negotiations: Negotiation[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Active Negotiations</CardTitle>
        <CardDescription>
          A summary of ongoing and recent negotiations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Last Updated</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {negotiations.map((neg) => (
              <TableRow key={neg.id}>
                <TableCell>
                  <div className="font-medium">{neg.clientName}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[neg.status]}>{neg.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{neg.lastUpdated}</TableCell>
                <TableCell className="text-right truncate max-w-xs">
                  {neg.agreementDetails}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
