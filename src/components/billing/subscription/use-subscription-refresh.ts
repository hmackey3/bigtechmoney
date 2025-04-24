
import { useEffect, useState } from "react";

interface UseSubscriptionRefreshProps {
  refreshData?: () => void;
}

export function useSubscriptionRefresh({ refreshData }: UseSubscriptionRefreshProps) {
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  // Only trigger refresh when lastUpdate changes and is not null (initial state)
  useEffect(() => {
    if (refreshData && lastUpdate !== null) {
      const timer = setTimeout(() => {
        refreshData();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [lastUpdate, refreshData]);

  const triggerRefresh = () => setLastUpdate(Date.now());

  return { triggerRefresh };
}
