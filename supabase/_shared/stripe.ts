
import Stripe from 'https://esm.sh/stripe@12.16.0?target=deno'

// Get the Stripe key from environment variables
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')

if (!stripeKey) {
    console.error('STRIPE_SECRET_KEY environment variable is not set')
}

// Initialize the Stripe client synchronously
let stripeClient = null
try {
    if (stripeKey) {
        stripeClient = new Stripe(stripeKey, {
            apiVersion: '2023-10-16',
            httpClient: Stripe.createFetchHttpClient(),
        })
        console.log('Stripe client initialized successfully')
    } else {
        throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }
} catch (error) {
    console.error('Failed to initialize Stripe client:', error)
}

// Export the stripe client
export const stripe = stripeClient
