"use client";

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Negotiation, NegotiationStatus } from "@/lib/types";
import { NEGOTIATIONS } from "@/lib/data";

const statusVariant: Record<NegotiationStatus, "default" | "secondary" | "destructive"> = {
  "Active": "default",
  "Pending": "secondary",
  "Closed - Won": "default",
  "Closed - Lost": "destructive",
}

export function NegotiationList() {
    const [negotiations] = useState<Negotiation[]>(NEGOTIATIONS);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredNegotiations = useMemo(() => {
        return negotiations.filter(
            (neg) =>
                neg.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                neg.agreementDetails.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [negotiations, searchTerm]);

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <Input
                    placeholder="Search negotiations by client or details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Agreement Details</TableHead>
                            <TableHead>Last Updated</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredNegotiations.map((neg) => (
                            <TableRow key={neg.id}>
                                <TableCell>
                                    <div className="font-medium">{neg.clientName}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusVariant[neg.status]}>{neg.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <p className="truncate max-w-md">{neg.agreementDetails}</p>
                                </TableCell>
                                <TableCell>{neg.lastUpdated}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
