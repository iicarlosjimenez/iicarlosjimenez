import Stripe from 'stripe';

export default new Stripe(getEnvVar("NEXT_STRIPE_SECRET_KEY"));
