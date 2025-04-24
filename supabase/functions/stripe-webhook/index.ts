import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@12.0.0';
import { corsHeaders } from '../../_shared/cors.ts';
import { stripe } from '../../_shared/stripe.ts';

// const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return new Response('Missing stripe-signature header', { status: 400 });
    }

    try {
        const body = await req.text();
        let event
        try {
            event = await stripe.webhooks.constructEventAsync(
                body,
                signature,
                endpointSecret
            );

        } catch (err) {
            return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        console.log(`Processing webhook event: ${event.type}`);

        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                await handleCheckoutSessionCompleted(session);
                break;
            }
            case 'invoice.paid': {
                const invoice = event.data.object;
                await handleInvoicePaid(invoice);
                break;
            }
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                await handleInvoicePaymentFailed(invoice);
                break;
            }
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                await handleSubscriptionUpdated(subscription);
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                await handleSubscriptionDeleted(subscription);
                break;
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (err) {
        console.error(`Error processing webhook: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
});

async function handleCheckoutSessionCompleted(session) {
    // Get customer and subscription details from the session
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    if (!subscriptionId) {
        console.log('No subscription found in session');
        return;
    }

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const supabaseUserId = session.metadata.user_id;

    if (!supabaseUserId) {
        console.error('No user_id found in session metadata');
        return;
    }

    // Get the subscription plan details
    const product = await stripe.products.retrieve(subscription.items.data[0].price.product);
    const planName = product.name;
    const planId = product.metadata.plan_id || '';

    // Store subscription data in Supabase
    const { error } = await supabase.from('subscriptions').upsert({
        id: subscriptionId,
        user_id: supabaseUserId,
        customer_id: customerId,
        status: subscription.status,
        plan_id: planId,
        plan_name: planName,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        created_at: new Date(subscription.created * 1000).toISOString(),
        discount_applied: false, // Will be updated after 4 months if applicable
    });

    if (error) {
        console.error('Error inserting subscription data:', error);
    }

    // Also update the user's metadata
    await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId, subscription_status: subscription.status })
        .eq('id', supabaseUserId);
}

async function handleInvoicePaid(invoice) {
    const subscriptionId = invoice.subscription;
    if (!subscriptionId) return;

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Get subscription from Supabase
    const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .single();

    if (subError) {
        console.error('Error retrieving subscription:', subError);
        return;
    }

    // Calculate if we need to apply a discount (for monthly plans after 4 months)
    const planId = subData.plan_id;
    const createdDate = new Date(subData.created_at);
    const currentDate = new Date();
    const monthsSinceCreation =
        (currentDate.getFullYear() - createdDate.getFullYear()) * 12 +
        (currentDate.getMonth() - createdDate.getMonth());

    let discountApplied = false;
    let discountAmount = 0;

    // Apply discount logic for monthly subscriptions after 4 months
    if (planId === 'monthly' && monthsSinceCreation >= 4 && !subData.discount_applied) {
        // Get the price the customer is currently paying
        const currentPrice = invoice.lines.data[0].amount / 100; // Convert from cents

        if (currentPrice === 249) {
            // Apply discount - change to $99/month
            try {
                // Find the $99 price object
                const { data: prices } = await stripe.prices.list({
                    lookup_keys: ['monthly_discounted'],
                    limit: 1,
                });

                if (prices.data.length > 0) {
                    const discountedPriceId = prices.data[0].id;

                    // Update the subscription to use the discounted price
                    await stripe.subscriptions.update(subscriptionId, {
                        items: [
                            {
                                id: subscription.items.data[0].id,
                                price: discountedPriceId,
                            },
                        ],
                    });

                    discountApplied = true;
                    discountAmount = 249 - 99; // $150 discount
                }
            } catch (err) {
                console.error('Error applying discount:', err);
            }
        }
    }

    // Update subscription in Supabase
    await supabase.from('subscriptions').update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        discount_applied: discountApplied,
        discount_amount: discountAmount,
    }).eq('id', subscriptionId);
}

async function handleInvoicePaymentFailed(invoice) {
    const subscriptionId = invoice.subscription;
    if (!subscriptionId) return;

    // Get subscription from Supabase
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('id', subscriptionId)
        .single();

    if (!subscription) return;

    // Update subscription status in Supabase
    await supabase.from('subscriptions').update({
        status: 'past_due',
    }).eq('id', subscriptionId);

    // Update user profile status
    await supabase
        .from('profiles')
        .update({ subscription_status: 'past_due' })
        .eq('id', subscription.user_id);

    // Here you would typically send an email to the user about the failed payment
    // Or trigger a notification in your application
}

async function handleSubscriptionUpdated(subscription) {
    // Update subscription data in Supabase
    await supabase.from('subscriptions').update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
    }).eq('id', subscription.id);

    // Get user ID associated with this subscription
    const { data } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('id', subscription.id)
        .single();

    if (data) {
        // Update user profile status
        await supabase
            .from('profiles')
            .update({ subscription_status: subscription.status })
            .eq('id', data.user_id);
    }
}

async function handleSubscriptionDeleted(subscription) {
    // Get user ID associated with this subscription
    const { data } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('id', subscription.id)
        .single();

    // Update subscription in database
    await supabase.from('subscriptions').update({
        status: 'canceled',
        cancel_at_period_end: false,
        ended_at: new Date(subscription.ended_at * 1000).toISOString(),
    }).eq('id', subscription.id);

    if (data) {
        // Update user profile status
        await supabase
            .from('profiles')
            .update({ subscription_status: 'canceled' })
            .eq('id', data.user_id);
    }
}