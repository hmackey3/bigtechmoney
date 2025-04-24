import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@12.0.0';
import { corsHeaders } from '../../_shared/cors.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
    // Get the authenticated us
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }
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
        const { planId, origin } = await req.json();


        // Get or create customer
        let customerId;
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (profile?.stripe_customer_id) {
            customerId = profile.stripe_customer_id;
        } else {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    supabase_user_id: user.id,
                },
            });
            customerId = customer.id;

            // Save customer ID to user profile
            await supabase
                .from('profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id);
        }

        const { data: prices } = await stripe.prices.list({
            active: true,
            limit: 100,
        });
        if (!prices) {
            throw new Error('No prices found');
        }
        // return new Response(JSON.stringify({ prices: prices }), {
        //     headers: { 'Content-Type': 'application/json', ...corsHeaders },
        //     status: 200,
        // });
        const price = prices.find(p => p.lookup_key?.toLowerCase().includes(planId.toLowerCase()));
        const priceId = price?.id;


        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/subscription/cancel`,
            metadata: {
                user_id: user.id,
            },
        });


        return new Response(JSON.stringify({ sessionId: session.id }), {
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