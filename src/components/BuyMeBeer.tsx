"use client";

import { useTranslation } from "next-i18next";
import { Appearance, loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { ChangeEvent, FormEvent, useState } from "react";
import Stripe from 'stripe';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  beerCount: number;
  amount: number;
}

function CheckoutForm({ beerCount, amount }: CheckoutFormProps) {
  const { t } = useTranslation("common");
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
        const { message } = error
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
        <h3>
          {t("buymeabeer.thanks")}
        </h3>
        <p className="text-lg">
          {t("buymeabeer.cheers")}!!!
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="select-none flex flex-col md:flex-row gap-2 md:justify-between items-center">
        <p className="text-2xl">
          {t("buymeabeer.with")} {beerCount} {t("buymeabeer.beers-house")}
        </p>
      <div className="flex flex-col md:flex-row gap-2 md:justify-between items-center">
        <p className="text-2xl">Invitando {beerCount} cervezas</p>
        <span className="text-xl">($ {(beerCount).toFixed(2)} USD)</span>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-2">
            <label htmlFor='card-number' className="block text-xl font-medium">
              {t("buymeabeer.cardelements.number")}
            </label>
            <CardNumberElement 
              id='card-number' 
              className="border-2 rounded-full text-2xl p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor='card-expiry' className="block text-xl font-medium">
                {t("buymeabeer.cardelements.expire")}
              </label>
              <CardExpiryElement id='card-expiry' 
                className="border-2 rounded-full text-2xl p-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor='card-cvv' className="block text-xl font-medium">
                {t("buymeabeer.cardelements.cvc")}
              </label>
              <CardCvcElement id='card-cvv' 
                className="border-2 rounded-full text-2xl p-2"
              />
            </div>
          </div>
        </div>

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
            <span>
              ...
            </span>
          ) : (
            <button className="cursor-pointer w-full text-xl p-4 rounded-full bg-white dark:bg-black text-black dark:text-white">
              {t("buymeabeer.pay")}
            </button>
          )}
        </button>
      </form>
    </>
  );
}

export default function BuyMeBeer() {
  const { t } = useTranslation("common");
  const [beerCount, setBeerCount] = useState(2);
  const [showPayment, setShowPayment] = useState(false);

  const appearance: Appearance = {
    theme: "stripe",
  };

  return (
    <div className="flex flex-col rounded-xl gap-4 px-4 md:px-6 py-5 md:py-7 font-comfortaa bg-black text-white dark:bg-white dark:text-black">
      {/* Header */}
      <div className="select-none text-center">
        <h2 className="text-4xl">
          {t("buymeabeer.title-buy-me-a-beer")}
          <span>🍻</span>
        </h2>
      </div>

      {!showPayment ? (
        // Content
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-2 md:justify-between items-center">
            {/* Number */}
            <label htmlFor="beerCount" className="block text-xl font-medium">
              {t("buymeabeer.beer-count")}:
            </label>
            <input
              type="number"
              id="beerCount"
              min="2"
              value={beerCount}
              onChange={(e) => setBeerCount(parseInt(e.target.value) || 2)}
              className="md:w-14 border-2 rounded-full md:text-end text-center text-2xl"
            ></input>
          </div>

          {/* Body */}
          <div className="select-none text-2xl">
            Total: ${(beerCount).toFixed(2)} USD
          </div>

          {/* Footer */}
          <button
            onClick={() => setShowPayment(true)}
            className="select-none cursor-pointer w-full text-xl p-4 rounded-full bg-white dark:bg-black text-black dark:text-white"
          >
            {t("buymeabeer.beer-count")}
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
            className="cursor-pointer w-full border p-1 rounded-full"
          >
            {t("buymeabeer.go-back")}
          </button>
        </div>
      )}
    </div>
  );
}
