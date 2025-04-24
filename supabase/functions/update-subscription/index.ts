import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@12.0.0';
import { corsHeaders } from '../../_shared/cors.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }
    // Get the authenticated user
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
        return new Response(JSON.stringify({ error: 'No authorization header' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 401,
        });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 401,
        });
    }

    try {
        const { newPlanId } = await req.json();

        // Get user's active subscription
        const { data: subscription, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

        if (subError || !subscription) {
            return new Response(JSON.stringify({ error: 'No active subscription found' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 404,
            });
        }

        // Get new price ID
        let priceId;
        let planName;

        if (newPlanId === 'monthly') {
            // Check if discount should apply
            const createdDate = new Date(subscription.created_at);
            const currentDate = new Date();
            const monthsSinceCreation =
                (currentDate.getFullYear() - createdDate.getFullYear()) * 12 +
                (currentDate.getMonth() - createdDate.getMonth());

            if (monthsSinceCreation >= 4) {
                const { data: prices } = await stripe.prices.list({
                    lookup_keys: ['monthly_discounted'],
                    limit: 1,
                });
                priceId = prices.data[0]?.id;
                planName = "Monthly Plan (Discounted)";
            } else {
                const { data: prices } = await stripe.prices.list({
                    lookup_keys: ['monthly_full'],
                    limit: 1,
                });
                priceId = prices.data[0]?.id;
                planName = "Monthly Plan";
            }
        } else if (newPlanId === 'yearly') {
            const { data: prices } = await stripe.prices.list({
                lookup_keys: ['yearly'],
                limit: 1,
            });
            priceId = prices.data[0]?.id;
            planName = "Yearly Plan";
        }

        if (!priceId) {
            throw new Error(`Price not found for plan: ${newPlanId}`);
        }

        await stripe.subscriptions.update(subscription.id, {
            items: [
                {
                    id: (await stripe.subscriptions.retrieve(subscription.id)).items.data[0].id,
                    price: priceId,
                },
            ],
            // Reset cancellation status if previously set to cancel
            cancel_at_period_end: false,
        });

        // Update subscription in database
        await supabase
            .from('subscriptions')
            .update({
                plan_id: newPlanId,
                plan_name: planName,
                cancel_at_period_end: false
            })
            .eq('id', subscription.id);

        return new Response(JSON.stringify({
            success: true,
            message: 'Subscription updated successfully'
        }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 400,
        });
    }
});