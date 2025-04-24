
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InvoicesTableProps {
  invoices: any[];
  formatDate: (timestamp: number) => string;
}

export function InvoicesTable({ invoices, formatDate }: InvoicesTableProps) {
  if (invoices.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <p className="text-muted-foreground">No invoices found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.number || invoice.id}</TableCell>
              <TableCell>{formatDate(invoice.created)}</TableCell>
              <TableCell>{invoice.description || "Subscription payment"}</TableCell>
              <TableCell>{new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: invoice.currency || 'USD',
                minimumFractionDigits: 2
              }).format(invoice.amount_paid / 100)}</TableCell>
              <TableCell>
                <Badge 
                  variant={invoice.status === "paid" ? "default" : "secondary"}
                  className={invoice.status === "paid" ? "bg-green-500" : "bg-yellow-500"}
                >
                  {invoice.status === "paid" ? "Paid" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => window.open(invoice.invoice_pdf, '_blank')}>
                  <FileDown className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
