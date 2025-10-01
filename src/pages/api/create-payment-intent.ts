// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { amount, currency = "mxn" } = req.body;
  
  if (amount < 2) {
    return res.status(400).json({ error: "Minimum amount is 2" });
  }

  try {
    // Crear el Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      const { type, message, code } = err
  
      res.status(500).json({ 
        error: {
          type,
          message,
          code
        } 
      });
    }

    return res.status(500).json({
      error: 'internal_error',
      message: 'An unexpected error occurred',
    });
  }
}
