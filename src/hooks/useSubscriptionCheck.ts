import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'enterprise';

interface SubscriptionCheck {
    hasActiveSubscription: boolean;
    currentPlan: SubscriptionPlan;
    teamMemberLimit: number;
    canAccessFeature: (feature: string) => boolean;
}

export function useSubscriptionCheck(): SubscriptionCheck {
    const [subscription, setSubscription] = useState<{
        hasActiveSubscription: boolean;
        currentPlan: SubscriptionPlan;
    }>({
        hasActiveSubscription: false,
        currentPlan: 'free',
    });

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: subscriptionData, error } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('status', 'active')
                    .single();
                console.log(subscriptionData)

                if (error) {
                    console.error('Error fetching subscription:', error);
                    return;
                }

                setSubscription({
                    hasActiveSubscription: !!subscriptionData,
                    currentPlan: subscriptionData?.plan || 'free',
                });
            } catch (error) {
                console.error('Error checking subscription:', error);
            }
        };

        checkSubscription();
    }, []);

    const getTeamMemberLimit = (plan: SubscriptionPlan): number => {
        switch (plan) {
            case 'free':
                return 5;
            case 'starter':
                return 5;
            case 'pro':
                return 50;
            case 'enterprise':
                return 1000;
            default:
                return 5;
        }
    };

    const canAccessFeature = (feature: string): boolean => {
        if (!subscription.hasActiveSubscription) return false;

        switch (feature) {
            case 'notifications':
                return subscription.currentPlan !== 'free';
            case 'team_members':
                return true;
            default:
                return false;
        }
    };

    return {
        hasActiveSubscription: subscription.hasActiveSubscription,
        currentPlan: subscription.currentPlan,
        teamMemberLimit: getTeamMemberLimit(subscription.currentPlan),
        canAccessFeature,
    };
} 