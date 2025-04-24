
import { ReactNode } from "react";

interface SubscriptionStatusBadgeProps {
  status: string;
  children: ReactNode;
}

export function SubscriptionStatusBadge({ status, children }: SubscriptionStatusBadgeProps) {
  const getStatusStyles = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusStyles(status)}`}>
      {children}
    </div>
  );
}
