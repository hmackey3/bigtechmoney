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

        // Cancel subscription at period end
        await stripe.subscriptions.update(subscription.id, {
            cancel_at_period_end: true,
        });

        // Update subscription in database
        await supabase
            .from('subscriptions')
            .update({ cancel_at_period_end: true })
            .eq('id', subscription.id);

        return new Response(JSON.stringify({
            success: true,
            message: 'Subscription will be canceled at the end of the billing period'
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
