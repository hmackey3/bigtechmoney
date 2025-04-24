/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface StripePrice {
    id: string;
    nickname?: string;
    unit_amount: number;
    currency: string;
    product: {
        id: string;
        name: string;
        description?: string;
        metadata: {
            plan: string;
            frequency: string;
            [key: string]: any; // optional: allows extra metadata fields
        };
    };

}

export const useFetchStripePrices = () => {
    const [prices, setPrices] = useState<StripePrice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPrices = useCallback(async () => {
        try {
            setIsLoading(true);

            const { data, error } = await supabase.functions.invoke<StripePrice[]>(
                "get-stripe-prices"
            );

            if (error) {
                throw error;
            }

            setPrices(data || []);
        } catch (error) {
            console.error("Error fetching Stripe prices:", error);
            toast.error("Failed to load Stripe prices");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrices();
    }, [fetchPrices]);

    return {
        prices,
        isLoading,
        fetchPrices,
    };
};
