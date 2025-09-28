"use client";

import { Appearance, loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { FormEvent, useState } from "react";
import Stripe from 'stripe';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  beerCount: number;
}

function CheckoutForm({ beerCount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);
    setProcessing(true);

    try {
      // Solicita el clientSecret a la API
      const response = await fetch("/api/create-payment-intent", {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({ amount: beerCount })
      })

      const { clientSecret } = await response.json();

      // Genera pago
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: 'Beer Supporter'
          }
        }
      })

      if (result.error) {
        setError(result.error.message || 'Error en el pago');
      }
      else {
        setSucceeded(true);
      }
    } 
    catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        const { type, message, code } = error
        setError(message);
      }

      setError("Error al intentar hacer el pago. Verifique sus datos.")
    }

    setLoading(false);
    setProcessing(false);
  }

  if (succeeded) {
    return (
      <div className="flex flex-col text-2xl gap-2">
        <h3>¡Gracias por las cervezas!</h3>
        <p className="text-lg">Tu apoyo significa mucho para mí</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 md:justify-between items-center">
        <p className="text-2xl">Invitando {beerCount} cervezas</p>
        <span className="text-xl">($ {(beerCount).toFixed(2)} USD)</span>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <CardElement>

        </CardElement>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || processing || loading }
          className="pay-button"
        >
          {processing ? (
            <span>Procesando...</span>
          ) : (
            <button className="w-full bg-white dark:bg-black text-black dark:text-white text-xl p-4 rounded-xl">
              Pagar
            </button>
          )}
        </button>
      </form>
    </>
  );
}

export default function BuyMeBeer() {
  const [beerCount, setBeerCount] = useState(2);
  const [showPayment, setShowPayment] = useState(false);

  const appearance: Appearance = {
    theme: "stripe",
  };

  return (
    <div className="flex flex-col rounded-xl gap-4 px-4 md:px-6 py-5 md:py-7 font-comfortaa bg-black text-white dark:bg-white dark:text-black">
      {/* Header */}
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-4xl">Buy me a Beer</h2>
        <p className="text-6xl">🍻</p>
      </div>

      {!showPayment ? (
        // Content
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-2 md:justify-between items-center">
            {/* Number */}
            <label htmlFor="beerCount" className="block text-xl font-medium">
              No de cervezas:
            </label>
            <input
              type="number"
              id="beerCount"
              min="2"
              value={beerCount}
              onChange={(e) => setBeerCount(parseInt(e.target.value) || 2)}
              className="md:w-14 border-2 rounded-lg md:text-end text-center text-2xl"
            ></input>
          </div>

          {/* Body */}
          <div className="text-2xl">
            Total: ${(beerCount).toFixed(2)} USD
          </div>

          {/* Footer */}
          <button
            onClick={() => setShowPayment(true)}
            className="w-full bg-white dark:bg-black text-black dark:text-white text-xl p-4 rounded-xl"
          >
            Continuar al pago
          </button>
        </div>
      ) : (
        // Content
        <div className="flex flex-col gap-4">

          {/* Body */}
          <Elements stripe={stripePromise} options={{ appearance }}>
            <CheckoutForm beerCount={beerCount} />
          </Elements>

          {/* Footer */}
          <button 
            onClick={() => setShowPayment(false)}
            className="w-full border p-1 rounded-xl"
          >
            Volver
          </button>
        </div>
      )}
    </div>
  );
}
