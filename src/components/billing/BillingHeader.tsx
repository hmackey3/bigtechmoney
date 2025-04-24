
import { FileDown } from "lucide-react";

interface BillingHeaderProps {
  invoicesCount: number;
}

export function BillingHeader({ invoicesCount }: BillingHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-muted-foreground">
        <FileDown className="h-5 w-5" />
        <span>{invoicesCount} invoices in total</span>
      </div>
    </div>
  );
}
