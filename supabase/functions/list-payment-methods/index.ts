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
        // Get user's Stripe customer ID
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (!profile?.stripe_customer_id) {
            return new Response(JSON.stringify({ payment_methods: [] }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 200,
            });
        }

        // Get payment methods from Stripe
        const paymentMethods = await stripe.paymentMethods.list({
            customer: profile.stripe_customer_id,
            type: 'card',
        });

        return new Response(JSON.stringify({ payment_methods: paymentMethods.data }), {
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